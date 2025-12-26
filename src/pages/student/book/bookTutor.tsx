// ========================
// 1. IMPORTS
// ========================
import { ChangeEvent, useEffect, useState, type FC } from "react";
import {
    MdAttachMoney,
    MdDateRange,
    MdDescription,
    MdFormatListBulleted,
    MdLocationOn,
    MdMenuBook,
    MdOutlineCastForEducation,
    MdSchool,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";

import {
    selectBalance,
    selectListLearningScheduleForStudent,
    selectListTutorSchedule,
    selectPublicTutor,
} from "../../../app/selector";

import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
    csvToArray,
    formatDateToYMD,
    groupSchedulesByWeek,
    useDocumentTitle,
} from "../../../utils/helper";

import {
    DatePickerElement,
    LoadingSpinner,
    WeekCalendar,
} from "../../../components/elements";

import { publicGetDetailTutorApiThunk } from "../../../services/public/tutor/tutorThunk";

import { createClassRequestForStudentApiThunk } from "../../../services/student/bookingTutor/bookingTutorThunk";

import {
    checkBalanceApiThunk,
    tranferToAdminApiThunk,
} from "../../../services/wallet/walletThunk";

import {
    ConfirmPaymentModal,
    RemindWalletModal,
} from "../../../components/modal";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { get } from "lodash";
import type {
    Schedule,
    CreateClassRequestParams,
} from "../../../types/student";
import type { WalletBalance } from "../../../types/wallet";
import { getAllTutorScheduleApiThunk } from "../../../services/booking/bookingThunk";
import { getAllLearingScheduleForStudentApiThunk } from "../../../services/student/learningSchedule/learningScheduleThunk";

export type ScheduleItem = {
    id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    entryType: string;

    // optional cho phần chỉ child mới có
    lessonId?: string;
    classId?: string;
    title?: string | null;
    attendanceStatus?: string | null;
};

// ========================
// 2. COMPONENT
// ========================
const StudentBookTutor: FC = () => {
    // ========================
    // 2.1 PARAMS + REDUX
    // ========================
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const bookingPrice = 50000;

    const tutor = useAppSelector(selectPublicTutor);
    const learningSchedules =
        useAppSelector(selectListLearningScheduleForStudent) || [];
    const tutorSchedules = useAppSelector(selectListTutorSchedule) || [];
    const balance: WalletBalance | null = useAppSelector(selectBalance);

    const mergedSchedules: ScheduleItem[] = [
        ...learningSchedules,
        ...tutorSchedules,
    ];

    // ========================
    // 2.2 STATES
    // ========================
    const [classOptions, setClassOptions] = useState<string[]>([]);
    const [isRemindWalletOpen, setIsRemindWalletOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingValues, setPendingValues] =
        useState<CreateClassRequestParams | null>(null);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    const busySchedules = groupSchedulesByWeek(
        Array.isArray(mergedSchedules) ? mergedSchedules : [],
    );
    const tutorSubjects = csvToArray(tutor?.teachingSubjects || "");

    // ========================
    // 2.3 SIDE EFFECTS
    // ========================
    useEffect(() => {
        dispatch(publicGetDetailTutorApiThunk(id!));
        dispatch(checkBalanceApiThunk());
    }, [dispatch, id]);

    useDocumentTitle("Đặt lịch gia sư");

    // ========================
    // 3. FORMIK CONFIG
    // ========================
    const initialValues: CreateClassRequestParams = {
        studentUserId: null,
        tutorId: tutor?.tutorProfileId || null,
        subject: "",
        educationLevel: "",
        description: "",
        location: "",
        budget: 0,
        mode: "Offline",
        classStartDate: "",
        specialRequirements: "",
        schedules: [],
    };

    const validationSchema = Yup.object({
        subject: Yup.string().required("Vui lòng chọn môn học"),
        educationLevel: Yup.string().required("Vui lòng chọn lớp"),
        description: Yup.string().required("Vui lòng nhập mô tả"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
        }),
        mode: Yup.string().oneOf(["Offline", "Online"]).required(),
        classStartDate: Yup.string()
            .required("Vui lòng chọn ngày bắt đầu")
            .test(
                "min-4-days",
                "Ngày bắt đầu học phải sau hôm nay ít nhất 4 ngày",
                (value) => {
                    if (!value) return false;

                    const selectedDate = new Date(value);
                    const today = new Date();

                    // reset giờ để so sánh chính xác theo ngày
                    today.setHours(0, 0, 0, 0);

                    const minDate = new Date(today);
                    minDate.setDate(minDate.getDate() + 4);

                    return selectedDate >= minDate;
                },
            ),
        budget: Yup.number().min(0),
        schedules: Yup.array()
            .of(
                Yup.object({
                    dayOfWeek: Yup.number().required(),
                    startTime: Yup.string().required(),
                    endTime: Yup.string().required(),
                }),
            )
            .min(1, "Vui lòng chọn ít nhất 1 buổi học"),
    });

    const handleConfirmPayment = () => {
        if (!pendingValues || isConfirmLoading) return;

        setIsConfirmLoading(true);

        // Transform schedules: convert "HH:mm" to "HH:mm:ss" format
        const transformedValues = {
            ...pendingValues,
            schedules: pendingValues.schedules.map((s) => ({
                ...s,
                startTime:
                    s.startTime.includes(":") &&
                    s.startTime.split(":").length === 2
                        ? `${s.startTime}:00`
                        : s.startTime,
                endTime:
                    s.endTime.includes(":") && s.endTime.split(":").length === 2
                        ? `${s.endTime}:00`
                        : s.endTime,
            })),
        };

        dispatch(
            tranferToAdminApiThunk({
                Amount: bookingPrice,
                Note: "Phí đặt lịch gia sư",
            }),
        )
            .unwrap()
            .then(() => {
                return dispatch(
                    createClassRequestForStudentApiThunk(transformedValues),
                ).unwrap();
            })
            .then((res) => {
                toast.success(get(res, "data.message", "Đặt lịch thành công"));
                navigateHook(routes.student.information + "?tab=booking_tutor");
            })
            .catch((err) => {
                toast.error(get(err, "data.message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsConfirmLoading(false);
                setIsConfirmOpen(false);
                setPendingValues(null);
            });
    };

    const calculateMonthlyFee = (
        educationLevel: string,
        schedulesPerWeek: number,
        durationPerSession: number = 90, // mặc định 90 phút
    ) => {
        // Bảng giá theo lớp
        const feeTable: Record<string, { short: number; long: number }> = {
            "Lớp 1": { short: 100000, long: 120000 },
            "Lớp 2": { short: 100000, long: 120000 },
            "Lớp 3": { short: 100000, long: 120000 },
            "Lớp 4": { short: 100000, long: 120000 },
            "Lớp 5": { short: 100000, long: 120000 },

            "Lớp 6": { short: 120000, long: 150000 },
            "Lớp 7": { short: 120000, long: 150000 },
            "Lớp 8": { short: 120000, long: 150000 },
            "Lớp 9": { short: 120000, long: 150000 },

            "Lớp 10": { short: 150000, long: 180000 },
            "Lớp 11": { short: 150000, long: 180000 },
            "Lớp 12": { short: 150000, long: 180000 },
        };

        const feeInfo = feeTable[educationLevel];
        if (!feeInfo) return 0;

        // Chọn giá theo thời lượng buổi học
        const pricePerSession =
            durationPerSession < 120 ? feeInfo.short : feeInfo.long;

        // Tính tổng cho 1 tháng (4 tuần)
        return pricePerSession * schedulesPerWeek * 4;
    };

    // ========================
    // 4. RENDER
    // ========================
    return (
        <section id="student-book-tutor-section">
            <div className="sbts-container">
                <h2>Đặt lịch gia sư</h2>

                {/** ========================
                     FORMIK FORM
                ========================= */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(false);

                        if (balance?.balance! < bookingPrice) {
                            setIsRemindWalletOpen(true);
                            return;
                        }

                        setPendingValues(values);
                        setIsConfirmOpen(true);
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => {
                        // ========================
                        // 4.1 EFFECT: LOAD SCHEDULE WHEN DATE CHANGES
                        // ========================
                        useEffect(() => {
                            if (
                                tutor?.tutorProfileId &&
                                values.classStartDate
                            ) {
                                const start = formatDateToYMD(
                                    new Date(values.classStartDate),
                                );

                                const endDate = new Date(values.classStartDate);
                                endDate.setDate(endDate.getDate() + 30);
                                const end = formatDateToYMD(endDate);

                                dispatch(
                                    getAllTutorScheduleApiThunk({
                                        tutorProfileId: String(
                                            tutor.tutorProfileId,
                                        ),
                                        startDate: start,
                                        endDate: end,
                                    }),
                                );
                                dispatch(
                                    getAllLearingScheduleForStudentApiThunk({
                                        startDate: start,
                                        endDate: end,
                                    }),
                                );
                            }
                        }, [
                            dispatch,
                            tutor?.tutorProfileId,
                            values.classStartDate,
                        ]);

                        // ========================
                        // 4.2 HANDLER: SUBJECT CHANGE → UPDATE CLASS OPTIONS
                        // ========================
                        const handleSubjectChange = (value: string) => {
                            setFieldValue("subject", value);
                            setFieldValue("educationLevel", "");

                            const level =
                                tutor?.teachingLevel?.toLowerCase() || "";
                            let options: string[] = [];

                            if (level.includes("tiểu học"))
                                options.push(
                                    ...Array.from(
                                        { length: 5 },
                                        (_, i) => `Lớp ${i + 1}`,
                                    ),
                                );

                            if (level.includes("trung học cơ sở"))
                                options.push(
                                    ...Array.from(
                                        { length: 4 },
                                        (_, i) => `Lớp ${i + 6}`,
                                    ),
                                );

                            if (level.includes("trung học phổ thông"))
                                options.push(
                                    ...Array.from(
                                        { length: 3 },
                                        (_, i) => `Lớp ${i + 10}`,
                                    ),
                                );

                            setClassOptions(options);
                        };

                        // ========================
                        // 4.3 EFFECT: UPDATE BUDGET WHEN SCHEDULE CHANGES
                        // ========================
                        useEffect(() => {
                            if (
                                values.educationLevel &&
                                values.schedules &&
                                values.schedules.length > 0
                            ) {
                                const total = calculateMonthlyFee(
                                    values.educationLevel,
                                    values.schedules.length,
                                    90,
                                );
                                setFieldValue("budget", total);
                            } else {
                                setFieldValue("budget", 0, false);
                            }
                        }, [
                            values.educationLevel,
                            values.schedules,
                            setFieldValue,
                        ]);

                        return (
                            <Form className="form">
                                {/* ========================
                                    SECTION: MÔN HỌC
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Môn học
                                        <span>*</span>
                                    </label>
                                    <div className="form-input-container">
                                        <MdMenuBook className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="subject"
                                            className="form-input"
                                            onChange={(
                                                e: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                handleSubjectChange(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                -- Chọn môn học --
                                            </option>
                                            {tutorSubjects.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="subject"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* ========================
                                    SECTION: LỚP
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Lớp<span>*</span>
                                    </label>
                                    <div className="form-input-container">
                                        <MdSchool className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="educationLevel"
                                            className="form-input"
                                        >
                                            <option value="">
                                                -- Chọn lớp --
                                            </option>
                                            {classOptions.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="educationLevel"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* ========================
                                    SECTION: MÔ TẢ
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Mô tả<span>*</span>
                                    </label>
                                    <div className="form-input-container">
                                        <MdDescription className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="description"
                                            className="form-input"
                                            placeholder="Nhập mô tả"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* ========================
                                    SECTION: YÊU CẦU ĐẶC BIỆT
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Yêu cầu đặc biệt
                                    </label>
                                    <div className="form-input-container">
                                        <MdFormatListBulleted className="form-input-icon" />
                                        <Field
                                            type="text"
                                            name="specialRequirements"
                                            className="form-input"
                                            placeholder="Nhập yêu cầu đặc biệt"
                                        />
                                    </div>
                                </div>

                                {/* ========================
                                    SECTION: MODE (ONLINE/OFFLINE)
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Hình thức học
                                        <span>*</span>
                                    </label>
                                    <div className="form-input-container">
                                        <MdOutlineCastForEducation className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="mode"
                                            className="form-input"
                                        >
                                            <option value="Offline">
                                                Học tại nhà
                                            </option>
                                            <option value="Online">
                                                Học trực tuyến
                                            </option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="mode"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* ========================
                                    SECTION: ĐỊA CHỈ (OFFLINE ONLY)
                                ======================== */}
                                {values.mode === "Offline" && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            Địa chỉ
                                            <span>*</span>
                                        </label>
                                        <div className="form-input-container">
                                            <MdLocationOn className="form-input-icon" />
                                            <Field
                                                type="text"
                                                name="location"
                                                className="form-input"
                                                placeholder="Nhập địa chỉ học"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="location"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}

                                {/* ========================
                                    SECTION: NGÀY BẮT ĐẦU
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Ngày bắt đầu
                                        <span>*</span>
                                    </label>
                                    <div className="form-input-container">
                                        <MdDateRange className="form-input-icon" />
                                        <DatePickerElement
                                            placeholder="Chọn ngày bắt đầu học"
                                            value={
                                                values.classStartDate
                                                    ? new Date(
                                                          values.classStartDate,
                                                      )
                                                    : null
                                            }
                                            onChange={(date: any) =>
                                                setFieldValue(
                                                    "classStartDate",
                                                    date
                                                        ? formatDateToYMD(date)
                                                        : "",
                                                )
                                            }
                                        />
                                    </div>
                                    <p className="note">
                                        Ngày bắt đầu học cần cách hôm nay ít
                                        nhất 4 ngày để gia sư sắp xếp lịch. Sau
                                        khi chọn ngày, các khung giờ học phù hợp
                                        sẽ được hiển thị.
                                    </p>
                                    <ErrorMessage
                                        name="classStartDate"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* ========================
                                    SECTION: HỌC PHÍ
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Học phí 1 tháng
                                        <span>*</span>
                                    </label>
                                    <div className="form-input-container">
                                        <MdAttachMoney className="form-input-icon" />
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={
                                                values.budget
                                                    ? values.budget.toLocaleString(
                                                          "vi-VN",
                                                      ) + " VND"
                                                    : ""
                                            }
                                            readOnly
                                        />
                                    </div>
                                    <p className="note">
                                        Học phí tự động cập nhật theo số buổi
                                        dạy.
                                    </p>
                                </div>

                                <div className="calendar-container">
                                    <h3>Bảng học phí được tính theo buổi dạy</h3>
                                    <table className="table">
                                        <thead className="table-head">
                                            <tr className="table-head-row">
                                                <th className="table-head-cell">
                                                    Khối học
                                                </th>
                                                <th className="table-head-cell">
                                                    Lớp học
                                                </th>
                                                <th className="table-head-cell">
                                                    Học phí
                                                    <br />
                                                    (dưới 120 phút 1 buổi)
                                                </th>
                                                <th className="table-head-cell">
                                                    Học phí <br />
                                                    (120 phút 1 buổi)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            <tr className="table-body-row">
                                                <td className="table-body-cell">
                                                    Tiểu học
                                                </td>
                                                <td className="table-body-cell">
                                                    Lớp 1 - Lớp 5
                                                </td>
                                                <td className="table-body-cell">
                                                    100,000 VNĐ/buổi
                                                </td>
                                                <td className="table-body-cell">
                                                    120,000 VNĐ/buổi
                                                </td>
                                            </tr>
                                            <tr className="table-body-row">
                                                <td className="table-body-cell">
                                                    Trung học cơ sở
                                                </td>
                                                <td className="table-body-cell">
                                                    Lớp 6 - Lớp 9
                                                </td>
                                                <td className="table-body-cell">
                                                    120,000 VNĐ/buổi
                                                </td>
                                                <td className="table-body-cell">
                                                    150,000 VNĐ/buổi
                                                </td>
                                            </tr>
                                            <tr className="table-body-row">
                                                <td className="table-body-cell">
                                                    Trung học phổ thông
                                                </td>
                                                <td className="table-body-cell">
                                                    Lớp 10 - Lớp 12
                                                </td>
                                                <td className="table-body-cell">
                                                    150,000 VNĐ/buổi
                                                </td>
                                                <td className="table-body-cell">
                                                    180,000 VNĐ/buổi
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* ========================
                                    SECTION: WEEK CALENDAR
                                ======================== */}
                                {values.classStartDate && (
                                    <div className="calendar-container">
                                        <WeekCalendar
                                            busySchedules={busySchedules}
                                            onSelectedChange={(
                                                schedules: Schedule[],
                                            ) =>
                                                setFieldValue("schedules", [
                                                    ...schedules,
                                                ])
                                            }
                                        />

                                        <ErrorMessage
                                            name="schedules"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}

                                {values.schedules.length > 0 && (
                                    <>
                                        {/* ========================
                                    SECTION: TỔNG TIỀN
                                ======================== */}
                                        <div className="price-container">
                                            <div className="price-container-col">
                                                <h4>Phí đặt lịch</h4>
                                            </div>
                                            <div className="price-container-col">
                                                <p>
                                                    {bookingPrice.toLocaleString()}{" "}
                                                    VNĐ
                                                </p>
                                            </div>
                                        </div>

                                        <div className="price-container">
                                            <div className="price-container-col">
                                                <h4>Tổng cộng</h4>
                                            </div>
                                            <div className="price-container-col">
                                                <p>
                                                    {bookingPrice.toLocaleString()}{" "}
                                                    VNĐ
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ========================
                                    SECTION: SUBMIT BUTTON
                                ======================== */}
                                <div className="form-submit">
                                    <button
                                        type="submit"
                                        className={
                                            isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn payment-btn"
                                        }
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <LoadingSpinner />
                                        ) : (
                                            "Đặt lịch"
                                        )}
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>

            {/* ========================
                MODAL REMIND BALANCE
            ======================== */}
            <RemindWalletModal
                isOpen={isRemindWalletOpen}
                setIsOpen={setIsRemindWalletOpen}
                routes={routes.student.information + "?tab=wallet"}
            />

            <ConfirmPaymentModal
                isOpen={isConfirmOpen}
                totalAmount={bookingPrice}
                setIsOpen={setIsConfirmOpen}
                onConfirm={handleConfirmPayment}
                loading={isConfirmLoading}
            />
        </section>
    );
};

export default StudentBookTutor;
