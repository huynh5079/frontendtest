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
import {
    DatePickerElement,
    LoadingSpinner,
    WeekCalendar,
    WeekCalendarFindTutor,
} from "../../elements";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectBalance,
    selectDetailClassRequestForStudent,
    selectListApplyRequestFindTutorForStudent,
    selectListChildAccount,
    selectListChildSchedule,
    selectListClassRequestForStudent,
} from "../../../app/selector";
import { getAllChildAccountApiThunk } from "../../../services/parent/childAccount/childAccountThunk";
import type { CreateClassRequestParams } from "../../../types/student";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    createClassRequestForStudentApiThunk,
    getAllClassRequestForStudentApiThunk,
    getDetailClassRequestForStudentApiThunk,
} from "../../../services/student/bookingTutor/bookingTutorThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
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
    CancelBookingTutorForStudent,
    ConfirmPaymentModal,
    Modal,
    RemindWalletModal,
    UpdateBookingTutorForStudentModal,
} from "../../modal";
import { getScheduleSpecificChildForParentApiThunk } from "../../../services/parent/childSchedule/childScheduleThunk";
import {
    checkBalanceApiThunk,
    tranferToAdminApiThunk,
} from "../../../services/wallet/walletThunk";
import { WalletBalance } from "../../../types/wallet";
import { CiTextAlignLeft } from "react-icons/ci";
import { getAllClassRequestForParentApiThunk } from "../../../services/parent/classRequest/classRequestThunk";

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

const ITEMS_PER_PAGE = 6;

const sortOrder = [1, 2, 3, 4, 5, 6, 0]; // Thứ 2 → Thứ 7 → Chủ Nhật
const createRequestFee = 50000;

const ParentRequestFindTutor: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const childAccounts = useAppSelector(selectListChildAccount);
    const [isStep, setIsStep] = useState(1);
    const handleNextStep = () => setIsStep((prev) => prev + 1);
    const handlePrevStep = () => setIsStep((prev) => prev - 1);
    const handleBack = () => navigate(`/parent/information?tab=request`);
    const [level, setLevel] = useState<LevelType | "">("");
    const [_, setSubject] = useState("");
    const [classOptions, setClassOptions] = useState<string[]>([]);
    const bookingTutors = useAppSelector(
        selectListClassRequestForStudent,
    )?.filter((b) => !b.tutorId);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);
    const applyRequests = useAppSelector(
        selectListApplyRequestFindTutorForStudent,
    );
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] =
        useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] =
        useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [childProfileId, setChildProfileId] = useState<string>("");
    const childSchedules = useAppSelector(selectListChildSchedule) || [];
    const balance: WalletBalance | null = useAppSelector(selectBalance);
    const [isRemindWalletOpen, setIsRemindWalletOpen] = useState(false);
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
    const [tabSubActive, setTabSubActive] = useState("request");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingValues, setPendingValues] =
        useState<CreateClassRequestParams | null>(null);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    const busySchedules = groupSchedulesByWeek(
        Array.isArray(childSchedules) ? childSchedules : [],
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [childProfileId]);

    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);

    useEffect(() => {
        dispatch(checkBalanceApiThunk());
    }, [dispatch]);

    // Load danh sách
    useEffect(() => {
        if (childProfileId) {
            dispatch(
                getAllClassRequestForParentApiThunk(
                    childProfileId.toLocaleLowerCase()!,
                ),
            );
        }
    }, [dispatch, childProfileId]);

    useEffect(() => {
        if (id) dispatch(getDetailClassRequestForStudentApiThunk(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (id && bookingTutor?.status === "Pending")
            dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id));
    }, [dispatch, id, bookingTutor]);

    const handleViewDetail = (id: string) =>
        navigate(`/parent/information?tab=request&id=${id}`);

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
                : [],
        );
    };

    const handleSubjectChange = (value: string) => setSubject(value);

    const totalPages = Math.ceil((bookingTutors?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = bookingTutors?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

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
                selectedApplyRequestId,
            ),
        )
            .unwrap()
            .then((res) => {
                toast.success(get(res, "data.message", "Xử lí thành công"));
                navigateHook(`/parent/information?tab=class`);
            })
            .catch((err) =>
                toast.error(get(err, "data.message", "Có lỗi xảy ra")),
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
                selectedApplyRequestId,
            ),
        )
            .unwrap()
            .then((res) =>
                toast.success(get(res, "data.message", "Xử lí thành công")),
            )
            .catch((err) =>
                toast.error(get(err, "data.message", "Có lỗi xảy ra")),
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
        studentUserId: "",
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
                }),
            )
            .min(1, "Vui lòng chọn lịch đúng số buổi"),
    });

    const handleConfirmPayment = () => {
        if (!pendingValues || isConfirmLoading) return;

        setIsConfirmLoading(true);

        dispatch(
            tranferToAdminApiThunk({
                Amount: createRequestFee,
                Note: "Phí đặt lịch gia sư",
            }),
        )
            .unwrap()
            .then(() => {
                return dispatch(
                    createClassRequestForStudentApiThunk(pendingValues),
                ).unwrap();
            })
            .then((res) => {
                toast.success(get(res, "data.message", "Đặt lịch thành công"));
                handlePrevStep();
                setChildProfileId("");
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

    useDocumentTitle("Danh sách đơn tìm gia sư");

    const handleViewDetailTutor = (id: string) => {
        const url = routes.parent.tutor.detail.replace(":id", id);
        navigate(url);
    };

    const renderBookingList = () => {
        return (
            <>
                <div className="prfts1r1">
                    <h3>Đơn tìm gia sư</h3>
                    <button className="pr-btn" onClick={handleNextStep}>
                        Tạo đơn
                    </button>
                </div>
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">Môn học</th>
                            <th className="table-head-cell">Cấp bậc học</th>
                            <th className="table-head-cell">Trạng thái</th>
                            <th className="table-head-cell">
                                Thời gian đặt lịch
                            </th>
                            <th className="table-head-cell">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {paginatedItems?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="table-body-cell no-data"
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            paginatedItems?.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="table-body-cell">
                                        {booking.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {booking.educationLevel}
                                    </td>
                                    <td className="table-body-cell">
                                        {getStatusText(booking.status)}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(booking.createdAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="sc-btn"
                                            onClick={() =>
                                                handleViewDetail(booking.id)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="sc-btn"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                        <span>
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            className="sc-btn"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </>
        );
    };

    const renderBookingDetail = () => {
        return (
            <>
                <h3 className="detail-title">Chi tiết lịch đặt gia sư</h3>

                <div className="sub-tabs">
                    {["request", "tutor"].map((t) => (
                        <div
                            key={t}
                            className={`sub-tab ${
                                tabSubActive === t ? "active" : ""
                            }`}
                            onClick={() => {
                                setTabSubActive(t);
                            }}
                        >
                            {t === "request" && "Đơn yêu cầu"}
                            {t === "tutor" && "Gia sư ứng tuyển"}
                        </div>
                    ))}
                </div>

                {tabSubActive === "request" && (
                    <div className="detail-request-find-tutor">
                        {/* NHÓM 1: Thông tin học sinh */}
                        <div className="detail-group">
                            <h3 className="group-title">Thông tin học sinh</h3>
                            <div className="group-content">
                                <div className="detail-item">
                                    <h4>Học sinh</h4>
                                    <p>{bookingTutor?.studentName}</p>
                                </div>

                                <div className="detail-item">
                                    <h4>Mô tả</h4>
                                    <p>{bookingTutor?.description}</p>
                                </div>

                                {bookingTutor?.specialRequirements && (
                                    <div className="detail-item">
                                        <h4>Yêu cầu đặc biệt</h4>
                                        <p>
                                            {bookingTutor?.specialRequirements}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* NHÓM 3: Hình thức & Học phí */}
                        <div className="detail-group">
                            <h3 className="group-title">Thông tin yêu cầu</h3>
                            <div className="group-content">
                                <div className="detail-item">
                                    <h4>Môn học</h4>
                                    <p>{bookingTutor?.subject}</p>
                                </div>

                                <div className="detail-item">
                                    <h4>Cấp bậc học</h4>
                                    <p>{bookingTutor?.educationLevel}</p>
                                </div>

                                <div className="detail-item">
                                    <h4>Hình thức học</h4>
                                    <p>
                                        {bookingTutor?.mode === "Online"
                                            ? "Học trực tuyến"
                                            : "Học trực tiếp"}
                                    </p>
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
                                    <p>{getStatusText(bookingTutor?.status)}</p>
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
                                                bookingTutor?.classStartDate,
                                            ),
                                        )}
                                    </p>
                                </div>

                                <div className="detail-item">
                                    <h4>Ngày hết hạn</h4>
                                    <p>
                                        {formatDate(
                                            String(bookingTutor?.expiryDate),
                                        )}
                                    </p>
                                </div>

                                <div className="detail-item">
                                    <h4>Ngày tạo</h4>
                                    <p>
                                        {formatDate(
                                            String(bookingTutor?.createdAt),
                                        )}
                                    </p>
                                </div>

                                <div className="detail-item detail-item-schedule">
                                    <h4>Lịch học chi tiết</h4>

                                    {[...(bookingTutor?.schedules || [])]
                                        .sort(
                                            (a, b) =>
                                                sortOrder.indexOf(a.dayOfWeek) -
                                                sortOrder.indexOf(b.dayOfWeek),
                                        )
                                        .map((s, index) => (
                                            <div
                                                key={index}
                                                className="schedule-item"
                                            >
                                                <p className="schedule-day">
                                                    {daysOfWeek[s.dayOfWeek]}
                                                </p>
                                                <p className="schedule-time">
                                                    {s.startTime} → {s.endTime}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tabSubActive === "tutor" && (
                    <>
                        {/* Danh sách ứng tuyển */}
                        <div className="srfts1r1">
                            <h3>Danh sách ứng tuyển</h3>
                        </div>

                        <div className="srfts1r2">
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
                                    {applyRequests?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="table-body-cell no-data"
                                            >
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    ) : (
                                        applyRequests?.map((applyRequest) => (
                                            <tr key={applyRequest.id}>
                                                <td className="table-body-cell">
                                                    {applyRequest.tutorName}
                                                </td>
                                                <td className="table-body-cell">
                                                    {getStatusText(
                                                        applyRequest.status,
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(
                                                        applyRequest.createdAt,
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
                                                                        applyRequest.id,
                                                                    );
                                                                }}
                                                            >
                                                                Chấp thuận
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => {
                                                                    handleRejectApplyRequestOpen(
                                                                        applyRequest.id,
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Nút */}
                <div className="group-btn mt-4">
                    {bookingTutor?.status === "Pending" && (
                        <button
                            className="pr-btn"
                            onClick={() =>
                                setIsUpdateBookingTutorModalOpen(true)
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
                                setIsCancelBookingTutorModalOpen(true)
                            }
                        >
                            Huỷ lịch
                        </button>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="parent-request-find-tutor">
            {isStep === 1 && (
                <div
                    className={`prft-step-1 step ${
                        isStep === 1 ? "step-active" : "step-hidden"
                    }`}
                >
                    <h2>Đơn tìm gia sư của con</h2>

                    <div className="form">
                        <div className="form-field">
                            <label className="form-label">
                                Chọn tài khoản của con
                            </label>
                            <div className="form-input-container">
                                <CiTextAlignLeft className="form-input-icon" />
                                <select
                                    className="form-input"
                                    value={childProfileId}
                                    onChange={(e) => {
                                        const newChildId = e.target.value;
                                        setChildProfileId(newChildId);

                                        // Nếu đang xem detail thì quay về list
                                        if (id) {
                                            navigateHook(
                                                `/parent/information?tab=booking_tutor`,
                                            );
                                        }
                                    }}
                                >
                                    <option value="">
                                        --- Chọn tài khoản ---
                                    </option>
                                    {childAccounts?.map((t) => (
                                        <option
                                            key={t.studentId}
                                            value={t.studentId}
                                        >
                                            {t.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {childProfileId && (
                        <>{!id ? renderBookingList() : renderBookingDetail()}</>
                    )}
                </div>
            )}

            {isStep === 2 && (
                <div
                    className={`prft-step-2 step ${
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
                            setSubmitting(false);

                            if (balance?.balance! < createRequestFee) {
                                setIsRemindWalletOpen(true);
                                return;
                            }

                            setPendingValues(values);
                            setIsConfirmOpen(true);
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

                            // === EFFECTS ===
                            // Load lịch dạy theo startDate
                            useEffect(() => {
                                if (values.classStartDate && childProfileId) {
                                    const start = formatDateToYMD(
                                        new Date(values.classStartDate),
                                    );
                                    const endDate = new Date(
                                        values.classStartDate,
                                    );
                                    endDate.setDate(endDate.getDate() + 30);
                                    const end = formatDateToYMD(endDate);

                                    dispatch(
                                        getScheduleSpecificChildForParentApiThunk(
                                            {
                                                childProfileId: childProfileId!,
                                                startDate: start,
                                                endDate: end,
                                            },
                                        ),
                                    );
                                }
                            }, [
                                dispatch,
                                values.classStartDate,
                                childProfileId,
                            ]);

                            return (
                                <Form className="form">
                                    {/* Tài khoản con */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Tài khoản của con
                                            <span>*</span>
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <Field
                                                as="select"
                                                name="studentUserId"
                                                className="form-input"
                                                onChange={(e: any) => {
                                                    const value =
                                                        e.target.value;
                                                    setFieldValue(
                                                        "studentUserId",
                                                        value,
                                                    );

                                                    const selected =
                                                        childAccounts?.find(
                                                            (c) =>
                                                                c.studentUserId ===
                                                                value,
                                                        );

                                                    if (selected) {
                                                        setChildProfileId(
                                                            selected.studentId,
                                                        );
                                                    }
                                                }}
                                            >
                                                <option value="">
                                                    -- Chọn tài khoản của con --
                                                </option>
                                                {childAccounts?.map((s) => (
                                                    <option
                                                        key={s.studentUserId}
                                                        value={s.studentUserId}
                                                    >
                                                        {s.username}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                        <ErrorMessage
                                            name="studentUserId"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>

                                    {/* Cấp bậc học */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Cấp bậc học
                                            <span>*</span>
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <select
                                                className="form-input"
                                                value={level}
                                                onChange={(e) =>
                                                    handleLevelChange(
                                                        e.target
                                                            .value as LevelType,
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
                                            <span>*</span>
                                        </label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <Field
                                                as="select"
                                                name="subject"
                                                className="form-input"
                                                onChange={(e: any) => {
                                                    handleSubjectChange(
                                                        e.target.value,
                                                    );
                                                    setFieldValue(
                                                        "subject",
                                                        e.target.value,
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
                                                        ),
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
                                            <span>*</span>
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
                                            <span>*</span>
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
                                                        date?.toISOString() ||
                                                            "",
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

                                    {/* Địa chỉ nếu Offline */}
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

                                    <div className="form-field">
                                        <label className="form-label">
                                            Học phí 1 tháng
                                            <span>*</span>
                                        </label>
                                        <div className="form-input-container">
                                            <MdAttachMoney className="form-input-icon" />
                                            <Field
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
                                            Học phí sẽ tự động cập nhật khi bạn
                                            chọn buổi học
                                        </p>
                                    </div>

                                    {values.classStartDate &&
                                        values.studentUserId && (
                                            <div className="calendar-container">
                                                <WeekCalendar
                                                    busySchedules={
                                                        busySchedules
                                                    }
                                                    onSelectedChange={(
                                                        schedules,
                                                    ) =>
                                                        setFieldValue(
                                                            "schedules",
                                                            schedules,
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
            <UpdateBookingTutorForStudentModal
                isOpen={isUpdateBookingTutorModalOpen}
                setIsOpen={setIsUpdateBookingTutorModalOpen}
                selectedBooking={bookingTutor}
            />
            <CancelBookingTutorForStudent
                isOpen={isCancelBookingTutorModalOpen}
                setIsOpen={setIsCancelBookingTutorModalOpen}
                requestId={bookingTutor?.id!}
            />
            <ConfirmPaymentModal
                isOpen={isConfirmOpen}
                totalAmount={createRequestFee}
                setIsOpen={setIsConfirmOpen}
                onConfirm={handleConfirmPayment}
                loading={isConfirmLoading}
            />
        </div>
    );
};

export default ParentRequestFindTutor;
