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

import { RemindWalletModal } from "../../../components/modal";
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

    const busySchedules = groupSchedulesByWeek(
        Array.isArray(mergedSchedules) ? mergedSchedules : []
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
        classStartDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
        budget: Yup.number().min(0),
        schedules: Yup.array()
            .of(
                Yup.object({
                    dayOfWeek: Yup.number().required(),
                    startTime: Yup.string().required(),
                    endTime: Yup.string().required(),
                })
            )
            .min(1, "Vui lòng chọn lịch đúng số buổi"),
    });

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
                        setSubmitting(true);

                        const totalAmount =
                            values.mode === "Online"
                                ? bookingPrice + values.budget
                                : bookingPrice;

                        if (balance?.balance && balance.balance < totalAmount) {
                            setIsRemindWalletOpen(true);
                            setSubmitting(false);
                            return;
                        }

                        dispatch(
                            tranferToAdminApiThunk({
                                Amount: totalAmount,
                                Note: "Phí đặt lịch gia sư",
                            })
                        )
                            .unwrap()
                            .then(() => {
                                dispatch(
                                    createClassRequestForStudentApiThunk(values)
                                )
                                    .unwrap()
                                    .then((res) => {
                                        toast.success(
                                            get(
                                                res,
                                                "data.message",
                                                "Đặt lịch thành công"
                                            )
                                        );
                                        navigateHook(routes.student.home);
                                    })
                                    .catch((err) => {
                                        toast.error(
                                            get(
                                                err,
                                                "data.message",
                                                "Có lỗi xảy ra"
                                            )
                                        );
                                    });
                            })
                            .catch((err) => {
                                toast.error(
                                    get(err, "data.message", "Có lỗi xảy ra")
                                );
                            })
                            .finally(() => setSubmitting(false));
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
                                    new Date(values.classStartDate)
                                );

                                const endDate = new Date(values.classStartDate);
                                endDate.setDate(endDate.getDate() + 30);
                                const end = formatDateToYMD(endDate);

                                dispatch(
                                    getAllTutorScheduleApiThunk({
                                        tutorProfileId: String(
                                            tutor.tutorProfileId
                                        ),
                                        startDate: start,
                                        endDate: end,
                                    })
                                );
                                dispatch(
                                    getAllLearingScheduleForStudentApiThunk({
                                        startDate: start,
                                        endDate: end,
                                    })
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
                                        (_, i) => `Lớp ${i + 1}`
                                    )
                                );

                            if (level.includes("trung học cơ sở"))
                                options.push(
                                    ...Array.from(
                                        { length: 4 },
                                        (_, i) => `Lớp ${i + 6}`
                                    )
                                );

                            if (level.includes("trung học phổ thông"))
                                options.push(
                                    ...Array.from(
                                        { length: 3 },
                                        (_, i) => `Lớp ${i + 10}`
                                    )
                                );

                            setClassOptions(options);
                        };

                        // ========================
                        // 4.3 EFFECT: UPDATE BUDGET WHEN SCHEDULE CHANGES
                        // ========================
                        useEffect(() => {
                            const count = values.schedules.length;
                            const feeMap: { [key: number]: number } = {
                                1: 500000,
                                2: 800000,
                                3: 1000000,
                                4: 1200000,
                                5: 1500000,
                                6: 1800000,
                            };
                            setFieldValue("budget", feeMap[count] || 0);
                        }, [values.schedules, setFieldValue]);

                        // ========================
                        // 4.4 UI FORM SECTIONS
                        // ========================
                        const priceOffline = bookingPrice;
                        const priceOnline = bookingPrice + values.budget;

                        return (
                            <Form className="form">
                                {/* ========================
                                    SECTION: MÔN HỌC
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Môn học
                                    </label>
                                    <div className="form-input-container">
                                        <MdMenuBook className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="subject"
                                            className="form-input"
                                            onChange={(
                                                e: ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                handleSubjectChange(
                                                    e.target.value
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
                                    <label className="form-label">Lớp</label>
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
                                    <label className="form-label">Mô tả</label>
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
                                    SECTION: NGÀY BẮT ĐẦU
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Ngày bắt đầu
                                    </label>
                                    <div className="form-input-container">
                                        <MdDateRange className="form-input-icon" />
                                        <DatePickerElement
                                            placeholder="Chọn ngày bắt đầu học"
                                            value={
                                                values.classStartDate
                                                    ? new Date(
                                                          values.classStartDate
                                                      )
                                                    : null
                                            }
                                            onChange={(date: any) =>
                                                setFieldValue(
                                                    "classStartDate",
                                                    date?.toISOString() || ""
                                                )
                                            }
                                        />
                                    </div>
                                    <p className="note">
                                        Sau khi chọn ngày, lịch học theo tuần sẽ
                                        hiện ra.
                                    </p>
                                </div>

                                {/* ========================
                                    SECTION: MODE (ONLINE/OFFLINE)
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Hình thức học
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
                                </div>

                                {/* ========================
                                    SECTION: ĐỊA CHỈ (OFFLINE ONLY)
                                ======================== */}
                                {values.mode === "Offline" && (
                                    <div className="form-field">
                                        <label className="form-label">
                                            Địa chỉ
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
                                    </div>
                                )}

                                {/* ========================
                                    SECTION: HỌC PHÍ
                                ======================== */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Học phí 1 tháng
                                    </label>
                                    <div className="form-input-container">
                                        <MdAttachMoney className="form-input-icon" />
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={
                                                values.budget
                                                    ? values.budget.toLocaleString(
                                                          "vi-VN"
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

                                {/* ========================
                                    SECTION: WEEK CALENDAR
                                ======================== */}
                                {values.classStartDate && (
                                    <div className="calendar-container">
                                        <WeekCalendar
                                            busySchedules={busySchedules}
                                            onSelectedChange={(
                                                schedules: Schedule[]
                                            ) =>
                                                setFieldValue(
                                                    "schedules",
                                                    schedules
                                                )
                                            }
                                        />
                                    </div>
                                )}

                                {/* ========================
                                    SECTION: TỔNG TIỀN
                                ======================== */}
                                <div className="price-container">
                                    <div className="price-container-col">
                                        <h4>Phí đặt lịch</h4>
                                    </div>
                                    <div className="price-container-col">
                                        <p>
                                            {bookingPrice.toLocaleString()} VNĐ
                                        </p>
                                    </div>
                                </div>

                                {values.mode === "Online" && (
                                    <div className="price-container">
                                        <div className="price-container-col">
                                            <h4>Học phí 1 tháng</h4>
                                        </div>
                                        <div className="price-container-col">
                                            <p>
                                                {values.budget.toLocaleString()}{" "}
                                                VNĐ
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="price-container">
                                    <div className="price-container-col">
                                        <h4>Tổng cộng</h4>
                                    </div>
                                    <div className="price-container-col">
                                        <p>
                                            {values.mode === "Online"
                                                ? priceOnline.toLocaleString() +
                                                  " VND"
                                                : priceOffline.toLocaleString() +
                                                  " VND"}
                                        </p>
                                    </div>
                                </div>

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
        </section>
    );
};

export default StudentBookTutor;
