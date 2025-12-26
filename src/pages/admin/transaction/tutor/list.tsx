import { useEffect, useState, useCallback, type FC } from "react";
import { FaListUl, FaEye, FaFilter } from "react-icons/fa";
import { MdCheckCircle, MdSchedule, MdCancel } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectAdminTransactions,
    selectAdminTransactionsTotal,
    selectAdminTransactionsLoading,
    selectAdminTransactionDetail,
    selectAdminTransactionDetailLoading,
} from "../../../../app/selector";
import {
    getTransactionsForAdminApiThunk,
    getTransactionDetailForAdminApiThunk,
} from "../../../../services/admin/transaction/adminTransactionThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { LoadingSpinner } from "../../../../components/elements";
import { Modal } from "../../../../components/modal";
import "../../../../assets/scss/admin/transaction/tutor/admin_list_tutor_transaction.scss";

const AdminListTutorTransactionPage: FC = () => {
    const dispatch = useAppDispatch();
    const transactions = useAppSelector(selectAdminTransactions);
    const total = useAppSelector(selectAdminTransactionsTotal);
    const loading = useAppSelector(selectAdminTransactionsLoading);
    const transactionDetail = useAppSelector(selectAdminTransactionDetail);
    const detailLoading = useAppSelector(selectAdminTransactionDetailLoading);

    const [filterType, setFilterType] = useState<
        "all" | "Credit" | "Debit" | "TransferIn" | "TransferOut"
    >("all");
    const [filterStatus, setFilterStatus] = useState<
        "all" | "Succeeded" | "Pending" | "Failed"
    >("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showFilter, setShowFilter] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<
        string | null
    >(null);
    const [currentPage, setCurrentPage] = useState(1);

    useDocumentTitle("Lịch sử giao dịch với gia sư");

    const loadTransactions = useCallback(() => {
        dispatch(
            getTransactionsForAdminApiThunk({
                role: "Tutor",
                type: filterType === "all" ? undefined : filterType,
                status: filterStatus === "all" ? undefined : filterStatus,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                page: 1,
                pageSize: 50,
            }),
        );
    }, [dispatch, filterType, filterStatus, startDate, endDate]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const handleViewDetail = async (transactionId: string) => {
        setSelectedTransactionId(transactionId);
        setDetailModalOpen(true);
        await dispatch(getTransactionDetailForAdminApiThunk(transactionId));
    };

    const handleApplyFilter = () => {
        loadTransactions();
        setShowFilter(false);
    };

    const handleResetFilter = () => {
        setFilterType("all");
        setFilterStatus("all");
        setStartDate("");
        setEndDate("");
    };

    const getTypeText = (type: string) => {
        const typeMap: Record<string, string> = {
            Credit: "Nạp tiền",
            Debit: "Rút tiền",
            TransferIn: "Nhận tiền",
            TransferOut: "Chuyển tiền",
            PayEscrow: "Thanh toán escrow",
            EscrowIn: "Nhận escrow",
            PayoutIn: "Nhận thanh toán",
            PayoutOut: "Chi trả",
            RefundIn: "Nhận hoàn tiền",
            RefundOut: "Hoàn tiền",
            Commission: "Hoa hồng",
            DepositOut: "Đặt cọc",
            DepositIn: "Nhận cọc",
            DepositRefundIn: "Nhận hoàn cọc",
            DepositRefundOut: "Hoàn cọc",
        };
        return typeMap[type] || type;
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            Succeeded: "Thành công",
            Pending: "Đang chờ",
            Failed: "Thất bại",
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status: string) => {
        const classMap: Record<string, string> = {
            Succeeded: "status-succeeded",
            Pending: "status-pending",
            Failed: "status-failed",
        };
        return classMap[status] || "";
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    // Calculate statistics
    const allCount = total;
    const succeededCount = transactions.filter(
        (t) => t.status === "Succeeded",
    ).length;
    const pendingCount = transactions.filter(
        (t) => t.status === "Pending",
    ).length;
    const failedCount = transactions.filter(
        (t) => t.status === "Failed",
    ).length;

    const itemsPerPage = 6;

    // Tổng số trang
    const totalPages = transactions
        ? Math.ceil(transactions.length / itemsPerPage)
        : 1;

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = transactions?.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    useEffect(() => {
        setCurrentPage(1); // reset khi đổi filter
    }, [filterStatus]);

    return (
        <section id="admin-list-tutor-transaction-section">
            <div className="altts-container">
                <div className="alttscr1">
                    <h4>Gia sư</h4>
                    <button
                        className="pr-btn filter-toggle-btn"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <FaFilter className="filter-icon" />
                        {showFilter ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                    </button>
                </div>

                {showFilter && (
                    <div className="alttscr-filter">
                        <div className="filter-row">
                            <div className="filter-field">
                                <label htmlFor="filter-type">
                                    Loại giao dịch:
                                </label>
                                <select
                                    id="filter-type"
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(
                                            e.target.value as
                                                | "all"
                                                | "Credit"
                                                | "Debit"
                                                | "TransferIn"
                                                | "TransferOut",
                                        )
                                    }
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="Credit">Nạp tiền</option>
                                    <option value="Debit">Rút tiền</option>
                                    <option value="TransferIn">
                                        Nhận tiền
                                    </option>
                                    <option value="TransferOut">
                                        Chuyển tiền
                                    </option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label htmlFor="filter-status">
                                    Trạng thái:
                                </label>
                                <select
                                    id="filter-status"
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(
                                            e.target.value as
                                                | "all"
                                                | "Succeeded"
                                                | "Pending"
                                                | "Failed",
                                        )
                                    }
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="Succeeded">
                                        Thành công
                                    </option>
                                    <option value="Pending">Đang chờ</option>
                                    <option value="Failed">Thất bại</option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label htmlFor="filter-start-date">
                                    Từ ngày:
                                </label>
                                <input
                                    id="filter-start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    aria-label="Từ ngày"
                                />
                            </div>
                            <div className="filter-field">
                                <label htmlFor="filter-end-date">
                                    Đến ngày:
                                </label>
                                <input
                                    id="filter-end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    aria-label="Đến ngày"
                                />
                            </div>
                        </div>
                        <div className="filter-actions">
                            <button
                                className="pr-btn"
                                onClick={handleApplyFilter}
                            >
                                Áp dụng bộ lọc
                            </button>
                            <button
                                className="pr-btn reset-filter-btn"
                                onClick={handleResetFilter}
                            >
                                Đặt lại
                            </button>
                        </div>
                    </div>
                )}

                <div className="alttscr3">
                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner />
                            <p>Đang tải danh sách giao dịch...</p>
                        </div>
                    ) : paginatedData.length === 0 ? (
                        <div className="no-data">
                            <p>Chưa có giao dịch nào</p>
                        </div>
                    ) : (
                        <>
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Họ và tên
                                        </th>
                                        <th className="table-head-cell">
                                            Loại
                                        </th>
                                        <th className="table-head-cell">
                                            Số tiền
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
                                    {paginatedData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="table-body-cell no-data"
                                            >
                                                Chưa có giao dịch nào
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((txn) => (
                                            <tr
                                                className="table-body-row"
                                                key={txn.id}
                                            >
                                                <td className="table-body-cell">
                                                    <div className="user-info">
                                                        <span className="user-name">
                                                            {txn.userName ||
                                                                "N/A"}
                                                        </span>
                                                        {txn.userEmail && (
                                                            <span className="user-email">
                                                                {txn.userEmail}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="table-body-cell">
                                                    <span className="transaction-type">
                                                        {getTypeText(txn.type)}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    <span
                                                        className={`amount ${
                                                            txn.type ===
                                                                "Credit" ||
                                                            txn.type ===
                                                                "TransferIn" ||
                                                            txn.type ===
                                                                "RefundIn" ||
                                                            txn.type ===
                                                                "DepositRefundIn" ||
                                                            txn.type ===
                                                                "PayoutIn" ||
                                                            txn.type ===
                                                                "EscrowIn"
                                                                ? "positive"
                                                                : "negative"
                                                        }`}
                                                    >
                                                        {txn.type ===
                                                            "Credit" ||
                                                        txn.type ===
                                                            "TransferIn" ||
                                                        txn.type ===
                                                            "RefundIn" ||
                                                        txn.type ===
                                                            "DepositRefundIn" ||
                                                        txn.type ===
                                                            "PayoutIn" ||
                                                        txn.type === "EscrowIn"
                                                            ? "+"
                                                            : "-"}
                                                        {formatCurrency(
                                                            Math.abs(
                                                                txn.amount,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            txn.status,
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            txn.status,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(txn.createdAt)}
                                                </td>
                                                <td className="table-body-cell">
                                                    <button
                                                        className="pr-btn view-detail-btn"
                                                        onClick={() =>
                                                            handleViewDetail(
                                                                txn.id,
                                                            )
                                                        }
                                                    >
                                                        <FaEye className="view-detail-icon" />
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
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
                                        disabled={currentPage === totalPages}
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

            <Modal
                isOpen={detailModalOpen}
                setIsOpen={setDetailModalOpen}
                title="Chi tiết giao dịch"
            >
                {detailLoading ? (
                    <div className="loading-container">
                        <LoadingSpinner />
                        <p>Đang tải chi tiết...</p>
                    </div>
                ) : transactionDetail ? (
                    <div className="transaction-detail">
                        <div className="detail-section">
                            <h5>Thông tin giao dịch</h5>
                            <div className="detail-item">
                                <label>Mã giao dịch:</label>
                                <span className="transaction-id">
                                    {transactionDetail.id}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Loại:</label>
                                <span>
                                    {getTypeText(transactionDetail.type)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Số tiền:</label>
                                <span className="amount-value">
                                    {transactionDetail.type === "Credit" ||
                                    transactionDetail.type === "TransferIn" ||
                                    transactionDetail.type === "RefundIn" ||
                                    transactionDetail.type ===
                                        "DepositRefundIn" ||
                                    transactionDetail.type === "PayoutIn" ||
                                    transactionDetail.type === "EscrowIn"
                                        ? "+"
                                        : "-"}
                                    {formatCurrency(
                                        Math.abs(transactionDetail.amount),
                                    )}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Trạng thái:</label>
                                <span
                                    className={`status-badge ${getStatusClass(
                                        transactionDetail.status,
                                    )}`}
                                >
                                    {getStatusText(transactionDetail.status)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Thời gian:</label>
                                <span>
                                    {formatDate(transactionDetail.createdAt)}
                                </span>
                            </div>
                            {transactionDetail.note && (
                                <div className="detail-item">
                                    <label>Ghi chú:</label>
                                    <span>{transactionDetail.note}</span>
                                </div>
                            )}
                        </div>

                        <div className="detail-section">
                            <h5>Thông tin người dùng</h5>
                            <div className="detail-item">
                                <label>Họ và tên:</label>
                                <span>
                                    {transactionDetail.userName || "N/A"}
                                </span>
                            </div>
                            {transactionDetail.userEmail && (
                                <div className="detail-item">
                                    <label>Email:</label>
                                    <span>{transactionDetail.userEmail}</span>
                                </div>
                            )}
                            {transactionDetail.userId && (
                                <div className="detail-item">
                                    <label>User ID:</label>
                                    <span className="user-id">
                                        {transactionDetail.userId}
                                    </span>
                                </div>
                            )}
                        </div>

                        {transactionDetail.counterpartyUsername && (
                            <div className="detail-section">
                                <h5>Người liên quan</h5>
                                <div className="detail-item">
                                    <label>Họ và tên:</label>
                                    <span>
                                        {transactionDetail.counterpartyUsername}
                                    </span>
                                </div>
                                {transactionDetail.counterpartyUserId && (
                                    <div className="detail-item">
                                        <label>User ID:</label>
                                        <span className="user-id">
                                            {
                                                transactionDetail.counterpartyUserId
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-data">
                        <p>Không tìm thấy thông tin giao dịch</p>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default AdminListTutorTransactionPage;
