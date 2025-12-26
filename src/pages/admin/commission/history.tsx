import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import {
    MdHistory,
    MdAccountBalanceWallet,
    MdTrendingUp,
    MdArrowBack,
} from "react-icons/md";
import { useDocumentTitle, formatDate } from "../../../utils/helper";
import { LoadingSpinner } from "../../../components/elements";
import { routes } from "../../../routes/routeName";
import "../../../assets/scss/admin/commission/admin_commission_history.scss";

interface RateChangeHistory {
    id: string;
    changedAt: string;
    changedBy: string;
    oneToOneOnline: { old: number; new: number };
    oneToOneOffline: { old: number; new: number };
    groupClassOnline: { old: number; new: number };
    groupClassOffline: { old: number; new: number };
}

interface CommissionTransaction {
    id: string;
    transactionId: string;
    classId?: string;
    className?: string;
    tutorId?: string;
    tutorName?: string;
    amount: number;
    commissionRate: number;
    grossAmount: number;
    createdAt: string;
    status: string;
}

const AdminCommissionHistoryPage: FC = () => {
    useDocumentTitle("Lịch sử hoa hồng");
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<"rate" | "transactions">("rate");
    const [rateHistoryLoading, setRateHistoryLoading] = useState(false);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [rateHistory, setRateHistory] = useState<RateChangeHistory[]>([]);
    const [transactions, setTransactions] = useState<CommissionTransaction[]>(
        [],
    );

    useEffect(() => {
        if (activeTab === "rate") {
            loadRateHistory();
        } else {
            loadTransactions();
        }
    }, [activeTab]);

    const loadRateHistory = async () => {
        setRateHistoryLoading(true);
        // TODO: Replace with actual API call
        setTimeout(() => {
            const mockData: RateChangeHistory[] = [
                {
                    id: "1",
                    changedAt: new Date().toISOString(),
                    changedBy: "Admin",
                    oneToOneOnline: { old: 0.1, new: 0.12 },
                    oneToOneOffline: { old: 0.13, new: 0.15 },
                    groupClassOnline: { old: 0.08, new: 0.1 },
                    groupClassOffline: { old: 0.1, new: 0.12 },
                },
                {
                    id: "2",
                    changedAt: new Date(
                        Date.now() - 86400000 * 7,
                    ).toISOString(),
                    changedBy: "Admin",
                    oneToOneOnline: { old: 0.12, new: 0.1 },
                    oneToOneOffline: { old: 0.15, new: 0.13 },
                    groupClassOnline: { old: 0.1, new: 0.08 },
                    groupClassOffline: { old: 0.12, new: 0.1 },
                },
            ];
            setRateHistory(mockData);
            setRateHistoryLoading(false);
        }, 500);
    };

    const loadTransactions = async () => {
        setTransactionsLoading(true);
        // TODO: Replace with actual API call
        setTimeout(() => {
            const mockData: CommissionTransaction[] = [
                {
                    id: "1",
                    transactionId: "txn_001",
                    classId: "class_001",
                    className: "Toán lớp 10 - Nhóm",
                    tutorId: "tutor_001",
                    tutorName: "Nguyễn Văn A",
                    amount: 120000,
                    commissionRate: 0.1,
                    grossAmount: 1200000,
                    createdAt: new Date().toISOString(),
                    status: "Succeeded",
                },
                {
                    id: "2",
                    transactionId: "txn_002",
                    classId: "class_002",
                    className: "Lý lớp 11 - 1-1",
                    tutorId: "tutor_002",
                    tutorName: "Trần Thị B",
                    amount: 180000,
                    commissionRate: 0.12,
                    grossAmount: 1500000,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    status: "Succeeded",
                },
            ];
            setTransactions(mockData);
            setTransactionsLoading(false);
        }, 500);
    };

    const formatPercent = (value: number) => {
        return (value * 100).toFixed(2) + "%";
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    return (
        <section id="admin-commission-history-section">
            <div className="ach-container">
                <div className="ach-header">
                    <button
                        className="pr-btn"
                        onClick={() => navigate(routes.admin.commission)}
                        style={{ marginRight: "1rem" }}
                    >
                        <MdArrowBack style={{ marginRight: "0.5rem" }} />
                        Quay lại
                    </button>
                    <div className="ach-header-icon">
                        <MdHistory />
                    </div>
                    <div className="ach-header-content">
                        <h4>Lịch sử hoa hồng</h4>
                        <p>
                            Trang tổng quát <span>Lịch sử hoa hồng</span>
                        </p>
                    </div>
                </div>

                <div className="ach-tabs">
                    <button
                        className={`ach-tab ${
                            activeTab === "rate" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("rate")}
                    >
                        <MdTrendingUp className="ach-tab-icon" />
                        <span>Lịch sử thay đổi tỷ lệ</span>
                    </button>
                    <button
                        className={`ach-tab ${
                            activeTab === "transactions" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        <MdAccountBalanceWallet className="ach-tab-icon" />
                        <span>Log giao dịch hoa hồng</span>
                    </button>
                </div>

                <div className="ach-content">
                    {activeTab === "rate" ? (
                        <div className="ach-rate-history">
                            {rateHistoryLoading ? (
                                <div className="loading-container">
                                    <LoadingSpinner />
                                    <p>Đang tải lịch sử thay đổi tỷ lệ...</p>
                                </div>
                            ) : rateHistory.length === 0 ? (
                                <div className="no-data">
                                    <p>Chưa có lịch sử thay đổi tỷ lệ</p>
                                </div>
                            ) : (
                                <div className="rate-history-list">
                                    {rateHistory.map((change) => (
                                        <div
                                            key={change.id}
                                            className="rate-history-item"
                                        >
                                            <div className="rate-history-header">
                                                <div className="rate-history-date">
                                                    <MdHistory className="rate-history-icon" />
                                                    <div>
                                                        <span className="date-label">
                                                            Ngày thay đổi:
                                                        </span>
                                                        <span className="date-value">
                                                            {formatDate(
                                                                change.changedAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="rate-history-user">
                                                    <span className="user-label">
                                                        Người thay đổi:
                                                    </span>
                                                    <span className="user-value">
                                                        {change.changedBy}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="rate-history-changes">
                                                <div className="rate-change-row">
                                                    <span className="rate-type">
                                                        1-1 Online:
                                                    </span>
                                                    <span className="rate-change">
                                                        <span className="rate-old">
                                                            {formatPercent(
                                                                change
                                                                    .oneToOneOnline
                                                                    .old,
                                                            )}
                                                        </span>
                                                        <span className="rate-arrow">
                                                            →
                                                        </span>
                                                        <span className="rate-new">
                                                            {formatPercent(
                                                                change
                                                                    .oneToOneOnline
                                                                    .new,
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="rate-change-row">
                                                    <span className="rate-type">
                                                        1-1 Offline:
                                                    </span>
                                                    <span className="rate-change">
                                                        <span className="rate-old">
                                                            {formatPercent(
                                                                change
                                                                    .oneToOneOffline
                                                                    .old,
                                                            )}
                                                        </span>
                                                        <span className="rate-arrow">
                                                            →
                                                        </span>
                                                        <span className="rate-new">
                                                            {formatPercent(
                                                                change
                                                                    .oneToOneOffline
                                                                    .new,
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="rate-change-row">
                                                    <span className="rate-type">
                                                        Nhóm Online:
                                                    </span>
                                                    <span className="rate-change">
                                                        <span className="rate-old">
                                                            {formatPercent(
                                                                change
                                                                    .groupClassOnline
                                                                    .old,
                                                            )}
                                                        </span>
                                                        <span className="rate-arrow">
                                                            →
                                                        </span>
                                                        <span className="rate-new">
                                                            {formatPercent(
                                                                change
                                                                    .groupClassOnline
                                                                    .new,
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="rate-change-row">
                                                    <span className="rate-type">
                                                        Nhóm Offline:
                                                    </span>
                                                    <span className="rate-change">
                                                        <span className="rate-old">
                                                            {formatPercent(
                                                                change
                                                                    .groupClassOffline
                                                                    .old,
                                                            )}
                                                        </span>
                                                        <span className="rate-arrow">
                                                            →
                                                        </span>
                                                        <span className="rate-new">
                                                            {formatPercent(
                                                                change
                                                                    .groupClassOffline
                                                                    .new,
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="ach-transactions">
                            {transactionsLoading ? (
                                <div className="loading-container">
                                    <LoadingSpinner />
                                    <p>Đang tải log giao dịch hoa hồng...</p>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="no-data">
                                    <p>Chưa có giao dịch hoa hồng nào</p>
                                </div>
                            ) : (
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-head-row">
                                            <th className="table-head-cell">
                                                Mã giao dịch
                                            </th>
                                            <th className="table-head-cell">
                                                Lớp học
                                            </th>
                                            <th className="table-head-cell">
                                                Gia sư
                                            </th>
                                            <th className="table-head-cell">
                                                Tổng tiền
                                            </th>
                                            <th className="table-head-cell">
                                                Tỷ lệ
                                            </th>
                                            <th className="table-head-cell">
                                                Hoa hồng
                                            </th>
                                            <th className="table-head-cell">
                                                Ngày tạo
                                            </th>
                                            <th className="table-head-cell">
                                                Trạng thái
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="no-data"
                                                >
                                                    Chưa có giao dịch hoa hồng
                                                    nào
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((txn) => (
                                                <tr
                                                    className="table-body-row"
                                                    key={txn.id}
                                                >
                                                    <td className="table-body-cell">
                                                        <span className="transaction-id">
                                                            {txn.transactionId}
                                                        </span>
                                                    </td>
                                                    <td className="table-body-cell">
                                                        <div className="class-info">
                                                            <span className="class-name">
                                                                {txn.className ||
                                                                    "N/A"}
                                                            </span>
                                                            {txn.classId && (
                                                                <span className="class-id">
                                                                    ID:{" "}
                                                                    {
                                                                        txn.classId
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="table-body-cell">
                                                        <div className="tutor-info">
                                                            <span className="tutor-name">
                                                                {txn.tutorName ||
                                                                    "N/A"}
                                                            </span>
                                                            {txn.tutorId && (
                                                                <span className="tutor-id">
                                                                    ID:{" "}
                                                                    {
                                                                        txn.tutorId
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="table-body-cell">
                                                        <span className="amount">
                                                            {formatCurrency(
                                                                txn.grossAmount,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="table-body-cell">
                                                        <span className="rate">
                                                            {formatPercent(
                                                                txn.commissionRate,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="table-body-cell">
                                                        <span className="commission-amount">
                                                            {formatCurrency(
                                                                txn.amount,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="table-body-cell">
                                                        {formatDate(
                                                            txn.createdAt,
                                                        )}
                                                    </td>
                                                    <td className="table-body-cell">
                                                        <span
                                                            className={`status-badge status-${txn.status.toLowerCase()}`}
                                                        >
                                                            {txn.status ===
                                                            "Succeeded"
                                                                ? "Thành công"
                                                                : txn.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminCommissionHistoryPage;
