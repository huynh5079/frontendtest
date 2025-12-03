import { useEffect, useState, type FC } from "react";
import {
    MdAttachMoney,
    MdDateRange,
    MdDescription,
    MdLinkOff,
    MdLocationOn,
    MdMenuBook,
    MdOutlineCastForEducation,
    MdPersonAdd,
    MdSchool,
    MdTitle,
} from "react-icons/md";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectBalance,
    selectListTutorSchedule,
    selectProfileTutor,
} from "../../../app/selector";
import {
    csvToArray,
    formatDateToYMD,
    groupSchedulesByWeek,
    useDocumentTitle,
} from "../../../utils/helper";
import type { Schedule } from "../../../types/student";
import type { CreateClassParams } from "../../../types/tutor";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { WalletBalance } from "../../../types/wallet";
import {
    checkBalanceApiThunk,
    transferWalletApiThunk,
} from "../../../services/wallet/walletThunk";
import { toast } from "react-toastify";
import { createClassApiThunk } from "../../../services/tutor/class/classThunk";
import { get } from "lodash";
import { getAllTutorScheduleApiThunk } from "../../../services/booking/bookingThunk";
import {
    DatePickerElement,
    LoadingSpinner,
    WeekCalendar,
} from "../../../components/elements";

const TutorCreateClassPage: FC = () => {
    const dispatch = useAppDispatch();
    const createClassFee = 50000;

    const tutorInfo = useAppSelector(selectProfileTutor);
    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const tutorSchedules = useAppSelector(selectListTutorSchedule);

    const busySchedules = groupSchedulesByWeek(
        Array.isArray(tutorSchedules) ? tutorSchedules : []
    );

    const tutorSubjects = csvToArray(tutorInfo?.teachingSubjects || "");

    const [classOptions, setClassOptions] = useState<string[]>([]);

    useEffect(() => {
        dispatch(checkBalanceApiThunk());
    }, [dispatch]);

    useDocumentTitle("Tạo lớp học");

    const initialValues: CreateClassParams = {
        subject: "",
        educationLevel: "",
        description: "",
        location: "",
        price: 0,
        mode: "Offline",
        classStartDate: "",
        title: "",
        scheduleRules: [],
        onlineStudyLink: "",
        studentLimit: 0,
    };

    const validationSchema = Yup.object({
        subject: Yup.string().required("Vui lòng chọn môn học"),
        educationLevel: Yup.string().required("Vui lòng chọn lớp"),
        description: Yup.string().required("Vui lòng nhập mô tả"),
        title: Yup.string().required("Vui lòng nhập chủ đề"),
        onlineStudyLink: Yup.string().when("mode", {
            is: "Online",
            then: (schema) =>
                schema.required("Vui lòng nhập đường liên kết lớp học"),
        }),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
        }),
        mode: Yup.string()
            .oneOf(["Offline", "Online"])
            .required("Vui lòng chọn hình thức học"),
        classStartDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
        price: Yup.number().min(0, "Học phí phải >= 0"),
        scheduleRules: Yup.array()
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
        <section id="tutor-create-class-section">
            <div className="tccs-container">
                <div className="tccscr1">
                    <h4>Tạo lớp học</h4>
                    <p>
                        Lớp học <span>Tạo lớp học</span>
                    </p>
                </div>
                <div className="tccscr2">
                    <button
                        className="sc-btn"
                        onClick={() => {
                            navigateHook(routes.tutor.class.list);
                        }}
                    >
                        Quay lại
                    </button>
                </div>
                <div className="tccscr3">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            setSubmitting(true);

                            if (
                                balance?.balance &&
                                balance.balance < createClassFee
                            ) {
                                toast.error(
                                    "Số dư ví của bạn không đủ, vui lòng nạp thêm tiền."
                                );
                                setSubmitting(false);
                                return;
                            }

                            dispatch(createClassApiThunk(values))
                                .unwrap()
                                .then(() => {
                                    dispatch(
                                        transferWalletApiThunk({
                                            toUserId:
                                                "0E85EF35-39C1-418A-9A8C-0F83AC9520A6",
                                            amount: createClassFee,
                                            note: "Phí tạo lớp học",
                                        })
                                    )
                                        .unwrap()
                                        .then((res) => {
                                            const message = get(
                                                res,
                                                "data.message",
                                                "Tạo thành công"
                                            );
                                            toast.success(message);
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
                                    resetForm();
                                });
                        }}
                    >
                        {({ values, setFieldValue, isSubmitting }) => {
                            // Load lịch dạy theo startDate
                            useEffect(() => {
                                if (
                                    tutorInfo?.tutorProfileId &&
                                    values.classStartDate
                                ) {
                                    const start = formatDateToYMD(
                                        new Date(values.classStartDate)
                                    );
                                    const endDate = new Date(
                                        values.classStartDate
                                    );
                                    endDate.setDate(endDate.getDate() + 30);
                                    const end = formatDateToYMD(endDate);

                                    dispatch(
                                        getAllTutorScheduleApiThunk({
                                            tutorProfileId: String(
                                                tutorInfo?.tutorProfileId
                                            ),
                                            startDate: start,
                                            endDate: end,
                                        })
                                    );
                                }
                            }, [
                                dispatch,
                                tutorInfo?.tutorProfileId,
                                values.classStartDate,
                            ]);

                            // Cập nhật classOptions theo teachingLevel
                            const handleSubjectChange = (value: string) => {
                                setFieldValue("subject", value);
                                setFieldValue("educationLevel", "");

                                const level =
                                    tutorInfo?.teachingLevel?.toLowerCase() ||
                                    "";
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

                            return (
                                <Form className="form">
                                    {/* Chủ đề */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Chủ đề
                                        </label>
                                        <div className="form-input-container">
                                            <MdTitle className="form-input-icon" />
                                            <Field
                                                type="text"
                                                name="title"
                                                className="form-input"
                                                placeholder="Nhập chủ đề"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="title"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                    {/* Mô tả */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Mô tả
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
                                        <label className="form-label">
                                            Lớp
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
                                                {classOptions.map((cls) => (
                                                    <option
                                                        key={cls}
                                                        value={cls}
                                                    >
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
                                    <div className="form-field">
                                        <label className="form-label">
                                            Số lượng học sinh tối đa
                                        </label>
                                        <div className="form-input-container">
                                            <MdPersonAdd className="form-input-icon" />
                                            <Field
                                                type="number"
                                                min="1"
                                                name="studentLimit"
                                                className="form-input"
                                                placeholder="Nhập số lượng học sinh tối đa"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="studentLimit"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Học phí 1 tháng
                                        </label>
                                        <div className="form-input-container">
                                            <MdAttachMoney className="form-input-icon" />
                                            <Field
                                                type="number"
                                                name="price"
                                                className="form-input"
                                                placeholder="Nhập giá học phí"
                                                onChange={(e: any) => {
                                                    const val = Number(
                                                        e.target.value
                                                    );
                                                    setFieldValue(
                                                        "price",
                                                        val >= 0 ? val : 0
                                                    );
                                                }}
                                            />
                                        </div>
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
                                    {/* Đường liên kết lớp học nếu Online */}
                                    {values.mode === "Online" && (
                                        <div className="form-field">
                                            <label className="form-label">
                                                Đường liên kết lớp học
                                            </label>
                                            <div className="form-input-container">
                                                <MdLinkOff className="form-input-icon" />
                                                <Field
                                                    type="text"
                                                    name="onlineStudyLink"
                                                    className="form-input"
                                                    placeholder="Nhập đường liên kết lớp học"
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="onlineStudyLink"
                                                component="div"
                                                className="text-error"
                                            />
                                        </div>
                                    )}{" "}
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
                                                        date?.toISOString() ||
                                                            ""
                                                    )
                                                }
                                            />
                                        </div>
                                        <p className="note">
                                            Sau khi bạn chọn ngày bắt đầu học,
                                            lịch học trong tuần sẽ hiện ra để
                                            bạn lựa chọn buổi học phù hợp.
                                        </p>
                                        <ErrorMessage
                                            name="classStartDate"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>
                                    {values.classStartDate && (
                                        <div className="calendar-container">
                                            {/* Lịch tuần */}
                                            <WeekCalendar
                                                busySchedules={busySchedules}
                                                onSelectedChange={(
                                                    scheduleRules: Schedule[]
                                                ) =>
                                                    setFieldValue(
                                                        "scheduleRules",
                                                        scheduleRules
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
                                                {createClassFee.toLocaleString()}{" "}
                                                VNĐ
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
                                                "Tạo lớp học"
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default TutorCreateClassPage;
