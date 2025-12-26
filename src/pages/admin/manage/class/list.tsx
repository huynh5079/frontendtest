import { useEffect, useState, type FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle, formatDate } from "../../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { adminGetAllClassesApiThunk } from "../../../../services/admin/class/adminClassThunk";
import {
    selectListClassesForAdmin,
    selectAdminClassLoading,
} from "../../../../app/selector";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes/routeName";
import type { PublicClass } from "../../../../types/public";

const AdminListClassPage: FC = () => {
    useDocumentTitle("Danh sách lớp học");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const classes = useAppSelector(selectListClassesForAdmin) || [];
    const isLoading = useAppSelector(selectAdminClassLoading);
    const [classesWithTutorName, setClassesWithTutorName] = useState<
        PublicClass[]
    >([]);
    const [filterStatus, setFilterStatus] = useState<string>("all"); // "all", "active", "cancelled"

    useEffect(() => {
        dispatch(adminGetAllClassesApiThunk());
    }, [dispatch]);

    // Tính toán số lượng lớp theo trạng thái
    const allClasses =
        classesWithTutorName.length > 0 ? classesWithTutorName : classes;
    const allClassesCount = allClasses.length;
    // Backend enum: Pending, Ongoing, Completed, Cancelled (không có "Active")
    const activeClassesCount = allClasses.filter(
        (c) => c.status === "Pending" || c.status === "Ongoing",
    ).length;
    const cancelledClassesCount = allClasses.filter(
        (c) => c.status === "Cancelled",
    ).length;

    // Filter classes theo status
    const getFilteredClasses = () => {
        if (filterStatus === "all") {
            return allClasses;
        } else if (filterStatus === "active") {
            // Active = Pending hoặc Ongoing
            return allClasses.filter(
                (c) => c.status === "Pending" || c.status === "Ongoing",
            );
        } else if (filterStatus === "cancelled") {
            return allClasses.filter((c) => c.status === "Cancelled");
        }
        return allClasses;
    };

    const displayClasses = getFilteredClasses();

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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Tổng số trang
    const totalPages = displayClasses
        ? Math.ceil(displayClasses.length / itemsPerPage)
        : 1;

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = displayClasses?.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    useEffect(() => {
        setCurrentPage(1); // reset khi đổi filter
    }, [filterStatus]);

    return (
        <>
            <section id="admin-list-class-section">
                <div className="alcs-container">
                    <div className="alcscr1">
                        <h4>Quản lý lớp học</h4>
                        <p>
                            Trang tổng quát <span>Lớp học</span>
                        </p>
                    </div>
                    <div className="alcscr2">
                        <div
                            className={`alcscr2-item ${
                                filterStatus === "all" ? "active" : ""
                            } clickable`}
                            onClick={() => setFilterStatus("all")}
                        >
                            <FaListUl className="alcscr2-item-icon" />
                            <div className="amount">
                                <h5>Tất cả</h5>
                                <p>{allClassesCount} lớp học</p>
                            </div>
                        </div>
                        <div
                            className={`alcscr2-item ${
                                filterStatus === "active" ? "active" : ""
                            } clickable`}
                            onClick={() => setFilterStatus("active")}
                        >
                            <FaListUl className="alcscr2-item-icon" />
                            <div className="amount">
                                <h5>Đang hoạt động</h5>
                                <p>{activeClassesCount} lớp</p>
                            </div>
                        </div>
                        <div
                            className={`alcscr2-item ${
                                filterStatus === "cancelled" ? "active" : ""
                            } clickable`}
                            onClick={() => setFilterStatus("cancelled")}
                        >
                            <FaListUl className="alcscr2-item-icon" />
                            <div className="amount">
                                <h5>Đã hủy</h5>
                                <p>{cancelledClassesCount} lớp</p>
                            </div>
                        </div>
                    </div>
                    <div className="alcscr3">
                        {isLoading ? (
                            <div
                                style={{ padding: "2rem", textAlign: "center" }}
                            >
                                Đang tải dữ liệu...
                            </div>
                        ) : (
                            <>
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-head-row">
                                            <th className="table-head-cell">
                                                Gia sư
                                            </th>
                                            <th className="table-head-cell">
                                                Môn học
                                            </th>
                                            <th className="table-head-cell">
                                                Số lượng học viên
                                            </th>
                                            <th className="table-head-cell">
                                                Trạng thái
                                            </th>
                                            <th className="table-head-cell">
                                                Thời gian tạo
                                            </th>
                                            <th className="table-head-cell">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {paginatedData.length === 0 ? (
                                            <tr className="table-body-row">
                                                <td
                                                    colSpan={6}
                                                    className="table-body-cell"
                                                    style={{
                                                        textAlign: "center",
                                                        padding: "2rem",
                                                    }}
                                                >
                                                    Không có dữ liệu lớp học
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedData.map(
                                                (classItem, index) => (
                                                    <tr
                                                        className="table-body-row"
                                                        key={
                                                            classItem.id ||
                                                            index
                                                        }
                                                    >
                                                        <td className="table-body-cell">
                                                            {
                                                                classItem.tutorName
                                                            }
                                                        </td>
                                                        <td className="table-body-cell">
                                                            {classItem.subject ||
                                                                classItem.title ||
                                                                "N/A"}
                                                        </td>
                                                        <td className="table-body-cell">
                                                            {classItem.currentStudentCount ||
                                                                0}
                                                            /
                                                            {classItem.studentLimit ||
                                                                0}
                                                        </td>
                                                        <td className="table-body-cell">
                                                            <span
                                                                className={getStatusClass(
                                                                    classItem.status,
                                                                )}
                                                            >
                                                                {getStatusLabel(
                                                                    classItem.status,
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="table-body-cell">
                                                            {formatDate(
                                                                classItem.createdAt,
                                                            )}
                                                        </td>
                                                        <td className="table-body-cell">
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    gap: "0.5rem",
                                                                }}
                                                            >
                                                                <button
                                                                    className="pr-btn"
                                                                    onClick={() => {
                                                                        const url =
                                                                            routes.admin.class.detail.replace(
                                                                                ":id",
                                                                                classItem.id,
                                                                            );
                                                                        navigate(
                                                                            url,
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: "0.25rem",
                                                                    }}
                                                                >
                                                                    Xem chi tiết
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="sc-btn"
                                            disabled={currentPage === 1}
                                            onClick={() =>
                                                setCurrentPage((p) => p - 1)
                                            }
                                        >
                                            Trang trước
                                        </button>

                                        <span>
                                            {currentPage} / {totalPages}
                                        </span>

                                        <button
                                            className="sc-btn"
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            onClick={() =>
                                                setCurrentPage((p) => p + 1)
                                            }
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminListClassPage;
