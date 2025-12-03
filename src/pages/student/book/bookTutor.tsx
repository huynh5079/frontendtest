import { useEffect, useState, type FC } from "react";
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
    selectListTutorSchedule,
    selectPublicTutor,
} from "../../../app/selector";
import { useParams } from "react-router-dom";
import { publicGetDetailTutorApiThunk } from "../../../services/public/tutor/tutorThunk";
import { getAllTutorScheduleApiThunk } from "../../../services/booking/bookingThunk";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type {
    CreateClassRequestParams,
    Schedule,
} from "../../../types/student";
import { createClassRequestForStudentApiThunk } from "../../../services/student/bookingTutor/bookingTutorThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { get } from "lodash";
import type { WalletBalance } from "../../../types/wallet";
import {
    checkBalanceApiThunk,
    transferWalletApiThunk,
} from "../../../services/wallet/walletThunk";

const StudentBookTutor: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const bookingPrice = 50000;

    const tutor = useAppSelector(selectPublicTutor);
    const tutorSchedules = useAppSelector(selectListTutorSchedule);
    const balance: WalletBalance | null = useAppSelector(selectBalance);

    const busySchedules = groupSchedulesByWeek(
        Array.isArray(tutorSchedules) ? tutorSchedules : []
    );
    const tutorSubjects = csvToArray(tutor?.teachingSubjects || "");

    const [classOptions, setClassOptions] = useState<string[]>([]);

    useEffect(() => {
        dispatch(publicGetDetailTutorApiThunk(id!));
        dispatch(checkBalanceApiThunk());
    }, [dispatch, id]);

    useDocumentTitle("Đặt lịch gia sư");

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
        mode: Yup.string()
            .oneOf(["Offline", "Online"])
            .required("Vui lòng chọn hình thức học"),
        classStartDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
        budget: Yup.number().min(0, "Học phí phải >= 0"),
        schedules: Yup.array()
            .of(
                Yup.object().shape({
                    dayOfWeek: Yup.number().required(),
                    startTime: Yup.string().required(),
                    endTime: Yup.string().required(),
                })
            )
            .min(1, "Vui lòng chọn lịch đúng số buổi"),
    });

    return (
        <section id="student-book-tutor-section">
            <div className="sbts-container">
                <h2>Đặt lịch gia sư</h2>

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
                            toast.error(
                                "Số dư ví của bạn không đủ, vui lòng nạp thêm tiền."
                            );
                            setSubmitting(false);
                            return;
                        }

                        dispatch(createClassRequestForStudentApiThunk(values))
                            .unwrap()
                            .then(() => {
                                dispatch(
                                    transferWalletApiThunk({
                                        toUserId:
                                            "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                                        amount: totalAmount,
                                        note: "Phí đặt lịch gia sư",
                                    })
                                )
                                    .unwrap()
                                    .then((res) => {
                                        const message = get(
                                            res,
                                            "data.message",
                                            "Đặt lịch thành công"
                                        );
                                        toast.success(message);
                                        navigateHook(routes.student.home);
                                    });
                            })
                            .catch((error) => {
                                const errorData = get(
                                    error,
                                    "data.message",
                                    "Có lỗi xảy ra"
                                );
                                toast.error(errorData);
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => {
                        // Load lịch dạy theo startDate
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
                            }
                        }, [
                            dispatch,
                            tutor?.tutorProfileId,
                            values.classStartDate,
                        ]);

                        // Cập nhật classOptions theo teachingLevel
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

                        useEffect(() => {
                            const count = values.schedules.length;
                            let fee = 0;
                            if (count === 1) fee = 500000;
                            else if (count === 2) fee = 800000;
                            else if (count === 3) fee = 1000000;
                            else if (count === 4) fee = 1200000;
                            else if (count === 5) fee = 1500000;
                            else if (count === 6) fee = 1800000;
                            setFieldValue("budget", fee);
                        }, [values.schedules, setFieldValue]);

                        const priceOffline = bookingPrice;
                        const priceOnline = bookingPrice + values.budget;

                        return (
                            <Form className="form">
                                {/* Môn học */}
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
                                            onChange={(e: any) =>
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

                                {/* Lớp */}
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
                                            {classOptions.map((cls) => (
                                                <option key={cls} value={cls}>
                                                    {cls}
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

                                {/* Mô tả */}
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

                                {/* Yêu cầu đặc biệt */}
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
                                    <ErrorMessage
                                        name="specialRequirements"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Ngày bắt đầu */}
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
                                        Sau khi bạn chọn ngày bắt đầu học, lịch
                                        học trong tuần sẽ hiện ra để bạn lựa
                                        chọn buổi học phù hợp.
                                    </p>
                                    <ErrorMessage
                                        name="classStartDate"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Hình thức học */}
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
                                    <ErrorMessage
                                        name="mode"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Địa chỉ nếu Offline */}
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
                                        <ErrorMessage
                                            name="location"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                )}

                                <div className="form-field">
                                    <label className="form-label">
                                        Học phí 1 tháng
                                    </label>
                                    <div className="form-input-container">
                                        <MdAttachMoney className="form-input-icon" />
                                        <Field
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
                                        Học phí sẽ tự động cập nhật khi bạn chọn
                                        buổi học
                                    </p>
                                </div>

                                <div className="note-container">
                                    <p>
                                        Lưu ý:{" "}
                                        <span>
                                            Đối với hình thức học tại nhà, chúng
                                            tôi chỉ thu phí khi đặt lịch. Còn
                                            với hình thức học trực tuyến, học
                                            viên cần thanh toán trước học phí 1
                                            tháng cùng với phí đặt lịch.
                                        </span>
                                    </p>
                                </div>

                                {values.classStartDate && (
                                    <div className="calendar-container">
                                        {/* Lịch tuần */}
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
                                            <h4>Học phí một tháng</h4>
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
        </section>
    );
};

export default StudentBookTutor;
