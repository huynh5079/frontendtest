import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectAdminClassDetail,
    selectAdminClassLoading,
    selectAdminClassError,
    selectAdminClassStudents,
    selectAdminClassStudentsLoading,
} from "../../../../app/selector";
import {
    adminGetAllClassesApiThunk,
    adminGetClassDetailApiThunk,
    adminGetStudentsInClassApiThunk,
} from "../../../../services/admin/class/adminClassThunk";
import {
    formatDate,
    getModeText,
    getStatusText,
    useDocumentTitle,
} from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";
import { LoadingSpinner } from "../../../../components/elements";
import "../../../../assets/scss/admin/manage/class/admin_detail_class.scss";
import { get } from "lodash";
import { toast } from "react-toastify";
import {
    AdminCancelClassModal,
    AdminCancelStudentEnrollmentModal,
    AdminSelectStudentToCancelModal,
} from "../../../../components/modal";

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

const AdminDetailClassPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const classDetail = useAppSelector(selectAdminClassDetail);
    const loading = useAppSelector(selectAdminClassLoading);
    const error = useAppSelector(selectAdminClassError);
    const studentsInClass = useAppSelector(selectAdminClassStudents);
    const studentsLoading = useAppSelector(selectAdminClassStudentsLoading);

    const [cancelClassModalOpen, setCancelClassModalOpen] = useState(false);
    const [selectStudentModalOpen, setSelectStudentModalOpen] = useState(false);
    const [cancelStudentModalOpen, setCancelStudentModalOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
        null,
    );
    const [selectedStudentName, setSelectedStudentName] = useState<
        string | null
    >(null);

    const [activeTab, setActiveTab] = useState<
        "description" | "students" | "materials"
    >("description");

    useEffect(() => {
        if (id) {
            dispatch(adminGetClassDetailApiThunk(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (id && activeTab === "students") {
            dispatch(adminGetStudentsInClassApiThunk(id));
        }
    }, [dispatch, id, activeTab]);

    useDocumentTitle(`Lớp học ${classDetail?.title || ""}`);

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            Pending: "Chờ phê duyệt",
            Ongoing: "Đang diễn ra",
            Cancelled: "Đã hủy",
            Completed: "Đã hoàn thành",
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status: string) => {
        const classMap: Record<string, string> = {
            Pending: "status-pending",
            Ongoing: "status-ongoing",
            Cancelled: "status-cancelled",
            Completed: "status-completed",
        };
        return classMap[status] || "";
    };

    if (loading) {
        return (
            <section id="admin-detail-class-section">
                <div className="adcs-container">
                    <div className="loading-container">
                        <LoadingSpinner />
                        <p>Đang tải chi tiết lớp học...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !classDetail) {
        return (
            <section id="admin-detail-class-section">
                <div className="adcs-container">
                    <div className="error-container">
                        <p className="error-message">
                            {error || "Không tìm thấy lớp học"}
                        </p>
                        <div
                            className="pr-btn"
                            onClick={() =>
                                navigateHook(routes.admin.class.list)
                            }
                        >
                            Quay lại danh sách
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const handleViewDetailTutor = (tutorUserId: string) => {
        navigateHook(routes.admin.tutor.detail.replace(":id", tutorUserId));
    };

    const handleCancelClass = (classId: string) => {
        setSelectedClassId(classId);
        setCancelClassModalOpen(true);
    };

    const handleCancelStudent = (classId: string) => {
        setSelectedClassId(classId);
        setSelectStudentModalOpen(true);
    };

    const handleRefreshClasses = () => {
        // Refresh danh sách sau khi hủy thành công
        dispatch(adminGetAllClassesApiThunk())
            .unwrap()
            .then(() => {})
            .catch((error) => {
                const errorData = get(
                    error,
                    "data.message",
                    "Có lỗi xảy ra khi tải danh sách lớp học",
                );
                toast.error(errorData);
            });
    };

    const handleSelectStudent = (studentId: string, studentName?: string) => {
        setSelectedStudentId(studentId);
        setSelectedStudentName(studentName || null);
        setSelectStudentModalOpen(false);
        setCancelStudentModalOpen(true);
    };

    return (
        <section id="admin-detail-class-section">
            <div className="adcs-container">
                {/* Header */}
                <div className="adcscr1">
                    <h4>Quản lý lớp học</h4>
                    <p>
                        Trang tổng quát <span>Chi tiết</span>
                    </p>
                </div>
                <div className="adcscr2">
                    {classDetail.status !== "Cancelled" && (
                        <div
                            className="delete-btn"
                            onClick={() => handleCancelClass(classDetail.id)}
                        >
                            Huỷ lớp
                        </div>
                    )}
                    {classDetail.currentStudentCount > 0 &&
                        classDetail.status !== "Cancelled" && (
                            <div
                                className="delete-btn"
                                onClick={() =>
                                    handleCancelStudent(classDetail.id)
                                }
                            >
                                Huỷ học sinh
                            </div>
                        )}

                    <div
                        className="pr-btn"
                        onClick={() => navigateHook(routes.admin.class.list)}
                    >
                        Quay lại
                    </div>
                </div>

                {/* Class Title & Status */}
                <div className="adcscr3">
                    <div className="class-title-wrapper">
                        <h2>{classDetail.title}</h2>
                        <div className="class-meta">
                            <p
                                className={`status-badge ${getStatusClass(
                                    classDetail.status,
                                )}`}
                            >
                                {getStatusLabel(classDetail.status)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="tabs">
                    {(["description", "students", "materials"] as const).map(
                        (t) => (
                            <div
                                key={t}
                                className={`tab ${
                                    activeTab === t ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveTab(t);
                                }}
                            >
                                {t === "description" && "Mô tả"}
                                {t === "students" && "Học viên"}
                                {t === "materials" && "Tài liệu"}
                            </div>
                        ),
                    )}
                </div>

                {/* Content */}
                <div className="adcscr4">
                    {/* Description Tab */}
                    {activeTab === "description" && (
                        <div className="tab-content">
                            <div className="detail-class">
                                {/* NHÓM 2: Thông tin gia sư */}
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin gia sư
                                    </h3>
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
                                                handleViewDetailTutor(
                                                    classDetail?.tutorUserId!,
                                                )
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                        <button className="delete-btn">
                                            Báo cáo
                                        </button>
                                    </div>
                                </div>

                                {/* NHÓM 3: Hình thức & Học phí */}
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin lớp học
                                    </h3>
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
                                                {getModeText(classDetail?.mode)}
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
                                                {classDetail?.mode ===
                                                "Offline" ? (
                                                    <>
                                                        <span
                                                            style={{
                                                                fontStyle:
                                                                    "italic",
                                                                color: "#666",
                                                            }}
                                                        >
                                                            {classDetail?.price?.toLocaleString()}{" "}
                                                            VNĐ/tháng (Tham
                                                            khảo)
                                                        </span>
                                                        <br />
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "0.9em",
                                                                color: "#28a745",
                                                            }}
                                                        >
                                                            Đã thanh toán:
                                                            50,000 VNĐ (phí kết
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
                                            <p>
                                                {getStatusText(
                                                    classDetail?.status,
                                                )}
                                            </p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Số học sinh tham gia</h4>
                                            <p>
                                                {
                                                    classDetail?.currentStudentCount
                                                }
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
                                                        classDetail?.classStartDate,
                                                    ),
                                                )}
                                            </p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Ngày tạo</h4>
                                            <p>
                                                {formatDate(
                                                    String(
                                                        classDetail?.createdAt,
                                                    ),
                                                )}
                                            </p>
                                        </div>

                                        <div className="detail-item detail-item-schedule">
                                            <h4>Lịch học chi tiết</h4>

                                            {classDetail?.scheduleRules
                                                ?.slice() // tránh mutate mảng gốc
                                                .sort(
                                                    (a: any, b: any) =>
                                                        dayOrder[a.dayOfWeek] -
                                                        dayOrder[b.dayOfWeek],
                                                )
                                                .map((s: any, index: any) => (
                                                    <div
                                                        key={index}
                                                        className="schedule-item"
                                                    >
                                                        <p className="schedule-day">
                                                            {dayOfWeekMap[
                                                                s.dayOfWeek
                                                            ] || s.dayOfWeek}
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
                        </div>
                    )}

                    {/* Students Tab */}
                    {activeTab === "students" && (
                        <div className="tab-content">
                            <div className="content-section">
                                <div className="section-header">
                                    <h3>Danh sách học viên đã đăng ký</h3>
                                    <div className="student-count">
                                        {classDetail.currentStudentCount} /{" "}
                                        {classDetail.studentLimit} học viên
                                    </div>
                                </div>
                                {studentsLoading ? (
                                    <div className="loading-container">
                                        <LoadingSpinner />
                                        <p>Đang tải danh sách học viên...</p>
                                    </div>
                                ) : studentsInClass.length === 0 ? (
                                    <div className="students-list">
                                        <p className="no-data">
                                            Chưa có học viên nào đăng ký lớp học
                                            này
                                        </p>
                                    </div>
                                ) : (
                                    <div className="students-list">
                                        <div className="students-table">
                                            <table className="table">
                                                <thead className="table-head">
                                                    <tr className="table-head-row">
                                                        <th className="table-head-cell">
                                                            Họ và tên
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Email
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Số điện thoại
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Trạng thái thanh
                                                            toán
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Ngày đăng ký
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-body">
                                                    {studentsInClass.length ===
                                                    0 ? (
                                                        <tr className="table-body-row">
                                                            <td
                                                                className="table-body-cell"
                                                                colSpan={5}
                                                            >
                                                                <p className="no-data">
                                                                    Chưa có học
                                                                    viên nào
                                                                    đăng ký lớp
                                                                    học này
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        studentsInClass.map(
                                                            (student) => (
                                                                <tr
                                                                    key={
                                                                        student.studentId
                                                                    }
                                                                >
                                                                    <td className="table-body-cell">
                                                                        <div className="student-info">
                                                                            <span>
                                                                                {
                                                                                    student.studentName
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {student.studentEmail ||
                                                                            "N/A"}
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {student.studentPhone ||
                                                                            "N/A"}
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        <span
                                                                            className={`status-badge payment-${student.paymentStatus.toLowerCase()}`}
                                                                        >
                                                                            {student.paymentStatus ===
                                                                            "Paid"
                                                                                ? "Đã thanh toán"
                                                                                : student.paymentStatus ===
                                                                                  "Pending"
                                                                                ? "Chờ thanh toán"
                                                                                : student.paymentStatus ===
                                                                                  "Failed"
                                                                                ? "Thất bại"
                                                                                : student.paymentStatus}
                                                                        </span>
                                                                    </td>
                                                                    <td className="table-body-cell">
                                                                        {student.enrolledAt
                                                                            ? formatDate(
                                                                                  student.enrolledAt,
                                                                              )
                                                                            : formatDate(
                                                                                  student.createdAt,
                                                                              )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Materials Tab */}
                    {activeTab === "materials" && (
                        <div className="tab-content">
                            <div className="content-section">
                                <h3>Tài liệu học tập</h3>
                                {/* TODO: Fetch và hiển thị danh sách tài liệu từ API */}
                                <div className="materials-list">
                                    <p className="no-data">
                                        Danh sách tài liệu sẽ được hiển thị ở
                                        đây
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AdminCancelClassModal
                isOpen={cancelClassModalOpen}
                setIsOpen={(open) => {
                    setCancelClassModalOpen(open);
                    if (!open) {
                        setSelectedClassId(null);
                    }
                }}
                classId={selectedClassId}
                onSuccess={handleRefreshClasses}
            />

            <AdminSelectStudentToCancelModal
                isOpen={selectStudentModalOpen}
                setIsOpen={(open) => {
                    setSelectStudentModalOpen(open);
                    if (!open) {
                        setSelectedClassId(null);
                    }
                }}
                classId={selectedClassId}
                onSelectStudent={handleSelectStudent}
            />

            <AdminCancelStudentEnrollmentModal
                isOpen={cancelStudentModalOpen}
                setIsOpen={(open) => {
                    setCancelStudentModalOpen(open);
                    if (!open) {
                        setSelectedClassId(null);
                        setSelectedStudentId(null);
                        setSelectedStudentName(null);
                    }
                }}
                classId={selectedClassId}
                studentId={selectedStudentId}
                studentName={selectedStudentName}
                onSuccess={handleRefreshClasses}
            />
        </section>
    );
};

export default AdminDetailClassPage;
