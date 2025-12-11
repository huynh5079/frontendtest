import { useEffect, useState, type ChangeEvent, type FC } from "react";
import {
    MdAttachMoney,
    MdDateRange,
    MdDescription,
    MdFormatListBulleted,
    MdLocationOn,
    MdOutlineCastForEducation,
    MdOutlineDriveFileRenameOutline,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "lodash";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
    selectBalance,
    selectDetailClassRequestForStudent,
    selectListApplyRequestFindTutorForStudent,
    selectListClassRequestForStudent,
    selectListLearningScheduleForStudent,
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

import {
    formatDate,
    formatDateToYMD,
    getStatusText,
    groupSchedulesByWeek,
    useDocumentTitle,
} from "../../../utils/helper";
import {
    DatePickerElement,
    LoadingSpinner,
    WeekCalendar,
    WeekCalendarFindTutor,
} from "../../elements";
import {
    CancelRequestFindTutorForStudent,
    Modal,
    RemindWalletModal,
    UpdateRequestFindTutorForStudentModal,
} from "../../modal";

import type { CreateClassRequestParams } from "../../../types/student";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { WalletBalance } from "../../../types/wallet";
import {
    checkBalanceApiThunk,
    tranferToAdminApiThunk,
} from "../../../services/wallet/walletThunk";
import { getAllLearingScheduleForStudentApiThunk } from "../../../services/student/learningSchedule/learningScheduleThunk";

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

const sortOrder = [1, 2, 3, 4, 5, 6, 0]; // Thứ 2 → Thứ 7 → Chủ Nhật

const createRequestFee = 50000;
const ITEMS_PER_PAGE = 6;

// === COMPONENT ===
const StudentRequestFindTutor: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const bookingTutors = useAppSelector(
        selectListClassRequestForStudent
    )?.filter((b) => !b.tutorName);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);
    const applyRequests = useAppSelector(
        selectListApplyRequestFindTutorForStudent
    );
    const schedules =
        useAppSelector(selectListLearningScheduleForStudent) || [];
    const busySchedules = groupSchedulesByWeek(
        Array.isArray(schedules) ? schedules : []
    );

    // === STATE ===
    const [isStep, setIsStep] = useState(1);
    const [level, setLevel] = useState<LevelType | "">("");
    const [_, setSubject] = useState("");
    const [classOptions, setClassOptions] = useState<string[]>([]);
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] =
        useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] =
        useState(false);
    const [isRemindWalletOpen, setIsRemindWalletOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAcceptApplyRequestOpen, setIsAcceptApplyRequestOpen] =
        useState(false);
    const [isRejectApplyRequestOpen, setIsRejectApplyRequestOpen] =
        useState(false);
    const [isSubmittingAcceptApplyRequest, setIsSubmittingAcceptApplyRequest] =
        useState(false);
    const [isSubmittingRejectApplyRequest, setIsSubmittingRejectApplyRequest] =
        useState(false);
    const [selectedApplyRequestId, setSelectedApplyRequestId] =
        useState<string>("");

    // === EFFECTS ===
    useEffect(() => {
        dispatch(getAllClassRequestForStudentApiThunk());
        dispatch(checkBalanceApiThunk());
    }, [dispatch]);

    useEffect(() => {
        if (id) dispatch(getDetailClassRequestForStudentApiThunk(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (id && bookingTutor?.status === "Pending") {
            dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id));
        }
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

    const handleAcceptApplyRequestOpen = (applyId: string) => {
        setSelectedApplyRequestId(applyId);
        setIsAcceptApplyRequestOpen(true);
    };

    const handleRejectApplyRequestOpen = (applyId: string) => {
        setSelectedApplyRequestId(applyId);
        setIsRejectApplyRequestOpen(true);
    };

    const handleAcceptApply = async () => {
        setIsSubmittingAcceptApplyRequest(true);
        await dispatch(
            acceptApplyRequestFindTutorForStudentApiThunk(
                selectedApplyRequestId
            )
        )
            .unwrap()
            .then((res) =>
                toast.success(get(res, "data.message", "Xử lí thành công"))
            )
            .catch((err) =>
                toast.error(get(err, "data.message", "Có lỗi xảy ra"))
            )
            .finally(() => {
                dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id!)),
                    setIsSubmittingAcceptApplyRequest(false);
                setIsAcceptApplyRequestOpen(false);
                dispatch(getDetailClassRequestForStudentApiThunk(id!));
            });
    };

    const handleRejectApply = async () => {
        setIsSubmittingRejectApplyRequest(true);
        await dispatch(
            rejectApplyRequestFindTutorForStudentApiThunk(
                selectedApplyRequestId
            )
        )
            .unwrap()
            .then((res) =>
                toast.success(get(res, "data.message", "Xử lí thành công"))
            )
            .catch((err) =>
                toast.error(get(err, "data.message", "Có lỗi xảy ra"))
            )
            .finally(() => {
                dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id!)),
                    setIsSubmittingRejectApplyRequest(false);
                setIsRejectApplyRequestOpen(false);
                dispatch(getDetailClassRequestForStudentApiThunk(id!));
            });
    };

    // === FORM INITIAL & VALIDATION ===
    const initialValues: CreateClassRequestParams = {
        studentUserId: null,
        tutorId: null,
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

    /* Pagination */
    const totalPages = Math.ceil((bookingTutors?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = bookingTutors?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // === RENDER ===
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
                                                Trạng thái
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
                                        {paginatedItems?.map((bookingTutor) => (
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
                                                    {getStatusText(
                                                        bookingTutor.status
                                                    )}
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pagination mt-4">
                                        <button
                                            className="sc-btn mr-2"
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </button>
                                        <span>
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            className="sc-btn ml-2"
                                            onClick={handleNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Sau
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="srfts1r1">
                                <h3 className="detail-title">
                                    Chi tiết đơn yêu cầu tìm gia sư
                                </h3>
                            </div>

                            <div className="detail-request-find-tutor">
                                {/* NHÓM 1: Thông tin học sinh */}
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin học sinh
                                    </h3>
                                    <div className="group-content">
                                        <div className="detail-item">
                                            <h4>Học sinh</h4>
                                            <p>{bookingTutor?.studentName}</p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Mô tả</h4>
                                            <p>{bookingTutor?.description}</p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Yêu cầu đặc biệt</h4>
                                            <p>
                                                {
                                                    bookingTutor?.specialRequirements
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* NHÓM 2: Thông tin gia sư */}
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin gia sư
                                    </h3>
                                    <div className="group-content">
                                        <div className="detail-item">
                                            <h4>Môn học</h4>
                                            <p>{bookingTutor?.subject}</p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Cấp bậc học</h4>
                                            <p>
                                                {bookingTutor?.educationLevel}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* NHÓM 3: Hình thức & Học phí */}
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Hình thức học & học phí
                                    </h3>
                                    <div className="group-content">
                                        <div className="detail-item">
                                            <h4>Hình thức học</h4>
                                            <p>{bookingTutor?.mode}</p>
                                        </div>

                                        {bookingTutor?.mode === "Offline" && (
                                            <div className="detail-item">
                                                <h4>Địa điểm</h4>
                                                <p>{bookingTutor?.location}</p>
                                            </div>
                                        )}

                                        <div className="detail-item">
                                            <h4>Học phí</h4>
                                            <p>
                                                {bookingTutor?.budget?.toLocaleString()}{" "}
                                                VNĐ
                                            </p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Trạng thái</h4>
                                            <p>
                                                {getStatusText(
                                                    bookingTutor?.status
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* NHÓM 4: Thời gian & Lịch trình */}
                                <div className="detail-group">
                                    <h3 className="group-title">Lịch học</h3>
                                    <div className="group-content">
                                        <div className="detail-item">
                                            <h4>Ngày bắt đầu</h4>
                                            <p>
                                                {formatDate(
                                                    String(
                                                        bookingTutor?.classStartDate
                                                    )
                                                )}
                                            </p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Ngày hết hạn</h4>
                                            <p>
                                                {formatDate(
                                                    String(
                                                        bookingTutor?.expiryDate
                                                    )
                                                )}
                                            </p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Ngày tạo</h4>
                                            <p>
                                                {formatDate(
                                                    String(
                                                        bookingTutor?.createdAt
                                                    )
                                                )}
                                            </p>
                                        </div>

                                        <div className="detail-item detail-item-schedule">
                                            <h4>Lịch học chi tiết</h4>

                                            {[
                                                ...(bookingTutor?.schedules ||
                                                    []),
                                            ]
                                                .sort(
                                                    (a, b) =>
                                                        sortOrder.indexOf(
                                                            a.dayOfWeek
                                                        ) -
                                                        sortOrder.indexOf(
                                                            b.dayOfWeek
                                                        )
                                                )
                                                .map((s, index) => (
                                                    <div
                                                        key={index}
                                                        className="schedule-item"
                                                    >
                                                        <p className="schedule-day">
                                                            {
                                                                daysOfWeek[
                                                                    s.dayOfWeek
                                                                ]
                                                            }
                                                        </p>
                                                        <p className="schedule-time">
                                                            {s.startTime} →{" "}
                                                            {s.endTime}
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {applyRequests?.length! > 0 && (
                                <>
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
                                                {applyRequests?.map(
                                                    (applyRequest) => (
                                                        <tr
                                                            key={
                                                                applyRequest.id
                                                            }
                                                        >
                                                            <td className="table-body-cell">
                                                                {
                                                                    applyRequest.tutorName
                                                                }
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
                                                                                handleAcceptApplyRequestOpen(
                                                                                    applyRequest.id
                                                                                );
                                                                            }}
                                                                        >
                                                                            Chấp
                                                                            thuận
                                                                        </button>
                                                                        <button
                                                                            className="delete-btn"
                                                                            onClick={() => {
                                                                                handleRejectApplyRequestOpen(
                                                                                    applyRequest.id
                                                                                );
                                                                            }}
                                                                        >
                                                                            Từ
                                                                            chối
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button
                                                                    className="sc-btn"
                                                                    onClick={() => {}}
                                                                >
                                                                    Chi tiết gia
                                                                    sư
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            <div className="group-btn">
                                {bookingTutor?.status === "Pending" && (
                                    <button
                                        className="pr-btn"
                                        onClick={() =>
                                            setIsUpdateBookingTutorModalOpen(
                                                true
                                            )
                                        }
                                    >
                                        Cập nhật
                                    </button>
                                )}

                                <button className="sc-btn" onClick={handleBack}>
                                    Quay lại
                                </button>

                                {bookingTutor?.status === "Pending" && (
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
                                )}
                            </div>

                            <UpdateRequestFindTutorForStudentModal
                                isOpen={isUpdateBookingTutorModalOpen}
                                setIsOpen={setIsUpdateBookingTutorModalOpen}
                                selectedBooking={bookingTutor}
                            />
                            <CancelRequestFindTutorForStudent
                                isOpen={isCancelBookingTutorModalOpen}
                                setIsOpen={setIsCancelBookingTutorModalOpen}
                                requestId={bookingTutor?.id!}
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
                    <div className="srfts2r1">
                        <h3>Tạo đơn yêu cầu tìm gia sư</h3>
                        <div className="sc-btn" onClick={handlePrevStep}>
                            Quay lại
                        </div>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);

                            const totalAmount = createRequestFee;

                            if (
                                balance?.balance &&
                                balance.balance < totalAmount
                            ) {
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
                                        createClassRequestForStudentApiThunk(
                                            values
                                        )
                                    )
                                        .unwrap()
                                        .then((res) => {
                                            const message = get(
                                                res,
                                                "data.message",
                                                "Gửi thành công"
                                            );
                                            toast.success(message);
                                            navigateHook(routes.student.home);
                                        })
                                        .catch((error) => {
                                            const errorData = get(
                                                error,
                                                "data.message",
                                                "Có lỗi xảy ra"
                                            );
                                            toast.error(errorData);
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

                            // ========================
                            // 4.1 EFFECT: LOAD SCHEDULE WHEN DATE CHANGES
                            // ========================
                            useEffect(() => {
                                if (values.classStartDate) {
                                    const start = formatDateToYMD(
                                        new Date(values.classStartDate)
                                    );

                                    const endDate = new Date(
                                        values.classStartDate
                                    );
                                    endDate.setDate(endDate.getDate() + 30);
                                    const end = formatDateToYMD(endDate);
                                    dispatch(
                                        getAllLearingScheduleForStudentApiThunk(
                                            {
                                                startDate: start,
                                                endDate: end,
                                            }
                                        )
                                    );
                                }
                            }, [dispatch, values.classStartDate]);

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
                                            Học phí sẽ tự động cập nhật khi bạn
                                            chọn buổi học
                                        </p>
                                    </div>

                                    {values.classStartDate && (
                                        <div className="calendar-container">
                                            <WeekCalendar
                                                busySchedules={busySchedules}
                                                onSelectedChange={(schedules) =>
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
                                            <h4>Phí tạo đơn</h4>
                                        </div>
                                        <div className="price-container-col">
                                            <p>
                                                {createRequestFee.toLocaleString()}{" "}
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
                                                {createRequestFee.toLocaleString() +
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
                                                "Gửi"
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            )}
            <RemindWalletModal
                isOpen={isRemindWalletOpen}
                setIsOpen={setIsRemindWalletOpen}
                routes={routes.student.information + "?tab=wallet"}
            />
            <Modal
                isOpen={isAcceptApplyRequestOpen}
                setIsOpen={setIsAcceptApplyRequestOpen}
                title={"Chấp nhận ứng tuyển"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn chấp nhận ứng tuyển này không?
                        </h3>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingAcceptApplyRequest
                                        ? "disable-btn"
                                        : "pr-btn"
                                }
                                onClick={handleAcceptApply}
                            >
                                {isSubmittingAcceptApplyRequest ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Chấp nhận"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
            <Modal
                isOpen={isRejectApplyRequestOpen}
                setIsOpen={setIsRejectApplyRequestOpen}
                title={"Ứng tuyển yêu cầu"}
            >
                <section id="tutor-accept-booking">
                    <div className="tab-container">
                        <h3>
                            Bạn có chắc chắn muốn từ chối ứng tuyển này không?
                        </h3>
                        <div className="group-btn">
                            <button className="sc-btn">Hủy</button>
                            <button
                                className={
                                    isSubmittingRejectApplyRequest
                                        ? "disable-btn"
                                        : "delete-btn"
                                }
                                onClick={() => handleRejectApply()}
                            >
                                {isSubmittingRejectApplyRequest ? (
                                    <>
                                        <LoadingSpinner />
                                    </>
                                ) : (
                                    "Từ chối"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
        </div>
    );
};

export default StudentRequestFindTutor;
