import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "lodash";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
    selectDetailClassRequestForStudent,
    selectListApplyRequestFindTutorForStudent,
    selectListClassRequestForStudent,
} from "../../../app/selector";

import {
    createClassRequestForStudentApiThunk,
    getAllClassRequestForStudentApiThunk,
    getDetailClassRequestForStudentApiThunk,
} from "../../../services/student/bookingTutor/bookingTutorThunk";

import {
    acceptApplyRequestFindTutorForStudentApiThunk,
    getAllApplyRequestFindTutorForStudentApiThunk,
    rejectApplyRequestFindTutorForStudentApiThunk,
} from "../../../services/student/requestFindTutor/requestFindTutorThunk";

import { formatDate, useDocumentTitle } from "../../../utils/helper";
import {
    DatePickerElement,
    LoadingSpinner,
    WeekCalendarFindTutor,
} from "../../elements";
import {
    CancelBookingTutorForStudent,
    UpdateRequestFindTutorForStudentModal,
} from "../../modal";

import type { CreateClassRequestParams } from "../../../types/student";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

type LevelType = "Tiểu học" | "Trung học cơ sở" | "Trung học phổ thông";

const subjectsByLevel: Record<LevelType, string[]> = {
    "Tiểu học": ["Toán", "Tiếng Anh", "Tiếng Việt"],
    "Trung học cơ sở": [
        "Toán",
        "Tiếng Anh",
        "Ngữ Văn",
        "Vật Lý",
        "Hóa Học",
        "Sinh Học",
    ],
    "Trung học phổ thông": [
        "Toán",
        "Tiếng Anh",
        "Ngữ Văn",
        "Vật Lý",
        "Hóa Học",
        "Sinh Học",
    ],
};

const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
];

const StudentRequestFindTutor: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const bookingTutors = useAppSelector(
        selectListClassRequestForStudent
    )?.filter((b) => !b.tutorName);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);
    const applyRequests = useAppSelector(
        selectListApplyRequestFindTutorForStudent
    );

    const [isStep, setIsStep] = useState(1);
    const [level, setLevel] = useState<LevelType | "">("");
    const [_, setSubject] = useState("");
    const [classOptions, setClassOptions] = useState<string[]>([]);
    const [sessionsPerWeek, setSessionsPerWeek] = useState<number | "">("");
    const [tuitionFee, setTuitionFee] = useState<number>(0);
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] =
        useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] =
        useState(false);

    // === EFFECTS ===
    useEffect(() => {
        dispatch(getAllClassRequestForStudentApiThunk());
    }, [dispatch]);
    useEffect(() => {
        if (id) dispatch(getDetailClassRequestForStudentApiThunk(id));
    }, [dispatch, id]);
    useEffect(() => {
        if (id && bookingTutor?.status === "Pending")
            dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id));
    }, [dispatch, id, bookingTutor]);

    useDocumentTitle("Danh sách đơn tìm gia sư");

    // === HANDLERS ===
    const handleNextStep = () => setIsStep((prev) => prev + 1);
    const handlePrevStep = () => setIsStep((prev) => prev - 1);
    const handleBack = () => navigate(`/student/information?tab=request`);
    const handleViewDetail = (id: string) =>
        navigate(`/student/information?tab=request&id=${id}`);

    const handleLevelChange = (value: LevelType | "") => {
        setLevel(value);
        setSubject("");
        setClassOptions(
            value === "Tiểu học"
                ? Array.from({ length: 5 }, (_, i) => `Lớp ${i + 1}`)
                : value === "Trung học cơ sở"
                ? Array.from({ length: 4 }, (_, i) => `Lớp ${i + 6}`)
                : value === "Trung học phổ thông"
                ? Array.from({ length: 3 }, (_, i) => `Lớp ${i + 10}`)
                : []
        );
    };

    const handleSubjectChange = (value: string) => setSubject(value);

    const handleSessionsChange = (
        e: ChangeEvent<HTMLInputElement>,
        setFieldValue: any
    ) => {
        const value = e.target.value;
        const numberValue = parseInt(value, 10);
        setSessionsPerWeek(value === "" ? "" : numberValue);

        const fee =
            numberValue === 2
                ? 800000
                : numberValue === 3
                ? 1000000
                : numberValue === 4
                ? 1200000
                : 0;
        setTuitionFee(fee);

        // cập nhật trực tiếp budget trong Formik
        setFieldValue("budget", fee);
    };

    const handleAcceptApply = async (applyId: string) => {
        await dispatch(acceptApplyRequestFindTutorForStudentApiThunk(applyId))
            .unwrap()
            .then((res) =>
                toast.success(get(res, "data.message", "Xử lí thành công"))
            )
            .catch((err) =>
                toast.error(get(err, "data.message", "Có lỗi xảy ra"))
            )
            .finally(() =>
                dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id!))
            );
    };

    const handleRejectApply = async (applyId: string) => {
        await dispatch(rejectApplyRequestFindTutorForStudentApiThunk(applyId))
            .unwrap()
            .then((res) =>
                toast.success(get(res, "data.message", "Xử lí thành công"))
            )
            .catch((err) =>
                toast.error(get(err, "data.message", "Có lỗi xảy ra"))
            )
            .finally(() =>
                dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id!))
            );
    };

    const getStatusText = (status?: string | null) => {
        switch (status) {
            case "Pending":
                return "Chờ xử lý";
            case "Approved":
            case "Accepted":
                return "Đã chấp thuận";
            case "Rejected":
                return "Đã từ chối";
            case "Ongoing":
                return "Đang học";
            default:
                return "Không có";
        }
    };

    // === FORM INITIAL & VALIDATION ===
    const initialValues: CreateClassRequestParams = {
        studentUserId: null,
        tutorId: null,
        subject: "",
        educationLevel: "",
        description: "",
        location: "",
        budget: tuitionFee,
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
            then: (s) => s.required("Vui lòng nhập địa chỉ học"),
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
        <div className="student-request-find-tutor">
            {isStep === 1 && (
                <div
                    className={`srft-step-1 step ${
                        isStep === 1 ? "step-active" : "step-hidden"
                    }`}
                >
                    {!id ? (
                        <>
                            <div className="srfts1r1">
                                <h3>Danh sách đơn tìm gia sư</h3>
                                <button
                                    className="pr-btn"
                                    onClick={handleNextStep}
                                >
                                    Tạo đơn
                                </button>
                            </div>
                            <div className="srfts1r2">
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-head-row">
                                            <th className="table-head-cell">
                                                Môn học
                                            </th>
                                            <th className="table-head-cell">
                                                Cấp bậc học
                                            </th>
                                            <th className="table-head-cell">
                                                Thời gian đặt lịch
                                            </th>
                                            <th className="table-head-cell">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {bookingTutors?.map((bookingTutor) => (
                                            <tr key={bookingTutor.id}>
                                                <td className="table-body-cell">
                                                    {bookingTutor.subject}
                                                </td>
                                                <td className="table-body-cell">
                                                    {
                                                        bookingTutor.educationLevel
                                                    }
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(
                                                        bookingTutor.createdAt
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    <button
                                                        className="pr-btn"
                                                        onClick={() =>
                                                            handleViewDetail(
                                                                bookingTutor.id
                                                            )
                                                        }
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            setIsCancelBookingTutorModalOpen(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Huỷ lịch
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Chi tiết bookingTutor */}
                            <div className="srfts1r1">
                                <h3>Chi tiết lịch đặt gia sư</h3>
                                <button className="pr-btn" onClick={handleBack}>
                                    Quay lại
                                </button>
                            </div>
                            <div className="detail-request-find-tutor">
                                <div className="drftc1">
                                    <h4>Học sinh</h4>
                                    <p>{bookingTutor?.studentName}</p>

                                    <h4>Mô tả</h4>
                                    <p>{bookingTutor?.description}</p>

                                    {bookingTutor?.mode === "Offline" && (
                                        <>
                                            <h4>Địa điểm</h4>
                                            <p>{bookingTutor?.location}</p>
                                        </>
                                    )}

                                    <h4>Yêu cầu đặc biệt</h4>
                                    <p>{bookingTutor?.specialRequirements}</p>

                                    <h4>Ngày bắt đầu</h4>
                                    <p>
                                        {formatDate(
                                            String(bookingTutor?.classStartDate)
                                        )}
                                    </p>

                                    <h4>Ngày hết hạn</h4>
                                    <p>
                                        {formatDate(
                                            String(bookingTutor?.expiryDate)
                                        )}
                                    </p>

                                    <h4>Ngày tạo</h4>
                                    <p>
                                        {formatDate(
                                            String(bookingTutor?.createdAt)
                                        )}
                                    </p>
                                </div>

                                <div className="drftc2">
                                    <h4>Môn học</h4>
                                    <p>{bookingTutor?.subject}</p>

                                    <h4>Cấp bậc học</h4>
                                    <p>{bookingTutor?.educationLevel}</p>

                                    <h4>Hình thức học</h4>
                                    <p>{bookingTutor?.mode}</p>

                                    <h4>Học phí</h4>
                                    <p>
                                        {bookingTutor?.budget?.toLocaleString()}{" "}
                                        VNĐ
                                    </p>

                                    <h4>Trạng thái</h4>
                                    <p>{getStatusText(bookingTutor?.status)}</p>

                                    <h4>Lịch học</h4>
                                    {bookingTutor?.schedules?.map(
                                        (s, index) => (
                                            <div key={index}>
                                                <h4>
                                                    {daysOfWeek[s.dayOfWeek]}
                                                </h4>
                                                <p>
                                                    {s.startTime} → {s.endTime}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Danh sách ứng tuyển */}
                            <div className="srfts1r2">
                                <h3>Danh sách ứng tuyển</h3>
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-head-row">
                                            <th className="table-head-cell">
                                                Tên gia sư
                                            </th>
                                            <th className="table-head-cell">
                                                Trạng thái
                                            </th>
                                            <th className="table-head-cell">
                                                Thời gian ứng tuyển
                                            </th>
                                            <th className="table-head-cell">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {applyRequests?.map((applyRequest) => (
                                            <tr key={applyRequest.id}>
                                                <td className="table-body-cell">
                                                    {applyRequest.tutorName}
                                                </td>
                                                <td className="table-body-cell">
                                                    {getStatusText(
                                                        applyRequest.status
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(
                                                        applyRequest.createdAt
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    {applyRequest.status ===
                                                        "Pending" && (
                                                        <>
                                                            <button
                                                                className="pr-btn"
                                                                onClick={() => {
                                                                    handleAcceptApply(
                                                                        applyRequest.id
                                                                    );
                                                                }}
                                                            >
                                                                Chấp thuận
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => {
                                                                    handleRejectApply(
                                                                        applyRequest.id
                                                                    );
                                                                }}
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        className="sc-btn"
                                                        onClick={() => {}}
                                                    >
                                                        Chi tiết gia sư
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="group-btn">
                                <button
                                    className="pr-btn"
                                    onClick={() =>
                                        setIsUpdateBookingTutorModalOpen(true)
                                    }
                                >
                                    Cập nhật
                                </button>
                                <button className="sc-btn" onClick={handleBack}>
                                    Quay lại
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        setIsCancelBookingTutorModalOpen(true)
                                    }
                                >
                                    Huỷ lịch
                                </button>
                            </div>

                            <UpdateRequestFindTutorForStudentModal
                                isOpen={isUpdateBookingTutorModalOpen}
                                setIsOpen={setIsUpdateBookingTutorModalOpen}
                                selectedBooking={bookingTutor}
                            />
                            <CancelBookingTutorForStudent
                                isOpen={isCancelBookingTutorModalOpen}
                                setIsOpen={setIsCancelBookingTutorModalOpen}
                                requestId={String(bookingTutor?.id)}
                            />
                        </>
                    )}
                </div>
            )}

            {isStep === 2 && (
                <div
                    className={`srft-step-2 step ${
                        isStep === 2 ? "step-active" : "step-hidden"
                    }`}
                >
                    <div className="sc-btn" onClick={handlePrevStep}>
                        Quay lại
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);
                            dispatch(
                                createClassRequestForStudentApiThunk(values)
                            )
                                .unwrap()
                                .then((res) =>
                                    toast.success(
                                        get(
                                            res,
                                            "data.message",
                                            "Gửi thành công"
                                        )
                                    )
                                )
                                .catch((err) =>
                                    toast.error(
                                        get(
                                            err,
                                            "data.message",
                                            "Có lỗi xảy ra"
                                        )
                                    )
                                )
                                .finally(() => {
                                    setSubmitting(false);
                                    navigateHook(routes.student.home);
                                });
                        }}
                    >
                        {({ values, setFieldValue, isSubmitting }) => {
                            const isSlotValid =
                                values.schedules.length === sessionsPerWeek &&
                                sessionsPerWeek > 0;

                            return (
                                <Form className="form">
                                    {/* Cấp bậc học */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Cấp bậc học
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <select
                                                className="form-input"
                                                value={level}
                                                onChange={(e) =>
                                                    handleLevelChange(
                                                        e.target
                                                            .value as LevelType
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    -- Chọn cấp bậc --
                                                </option>
                                                <option value="Tiểu học">
                                                    Tiểu học
                                                </option>
                                                <option value="Trung học cơ sở">
                                                    Trung học cơ sở
                                                </option>
                                                <option value="Trung học phổ thông">
                                                    Trung học phổ thông
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Môn học */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Môn học
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <Field
                                                as="select"
                                                name="subject"
                                                className="form-input"
                                                onChange={(e: any) => {
                                                    handleSubjectChange(
                                                        e.target.value
                                                    );
                                                    setFieldValue(
                                                        "subject",
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    -- Chọn môn học --
                                                </option>
                                                {level &&
                                                    subjectsByLevel[level].map(
                                                        (subj) => (
                                                            <option
                                                                key={subj}
                                                                value={subj}
                                                            >
                                                                {subj}
                                                            </option>
                                                        )
                                                    )}
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
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
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

                                    {/* Số buổi */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Số buổi trong một tuần
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <input
                                                type="number"
                                                className="form-input"
                                                min={1}
                                                max={7}
                                                value={sessionsPerWeek}
                                                onChange={(e) =>
                                                    handleSessionsChange(
                                                        e,
                                                        setFieldValue
                                                    )
                                                }
                                                placeholder="Nhập số buổi trong một tuần (2–4)"
                                            />
                                        </div>
                                    </div>

                                    {/* Học phí */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Học phí 1 tháng
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <Field
                                                type="text"
                                                className="form-input"
                                                value={
                                                    tuitionFee
                                                        ? tuitionFee.toLocaleString(
                                                              "vi-VN"
                                                          ) + " VND"
                                                        : ""
                                                }
                                                readOnly
                                                placeholder="Học phí sẽ tự động cập nhật"
                                            />
                                        </div>
                                    </div>

                                    {/* Mô tả */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Mô tả
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
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
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
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
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <DatePickerElement
                                                placeholder="Chọn ngày bắt đầu học"
                                                value={
                                                    values.classStartDate
                                                        ? new Date(
                                                              values.classStartDate
                                                          )
                                                        : null
                                                }
                                                onChange={(date) =>
                                                    setFieldValue(
                                                        "classStartDate",
                                                        date?.toISOString() ||
                                                            ""
                                                    )
                                                }
                                            />
                                        </div>
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
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
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
                                                <MdOutlineDriveFileRenameOutline className="form-input-icon" />
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

                                    {/* Lịch học */}
                                    <div className="calendar-container">
                                        <WeekCalendarFindTutor
                                            onSelectedChange={(schedules) =>
                                                setFieldValue(
                                                    "schedules",
                                                    schedules
                                                )
                                            }
                                            sessionsPerWeek={sessionsPerWeek}
                                        />
                                        {sessionsPerWeek !== "" &&
                                            !isSlotValid && (
                                                <div className="text-error">
                                                    ⚠ Vui lòng chọn đúng{" "}
                                                    {sessionsPerWeek} buổi trong
                                                    tuần
                                                </div>
                                            )}
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
            )}
        </div>
    );
};

export default StudentRequestFindTutor;
