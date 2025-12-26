import { useEffect, useState, useCallback, type FC } from "react";
import { FaListUl, FaEye, FaSearch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectAdminReports,
    selectAdminReportsLoading,
    selectAdminReportDetail,
} from "../../../../app/selector";
import {
    getReportsForAdminApiThunk,
    getReportDetailForAdminApiThunk,
    updateReportStatusApiThunk,
} from "../../../../services/admin/report/adminReportThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { LoadingSpinner } from "../../../../components/elements";
import { Modal } from "../../../../components/modal";
import { MdCheckCircle, MdCancel, MdSchedule } from "react-icons/md";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 6;

const AdminListReportPage: FC = () => {
    const dispatch = useAppDispatch();
    const reports = useAppSelector(selectAdminReports) || [];
    const loading = useAppSelector(selectAdminReportsLoading);
    const reportDetail = useAppSelector(selectAdminReportDetail);

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(
        null,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useDocumentTitle("Danh sách báo cáo");

    // =======================
    // LOAD DATA
    // =======================
    const loadReports = useCallback(() => {
        dispatch(
            getReportsForAdminApiThunk({
                keyword: searchKeyword.trim() || undefined,
            }),
        );
    }, [dispatch, searchKeyword]);

    useEffect(() => {
        loadReports();
    }, []);

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadReports();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchKeyword]);

    // =======================
    // FILTER + PAGINATION
    // =======================
    const filteredReports =
        filterStatus === "all"
            ? reports
            : reports.filter((r) => r.status === filterStatus);

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedReports = filteredReports.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    // =======================
    // HANDLERS
    // =======================
    const handleViewDetail = async (reportId: string) => {
        setSelectedReportId(reportId);
        setDetailModalOpen(true);
        await dispatch(getReportDetailForAdminApiThunk(reportId));
    };

    const handleUpdateStatus = async (status: "Resolved" | "Rejected") => {
        if (!selectedReportId) return;

        setIsUpdatingStatus(true);
        try {
            await dispatch(
                updateReportStatusApiThunk({
                    reportId: selectedReportId,
                    params: { status },
                }),
            ).unwrap();

            await dispatch(getReportDetailForAdminApiThunk(selectedReportId));
            loadReports();

            toast.success("Cập nhật trạng thái thành công");
        } catch (error: any) {
            toast.error(error?.errorMessage || "Có lỗi xảy ra");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getStatusText = (status: string) => {
        return (
            {
                Pending: "Đang chờ",
                Resolved: "Đã xử lý",
                Rejected: "Đã từ chối",
            }[status] || status
        );
    };

    const getStatusClass = (status: string) => {
        return (
            {
                Pending: "status-pending",
                Resolved: "status-resolved",
                Rejected: "status-rejected",
            }[status] || ""
        );
    };

    return (
        <section id="admin-list-report-section">
            <div className="alrs-container">
                {/* HEADER */}
                <div className="alrscr1">
                    <h4>Báo cáo và Khiếu nại</h4>
                    <p>
                        Trang tổng quát <span>Báo cáo và Khiếu nại</span>
                    </p>
                </div>

                {/* FILTER BOX */}
                <div className="alrscr2">
                    {[
                        { key: "all", label: "Tất cả", icon: <FaListUl /> },
                        {
                            key: "Pending",
                            label: "Đang chờ",
                            icon: <MdSchedule />,
                        },
                        {
                            key: "Resolved",
                            label: "Đã xử lý",
                            icon: <MdCheckCircle />,
                        },
                        {
                            key: "Rejected",
                            label: "Đã từ chối",
                            icon: <MdCancel />,
                        },
                    ].map((item) => (
                        <div
                            key={item.key}
                            className={`alrscr2-item ${
                                filterStatus === item.key ? "active" : ""
                            }`}
                            onClick={() => setFilterStatus(item.key)}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="alrscr2-item-icon">
                                {item.icon}
                            </span>
                            <div className="amount">
                                <h5>{item.label}</h5>
                                <p>
                                    {item.key === "all"
                                        ? reports.length
                                        : reports.filter(
                                              (r) => r.status === item.key,
                                          ).length}{" "}
                                    báo cáo
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEARCH */}
                <div className="alrscr2-search">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Tìm kiếm theo nội dung báo cáo..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="alrscr3">
                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-head-row">
                                    <th className="table-head-cell">
                                        Người gửi
                                    </th>
                                    <th className="table-head-cell">
                                        Nội dung
                                    </th>
                                    <th className="table-head-cell">
                                        Trạng thái
                                    </th>
                                    <th className="table-head-cell">
                                        Thời gian
                                    </th>
                                    <th className="table-head-cell">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {paginatedReports.length > 0 ? (
                                    paginatedReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="table-body-row"
                                        >
                                            <td className="table-body-cell">
                                                {report.reporterEmail || "N/A"}
                                            </td>
                                            <td className="table-body-cell">
                                                {report.description}
                                            </td>
                                            <td className="table-body-cell">
                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        report.status,
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        report.status,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="table-body-cell">
                                                {formatDate(report.createdAt)}
                                            </td>
                                            <td className="table-body-cell">
                                                <button
                                                    className="pr-btn"
                                                    onClick={() =>
                                                        handleViewDetail(
                                                            report.id,
                                                        )
                                                    }
                                                >
                                                    <FaEye /> Xem
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            Không có báo cáo
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="sc-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Trang trước
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                className="sc-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            <Modal
                isOpen={detailModalOpen}
                setIsOpen={setDetailModalOpen}
                title="Chi tiết báo cáo"
            >
                {reportDetail ? (
                    <>
                        <p>{reportDetail.description}</p>
                        {reportDetail.status === "Pending" && (
                            <div className="report-detail-actions">
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleUpdateStatus("Rejected")
                                    }
                                >
                                    Từ chối
                                </button>
                                <button
                                    className="pr-btn"
                                    onClick={() =>
                                        handleUpdateStatus("Resolved")
                                    }
                                >
                                    Xử lý
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <LoadingSpinner />
                )}
            </Modal>
        </section>
    );
};

export default AdminListReportPage;
