import { useEffect, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailPublicClass,
    selectListAssignedClassForStudent,
} from "../../../app/selector";
import {
    getAllAssignedClassForStudentApiThunk,
    withdrawClassForStudentApiThunk,
    getEnrollmentDetailApiThunk,
} from "../../../services/student/class/classThunk";
import { formatDate, getModeText, getStatusText } from "../../../utils/helper";
import { useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "../../../routes/routeName";
import { publicGetDetailClassApiThunk } from "../../../services/public/class/classthunk";
import { Modal, StudentWithdrawClassModal } from "../../modal";
import StudentReportUserModal from "../../modal/studentReportUserModal";
import { get } from "lodash";
import { toast } from "react-toastify";
import { MdAttachMoney } from "react-icons/md";
import { LoadingSpinner } from "../../elements";
import { confirmPaymentApiThunk } from "../../../services/wallet/walletThunk";

const ITEMS_PER_PAGE = 6;

const dayOfWeekMap: Record<string, string> = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
};

const dayOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

const StudentAssignedClass: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const assignedClasses = useAppSelector(selectListAssignedClassForStudent);
    const classDetail = useAppSelector(selectDetailPublicClass);

    const [currentPage, setCurrentPage] = useState(1);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
    const [isReportUserModalOpen, setIsReportUserModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [enrollmentDetail, setEnrollmentDetail] = useState<any>(null);

    /* URL Params */
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        dispatch(getAllAssignedClassForStudentApiThunk());
    }, [dispatch]);

    /* Load detail when id changes */
    useEffect(() => {
        if (id) {
            dispatch(publicGetDetailClassApiThunk(id!));
            dispatch(getEnrollmentDetailApiThunk(id!))
                .unwrap()
                .then((response) => {
                    setEnrollmentDetail(response.data);
                })
                .catch(() => {
                    setEnrollmentDetail(null);
                });
        }
    }, [dispatch, id]);

    const handleViewDetail = (id: string) => {
        navigate(`/student/information?tab=assigned_class&id=${id}`);
    };

    const handleBack = () => {
        navigate(`/student/information?tab=assigned_class`);
    };

    /* Pagination */
    const totalPages = Math.ceil(
        (assignedClasses?.length || 0) / ITEMS_PER_PAGE,
    );
    const paginatedItems = assignedClasses?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleViewDetailTutor = (id: string) => {
        const url = routes.student.tutor.detail.replace(":id", id);
        navigate(url);
    };

    const handleWithdrawSuccess = () => {
        // Refresh danh sách lớp học đã đăng ký
        dispatch(getAllAssignedClassForStudentApiThunk());
        // Quay lại danh sách
        handleBack();
    };

    const canWithdraw = () => {
        // Chỉ cho phép rút khi lớp ở trạng thái Pending hoặc Ongoing
        const status = classDetail?.status;
        return status === "Pending" || status === "Ongoing";
    };

    const handleConfirmPayment = () => {
        setIsSubmitting(true);
        dispatch(confirmPaymentApiThunk(id!))
            .unwrap()
            .then(() => {
                toast.success("Thanh toán thành công");
                setIsConfirmPaymentOpen(false);
                dispatch(publicGetDetailClassApiThunk(id!));
                dispatch(getEnrollmentDetailApiThunk(id!))
                    .unwrap()
                    .then((response) => {
                        setEnrollmentDetail(response.data);
                    });
            })
            .catch((error) => {
                toast.error(get(error, "data.Message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const renderClassList = () => (
        <>
            <div className="sacr1">
                <h3>Danh sách lớp học</h3>
                <button
                    className="pr-btn"
                    onClick={() => navigate(routes.student.course.list)}
                >
                    Đi tìm lớp học
                </button>
            </div>

            <div className="sacr2">
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">Gia sư</th>
                            <th className="table-head-cell">Môn học</th>
                            <th className="table-head-cell">Lớp</th>
                            <th className="table-head-cell">
                                Thời gian bắt đầu học
                            </th>
                            <th className="table-head-cell">Trạng thái</th>
                            <th className="table-head-cell">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {paginatedItems && paginatedItems.length > 0 ? (
                            paginatedItems.map((item, index) => (
                                <tr
                                    className="table-body-row"
                                    key={`${item.classId}-${index}-${item.enrolledAt}`}
                                >
                                    <td className="table-body-cell">
                                        {item.tutorName}
                                    </td>
                                    <td className="table-body-cell">
                                        {item.subject}
                                    </td>
                                    <td className="table-body-cell">
                                        {item.educationLevel}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(item.classStartDate)}
                                    </td>
                                    <td className="table-body-cell">
                                        {getStatusText(item.classStatus)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleViewDetail(item.classId)
                                            }
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="table-body-cell no-data"
                                >
                                    Chưa có lớp học
                                </td>
                            </tr>
                        )}
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
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    /* ================================
       Render Class Detail
    ================================= */
    const renderClassDetail = () => (
        <>
            <div className="sacr1">
                <h3 className="detail-title">
                    Chi tiết lớp học{" "}
                    <span
                        className={
                            enrollmentDetail?.paymentStatus === "Pending"
                                ? "pending"
                                : "paid"
                        }
                    >
                        {enrollmentDetail?.paymentStatus === "Pending"
                            ? "Chưa thanh toán"
                            : "Đã thanh toán"}
                    </span>
                </h3>

                <div className="btn-group">
                    {/* Action buttons for class */}
                    {/* Nút thanh toán cho lớp Online với PaymentStatus = Pending */}
                    {classDetail?.mode === "Online" &&
                        enrollmentDetail?.paymentStatus === "Pending" && (
                            <button
                                className="pr-btn"
                                onClick={() => setIsConfirmPaymentOpen(true)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <MdAttachMoney />
                                Thanh toán
                            </button>
                        )}
                    {canWithdraw() && (
                        <button
                            className="delete-btn withdraw-class-btn"
                            onClick={() => setIsWithdrawModalOpen(true)}
                        >
                            Rút khỏi lớp học
                        </button>
                    )}
                    <button className="sc-btn" onClick={handleBack}>
                        Quay lại
                    </button>
                </div>
            </div>

            <div className="detail-class">
                {/* NHÓM 2: Thông tin gia sư */}
                <div className="detail-group">
                    <h3 className="group-title">Thông tin gia sư</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Gia sư</h4>
                            <p>{classDetail?.tutorName}</p>
                        </div>
                    </div>
                    <div className="tutor-action-buttons">
                        <button
                            className="pr-btn"
                            onClick={() =>
                                handleViewDetailTutor(classDetail?.tutorUserId!)
                            }
                        >
                            Xem chi tiết
                        </button>
                        {classDetail?.status === "Ongoing" && (
                            <button
                                className="delete-btn"
                                onClick={() => {
                                    if (
                                        classDetail?.tutorUserId &&
                                        classDetail?.tutorName
                                    ) {
                                        setIsReportUserModalOpen(true);
                                    } else {
                                        toast.error(
                                            "Không thể báo cáo. Vui lòng tải lại trang.",
                                        );
                                    }
                                }}
                            >
                                Báo cáo
                            </button>
                        )}
                    </div>
                </div>

                {/* NHÓM 3: Hình thức & Học phí */}
                <div className="detail-group">
                    <h3 className="group-title">Thông tin lớp học</h3>
                    <div className="group-content">
                        <div className="detail-item">
                            <h4>Môn học</h4>
                            <p>{classDetail?.subject}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Cấp bậc dạy</h4>
                            <p>{classDetail?.educationLevel}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Hình thức học</h4>
                            <p>
                                {classDetail?.mode === "Online"
                                    ? "Học trực tuyến"
                                    : "Học trực tiếp"}
                            </p>
                        </div>

                        {classDetail?.mode === "Offline" && (
                            <div className="detail-item">
                                <h4>Địa điểm</h4>
                                <p>{classDetail?.location}</p>
                            </div>
                        )}

                        <div className="detail-item">
                            <h4>Học phí</h4>
                            <p>
                                {classDetail?.mode === "Offline" ? (
                                    <>
                                        <span
                                            style={{
                                                fontStyle: "italic",
                                                color: "#666",
                                            }}
                                        >
                                            {classDetail?.price?.toLocaleString()}{" "}
                                            VNĐ/tháng
                                        </span>
                                        <br />
                                        <span
                                            style={{
                                                fontSize: "0.9em",
                                                color: "#28a745",
                                            }}
                                        >
                                            Đã thanh toán: 50,000 VNĐ (phí kết
                                            nối)
                                        </span>
                                    </>
                                ) : (
                                    `${classDetail?.price?.toLocaleString()} VNĐ/tháng`
                                )}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Trạng thái</h4>
                            <p>{getStatusText(classDetail?.status)}</p>
                        </div>

                        <div className="detail-item">
                            <h4>Số học sinh tham gia</h4>
                            <p>{classDetail?.currentStudentCount}</p>
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
                                    String(classDetail?.classStartDate),
                                )}
                            </p>
                        </div>

                        <div className="detail-item">
                            <h4>Ngày tạo</h4>
                            <p>{formatDate(String(classDetail?.createdAt))}</p>
                        </div>

                        <div className="detail-item detail-item-schedule">
                            <h4>Lịch học chi tiết</h4>

                            {classDetail?.scheduleRules
                                ?.slice() // tránh mutate mảng gốc
                                .sort(
                                    (a, b) =>
                                        dayOrder[a.dayOfWeek] -
                                        dayOrder[b.dayOfWeek],
                                )
                                .map((s, index) => (
                                    <div key={index} className="schedule-item">
                                        <p className="schedule-day">
                                            {dayOfWeekMap[s.dayOfWeek] ||
                                                s.dayOfWeek}
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
        </>
    );

    return (
        <div className="student-assigned-class">
            {!id ? renderClassList() : renderClassDetail()}

            {/* Withdraw Modal */}
            {id && (
                <StudentWithdrawClassModal
                    isOpen={isWithdrawModalOpen}
                    setIsOpen={setIsWithdrawModalOpen}
                    classId={id}
                    onSuccess={handleWithdrawSuccess}
                />
            )}

            {/* Payment Confirmation Modal */}
            <Modal
                isOpen={isConfirmPaymentOpen}
                setIsOpen={setIsConfirmPaymentOpen}
                title="Xác nhận thanh toán"
            >
                <div className="confirm-payment-modal">
                    <h3>
                        Bạn có chắc chắn muốn thanh toán lớp học này không?
                    </h3>
                    {classDetail?.price && (
                        <div className="payment-info">
                            <p>
                                Số tiền cần thanh toán:{" "}
                                <strong>
                                    {classDetail.price.toLocaleString()} VNĐ
                                </strong>
                            </p>
                        </div>
                    )}
                    <div className="modal-actions">
                        <button
                            className="sc-btn"
                            onClick={() => setIsConfirmPaymentOpen(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            className="pr-btn"
                            onClick={handleConfirmPayment}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <LoadingSpinner />
                            ) : (
                                "Xác nhận thanh toán"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Report User Modal */}
            <StudentReportUserModal
                isOpen={isReportUserModalOpen}
                setIsOpen={setIsReportUserModalOpen}
                targetUserId={classDetail?.tutorUserId || ""}
                targetUserName={classDetail?.tutorName || ""}
            />
        </div>
    );
};

export default StudentAssignedClass;
