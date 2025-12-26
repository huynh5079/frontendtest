import { useEffect, useState, useCallback, type FC } from "react";
import { FaListUl, FaEye, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdCheckCircle, MdSchedule, MdCancel } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectBalance,
    selectListTransactionHistory,
    selectMyWithdrawalRequests,
} from "../../../app/selector";
import {
    checkBalanceApiThunk,
    depositWalletApiThunk,
    depositWalletPayOSApiThunk,
    getAllTransactionHistoryApiThunk,
    createWithdrawalRequestApiThunk,
    getMyWithdrawalRequestsApiThunk,
    cancelWithdrawalRequestApiThunk,
} from "../../../services/wallet/walletThunk";
import {
    retryPaymentApi,
    retryPaymentPayOSApi,
} from "../../../services/wallet/walletApi";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import type {
    DepositWalletParams,
    DepositWalletResponse,
    WalletTransactionHistory,
    CreateWithdrawalRequestParams,
    WithdrawalRequestDto,
} from "../../../types/wallet";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";
import { Modal } from "../../../components/modal";
import WithdrawalRequestModal from "../../../components/wallet/WithdrawalRequestModal";
import { MoMoImg, PayOsImg } from "../../../assets/images";

const TutorWalletPage: FC = () => {
    const dispatch = useAppDispatch();
    const balance = useAppSelector(selectBalance);
    const transactrionHistory = useAppSelector(selectListTransactionHistory);
    const myWithdrawalRequests = useAppSelector(selectMyWithdrawalRequests);

    const [isDepositOpend, setIsDepositOpend] = useState(false);
    const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] =
        useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<WalletTransactionHistory | null>(null);
    const [filterStatus, setFilterStatus] = useState<
        "all" | "Succeeded" | "Pending" | "Failed"
    >("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [withdrawalPage, setWithdrawalPage] = useState(1);
    const [activeTab, setActiveTab] = useState<"transactions" | "withdrawals">(
        "transactions",
    );
    const [paymentProvider, setPaymentProvider] = useState<"MoMo" | "PayOS" | "">(
        "",
    ); // Default to PayOS
    const pageSize = 5; // Items per page for client-side pagination
    const fetchPageSize = 1000; // Load many items from server for client-side filtering

    const initialValues: DepositWalletParams = {
        amount: 0,
        contextType: "WalletDeposit",
        description: "",
        extraData: "",
    };

    const depositSchema = Yup.object().shape({
        amount: Yup.number()
            .min(0, "Số tiền phải lớn hơn 0")
            .required("Vui lòng nhập số tiền"),
        description: Yup.string().required("Vui lòng nhập ghi chú"),
    });

    // Function to retry payment and refresh balance (silent retry, only show success)
    const checkPaymentAndRefreshBalance = useCallback(
        async (paymentId: string, retryCount = 0) => {
            try {
                // Lấy provider từ localStorage hoặc thử cả 2
                const savedProvider = localStorage.getItem(
                    `paymentProvider_${paymentId}`,
                );
                const retryApi =
                    savedProvider === "PayOS"
                        ? retryPaymentPayOSApi
                        : retryPaymentApi;

                const result = await retryApi(paymentId);
                console.log("Payment retry result:", result);

                // Chỉ hiển thị thông báo khi backend xác nhận thành công
                if (result.status === "Ok") {
                    toast.success(
                        "💰 Thanh toán thành công! Tiền đã được cộng vào ví.",
                    );

                    // Refresh balance và transaction history sau 2 giây (đợi backend tạo transaction)
                    setTimeout(() => {
                        dispatch(checkBalanceApiThunk());
                        dispatch(
                            getAllTransactionHistoryApiThunk({
                                page: 1,
                                size: 5,
                            }),
                        );
                    }, 2000);

                    // Refresh lại lần nữa sau 5 giây để đảm bảo transaction đã được tạo
                    setTimeout(() => {
                        dispatch(checkBalanceApiThunk());
                        dispatch(
                            getAllTransactionHistoryApiThunk({
                                page: 1,
                                size: 5,
                            }),
                        );
                    }, 5000);
                } else {
                    // Không hiển thị thông báo lỗi, chỉ refresh balance im lặng
                    dispatch(checkBalanceApiThunk());
                    dispatch(
                        getAllTransactionHistoryApiThunk({
                            page: 1,
                            size: 5,
                        }),
                    );

                    // Retry im lặng nếu chưa thành công và chưa quá 3 lần
                    if (retryCount < 3) {
                        const delaySeconds = 10;
                        setTimeout(() => {
                            checkPaymentAndRefreshBalance(
                                paymentId,
                                retryCount + 1,
                            );
                        }, delaySeconds * 1000);
                    }
                }
            } catch (error: any) {
                // Không hiển thị lỗi, chỉ refresh balance im lặng
                dispatch(checkBalanceApiThunk());
                dispatch(
                    getAllTransactionHistoryApiThunk({
                        page: 1,
                        size: 5,
                    }),
                );

                // Retry im lặng nếu chưa quá 3 lần
                if (retryCount < 3) {
                    const delaySeconds = 10;
                    setTimeout(() => {
                        checkPaymentAndRefreshBalance(
                            paymentId,
                            retryCount + 1,
                        );
                    }, delaySeconds * 1000);
                }
            }
        },
        [dispatch],
    );

    const loadTransactions = useCallback(() => {
        dispatch(checkBalanceApiThunk());
        // Load many items for client-side filtering and pagination
        dispatch(
            getAllTransactionHistoryApiThunk({
                page: 1,
                size: fetchPageSize,
            }),
        );
    }, [dispatch]);

    const loadWithdrawalRequests = useCallback(() => {
        dispatch(
            getMyWithdrawalRequestsApiThunk({
                page: withdrawalPage,
                size: pageSize,
            }),
        );
    }, [dispatch, withdrawalPage, pageSize]);

    useEffect(() => {
        loadTransactions();
        if (activeTab === "withdrawals") {
            loadWithdrawalRequests();
        }
    }, [loadTransactions, activeTab, loadWithdrawalRequests]);

    // Check payment status when window gains focus (user returns from payment)
    useEffect(() => {
        const handleFocus = () => {
            const lastPaymentId = localStorage.getItem("lastPaymentId");
            if (lastPaymentId) {
                console.log("🔄 Window focused, checking payment status...");
                // Retry khi user quay lại từ MoMo (đợi 5 giây để đảm bảo MoMo đã redirect và cập nhật)
                setTimeout(() => {
                    checkPaymentAndRefreshBalance(lastPaymentId);
                    // Clear paymentId sau khi check
                    localStorage.removeItem("lastPaymentId");
                }, 5000); // 5 giây - tăng delay để đợi MoMo cập nhật status
            } else {
                // Nếu không có paymentId, chỉ refresh balance
                dispatch(checkBalanceApiThunk());
                dispatch(
                    getAllTransactionHistoryApiThunk({
                        page: 1,
                        size: 5,
                    }),
                );
            }
        };

        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [dispatch, checkPaymentAndRefreshBalance]);

    useDocumentTitle("Ví thanh toán");

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    const getStatusClass = (status: string) => {
        const classMap: Record<string, string> = {
            Succeeded: "status-succeeded",
            Pending: "status-pending",
            Failed: "status-failed",
        };
        return classMap[status] || "";
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

    const getWithdrawalStatusClass = (status: string) => {
        const classMap: Record<string, string> = {
            Pending: "status-pending",
            Approved: "status-pending",
            Processing: "status-pending",
            Succeeded: "status-succeeded",
            Completed: "status-succeeded",
            Failed: "status-failed",
            Rejected: "status-failed",
            Cancelled: "status-failed",
        };
        return classMap[status] || "";
    };

    const getWithdrawalStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            Pending: "Chờ duyệt",
            Approved: "Đã duyệt",
            Processing: "Đang xử lý",
            Succeeded: "Thành công",
            Completed: "Hoàn thành",
            Failed: "Thất bại",
            Rejected: "Từ chối",
            Cancelled: "Đã hủy",
        };
        return statusMap[status] || status;
    };

    const handleViewDetail = (transaction: WalletTransactionHistory) => {
        setSelectedTransaction(transaction);
        setDetailModalOpen(true);
    };

    // Calculate transaction statistics
    const allTransactions = transactrionHistory?.items || [];

    // Client-side filtering (since API doesn't support status filter)
    const filteredTransactions = allTransactions.filter((item) => {
        if (filterStatus === "all") return true;
        return item.status === filterStatus;
    });

    // Count from all transactions for summary cards
    const allCount = allTransactions.length;
    const succeededCount = allTransactions.filter(
        (t) => t.status === "Succeeded",
    ).length;
    const pendingCount = allTransactions.filter(
        (t) => t.status === "Pending",
    ).length;
    const failedCount = allTransactions.filter(
        (t) => t.status === "Failed",
    ).length;

    // Client-side pagination for filtered results
    const itemsPerPage = pageSize;
    const totalFilteredPages =
        Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

    // Ensure currentPage is valid when filter changes
    useEffect(() => {
        if (currentPage > totalFilteredPages && totalFilteredPages > 0) {
            setCurrentPage(1);
        }
    }, [filterStatus, totalFilteredPages, currentPage]);

    const validCurrentPage = Math.min(currentPage, totalFilteredPages) || 1;
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(
        startIndex,
        endIndex,
    );

    return (
        <section id="tutor-wallet-section">
            <div className="tws-container">
                <div className="twscr1">
                    <h4>Ví thanh toán</h4>
                    <p>
                        Trang tổng quát <span>Ví thanh toán</span>
                    </p>
                </div>
                <div className="twscr2">
                    <p>
                        <span>Số dư hiện tại</span>:{" "}
                        {balance?.balance.toLocaleString()}Đ
                    </p>
                    <div className="group-btn">
                        <button
                            className="pr-btn"
                            onClick={() => setIsDepositOpend(true)}
                        >
                            Nạp tiền
                        </button>
                        <button
                            className="sc-btn"
                            onClick={() => setIsWithdrawalRequestOpen(true)}
                        >
                            Rút tiền
                        </button>
                    </div>
                </div>

                <div className="tabs">
                    {(["transactions", "withdrawals"] as const).map((t) => (
                        <div
                            key={t}
                            className={`tab ${activeTab === t ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab(t);
                            }}
                        >
                            {t === "transactions" && "Lịch sử giao dịch"}
                            {t === "withdrawals" && "Yêu cầu rút tiền"}
                        </div>
                    ))}
                </div>

                {activeTab === "transactions" && (
                    <>
                        <div className="twscr3">
                            <div
                                className={`twscr3-item ${filterStatus === "all" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setFilterStatus("all");
                                    setCurrentPage(1);
                                }}
                            >
                                <FaListUl className="twscr3-item-icon" />
                                <div className="amount">
                                    <h5>Tất cả</h5>
                                    <p>{allCount} giao dịch</p>
                                </div>
                            </div>
                            <div
                                className={`twscr3-item ${filterStatus === "Succeeded" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setFilterStatus("Succeeded");
                                    setCurrentPage(1);
                                }}
                            >
                                <MdCheckCircle className="twscr3-item-icon" />
                                <div className="amount">
                                    <h5>Thành công</h5>
                                    <p>{succeededCount} giao dịch</p>
                                </div>
                            </div>
                            <div
                                className={`twscr3-item ${filterStatus === "Pending" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setFilterStatus("Pending");
                                    setCurrentPage(1);
                                }}
                            >
                                <MdSchedule className="twscr3-item-icon" />
                                <div className="amount">
                                    <h5>Đang chờ</h5>
                                    <p>{pendingCount} giao dịch</p>
                                </div>
                            </div>
                            <div
                                className={`twscr3-item ${filterStatus === "Failed" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setFilterStatus("Failed");
                                    setCurrentPage(1);
                                }}
                            >
                                <MdCancel className="twscr3-item-icon" />
                                <div className="amount">
                                    <h5>Thất bại</h5>
                                    <p>{failedCount} giao dịch</p>
                                </div>
                            </div>
                        </div>

                        <div className="twscr4">
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
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
                                    {paginatedTransactions.length > 0 ? (
                                        paginatedTransactions.map((item) => (
                                            <tr
                                                className="table-body-row"
                                                key={item.id}
                                            >
                                                <td className="table-body-cell">
                                                    <span className="transaction-type">
                                                        {getTypeText(item.type)}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    <span
                                                        className={`amount ${item.type ===
                                                                "Credit" ||
                                                                item.type ===
                                                                "TransferIn" ||
                                                                item.type ===
                                                                "RefundIn" ||
                                                                item.type ===
                                                                "DepositRefundIn" ||
                                                                item.type ===
                                                                "PayoutIn" ||
                                                                item.type ===
                                                                "EscrowIn"
                                                                ? "positive"
                                                                : "negative"
                                                            }`}
                                                    >
                                                        {item.type ===
                                                            "Credit" ||
                                                            item.type ===
                                                            "TransferIn" ||
                                                            item.type ===
                                                            "RefundIn" ||
                                                            item.type ===
                                                            "DepositRefundIn" ||
                                                            item.type ===
                                                            "PayoutIn" ||
                                                            item.type === "EscrowIn"
                                                            ? "+"
                                                            : "-"}
                                                        {formatCurrency(
                                                            Math.abs(
                                                                item.amount,
                                                            ),
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            item.status,
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            item.status,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(item.createdAt)}
                                                </td>
                                                <td className="table-body-cell">
                                                    <button
                                                        className="pr-btn view-detail-btn"
                                                        onClick={() =>
                                                            handleViewDetail(
                                                                item,
                                                            )
                                                        }
                                                    >
                                                        <FaEye className="view-detail-icon" />
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="table-body-row">
                                            <td
                                                colSpan={5}
                                                className="table-body-cell empty-state"
                                            >
                                                Chưa có giao dịch nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {totalFilteredPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="sc-btn"
                                        disabled={validCurrentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) => p - 1)
                                        }
                                    >
                                        Trang trước
                                    </button>

                                    <span>
                                        {validCurrentPage} /{" "}
                                        {totalFilteredPages}
                                    </span>

                                    <button
                                        className="sc-btn"
                                        disabled={
                                            validCurrentPage ===
                                            totalFilteredPages
                                        }
                                        onClick={() =>
                                            setCurrentPage((p) => p + 1)
                                        }
                                    >
                                        Trang sau
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "withdrawals" && (
                    <div className="twscr4">
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-head-row">
                                    <th className="table-head-cell">Số tiền</th>
                                    <th className="table-head-cell">
                                        Phương thức
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
                                {myWithdrawalRequests?.items &&
                                    myWithdrawalRequests.items.length > 0 ? (
                                    myWithdrawalRequests.items.map(
                                        (item: WithdrawalRequestDto) => (
                                            <tr
                                                className="table-body-row"
                                                key={item.id}
                                            >
                                                <td className="table-body-cell">
                                                    <span className="amount negative">
                                                        -
                                                        {formatCurrency(
                                                            item.amount,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    {item.method === "MoMo"
                                                        ? "Ví MoMo"
                                                        : item.method ===
                                                            "BankTransfer"
                                                            ? "Chuyển khoản"
                                                            : "PayPal"}
                                                </td>
                                                <td className="table-body-cell">
                                                    <span
                                                        className={`status-badge ${getWithdrawalStatusClass(
                                                            item.status,
                                                        )}`}
                                                    >
                                                        {getWithdrawalStatusText(
                                                            item.status,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(item.createdAt)}
                                                </td>
                                                <td className="table-body-cell">
                                                    {item.status ===
                                                        "Pending" && (
                                                            <button
                                                                className="pr-btn"
                                                                onClick={() => {
                                                                    if (
                                                                        window.confirm(
                                                                            "Bạn có chắc muốn hủy yêu cầu rút tiền này?",
                                                                        )
                                                                    ) {
                                                                        dispatch(
                                                                            cancelWithdrawalRequestApiThunk(
                                                                                item.id,
                                                                            ),
                                                                        )
                                                                            .unwrap()
                                                                            .then(
                                                                                () => {
                                                                                    toast.success(
                                                                                        "Đã hủy yêu cầu rút tiền",
                                                                                    );
                                                                                    loadWithdrawalRequests();
                                                                                    dispatch(
                                                                                        checkBalanceApiThunk(),
                                                                                    );
                                                                                },
                                                                            )
                                                                            .catch(
                                                                                (
                                                                                    error,
                                                                                ) => {
                                                                                    const errorData =
                                                                                        get(
                                                                                            error,
                                                                                            "data.message",
                                                                                            error?.errorMessage ||
                                                                                            "Có lỗi xảy ra",
                                                                                        );
                                                                                    toast.error(
                                                                                        errorData,
                                                                                    );
                                                                                },
                                                                            );
                                                                    }
                                                                }}
                                                                style={{
                                                                    fontSize:
                                                                        "0.875rem",
                                                                    padding:
                                                                        "0.5rem 1rem",
                                                                }}
                                                            >
                                                                Hủy
                                                            </button>
                                                        )}
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr className="table-body-row">
                                        <td
                                            colSpan={5}
                                            className="table-body-cell empty-state"
                                        >
                                            Chưa có yêu cầu rút tiền nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination for withdrawals */}
                        {myWithdrawalRequests &&
                            myWithdrawalRequests.total > pageSize && (
                                <div className="altscr4">
                                    <div
                                        className={`altscr4-item ${withdrawalPage > 1 ? "" : "disabled"
                                            }`}
                                        onClick={() => {
                                            if (withdrawalPage > 1) {
                                                setWithdrawalPage((p) => p - 1);
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: "smooth",
                                                });
                                            }
                                        }}
                                    >
                                        <FaArrowLeft className="altscr4-item-icon" />
                                    </div>
                                    <p className="altscr4-page">
                                        {withdrawalPage}
                                    </p>
                                    <div
                                        className={`altscr4-item ${withdrawalPage <
                                                Math.ceil(
                                                    myWithdrawalRequests.total /
                                                    pageSize,
                                                )
                                                ? ""
                                                : "disabled"
                                            }`}
                                        onClick={() => {
                                            if (
                                                withdrawalPage <
                                                Math.ceil(
                                                    myWithdrawalRequests.total /
                                                    pageSize,
                                                )
                                            ) {
                                                setWithdrawalPage((p) => p + 1);
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: "smooth",
                                                });
                                            }
                                        }}
                                    >
                                        <FaArrowRight className="altscr4-item-icon" />
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
            <Modal
                isOpen={isDepositOpend}
                setIsOpen={setIsDepositOpend}
                title="Nạp tiền"
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={depositSchema}
                    onSubmit={(
                        values: DepositWalletParams,
                        helpers: FormikHelpers<DepositWalletParams>,
                    ) => {
                        const depositThunk =
                            paymentProvider === "PayOS"
                                ? depositWalletPayOSApiThunk
                                : depositWalletApiThunk;

                        dispatch(depositThunk(values))
                            .unwrap()
                            .then((res: DepositWalletResponse) => {
                                setIsDepositOpend(false);
                                // Lưu paymentId và provider để query sau
                                if (res.paymentId) {
                                    localStorage.setItem(
                                        "lastPaymentId",
                                        res.paymentId,
                                    );
                                    localStorage.setItem(
                                        `paymentProvider_${res.paymentId}`,
                                        paymentProvider,
                                    );
                                }

                                // Xử lý PayOS (có QR code) hoặc MoMo (có payUrl)
                                if (paymentProvider === "PayOS") {
                                    // PayOS trả về checkoutUrl trong res.data
                                    const payOSUrl =
                                        res.data?.checkoutUrl ||
                                        res.checkoutUrl ||
                                        res.payUrl;
                                    if (payOSUrl) {
                                        window.open(payOSUrl, "_blank");
                                        toast.success(
                                            "✅ Đã tạo đơn thanh toán PayOS. Vui lòng thanh toán trên trang web đã mở.",
                                        );
                                    } else {
                                        toast.success(
                                            "✅ Đã tạo đơn thanh toán PayOS. Vui lòng quét QR code để thanh toán.",
                                        );
                                    }
                                } else {
                                    window.open(res.payUrl, "_blank");
                                    toast.success(
                                        "✅ Đã tạo đơn thanh toán. Vui lòng thanh toán trên MoMo.",
                                    );
                                }

                                // Tự động query payment status sau 15 giây
                                setTimeout(() => {
                                    if (res.paymentId) {
                                        checkPaymentAndRefreshBalance(
                                            res.paymentId,
                                        );
                                    }
                                }, 15000);
                            })
                            .catch((error) => {
                                const errorData = get(
                                    error,
                                    "message",
                                    "Có lỗi xảy ra",
                                );
                                toast.error(errorData);
                                helpers.setSubmitting(false);
                            });
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form action="" className="form">
                            <div className="form-field">
                                <label className="form-label">
                                    Phương thức thanh toán
                                </label>
                                <div className="payment-methods">
                                    <div
                                        className="payment-method"
                                        onClick={() =>
                                            setPaymentProvider("PayOS")
                                        }
                                    >
                                        <div
                                            className={`payment-method-figure ${paymentProvider === "PayOS"
                                                    ? "active"
                                                    : ""
                                                }`}
                                        >
                                            <img
                                                src={PayOsImg}
                                                alt="PayOS"
                                                className="payment-method-img"
                                            />
                                        </div>
                                        <span>PayOS</span>
                                    </div>

                                    <div
                                        className="payment-method"
                                        onClick={() =>
                                            setPaymentProvider("MoMo")
                                        }
                                    >
                                        <div
                                            className={`payment-method-figure ${paymentProvider === "MoMo"
                                                    ? "active"
                                                    : ""
                                                }`}
                                        >
                                            <img
                                                src={MoMoImg}
                                                alt="MoMo"
                                                className="payment-method-img"
                                            />
                                        </div>
                                        <span>MoMo</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="form-label">Số tiền</label>
                                <div className="form-input-container">
                                    <MdOutlineAttachMoney className="form-input-icon" />
                                    <Field
                                        type="number"
                                        className="form-input"
                                        placeholder="Nhập số tiền"
                                        name="amount"
                                    />
                                </div>
                                <ErrorMessage
                                    name="amount"
                                    component="div"
                                    className="text-error"
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Ghi chú</label>
                                <div className="form-input-container">
                                    <MdOutlineAttachMoney className="form-input-icon" />
                                    <Field
                                        type="text"
                                        className="form-input"
                                        placeholder="Nhập ghi chú"
                                        name="description"
                                    />
                                </div>
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-error"
                                />
                            </div>
                            <button
                                className={
                                    isSubmitting ? "disable-btn" : "pr-btn"
                                }
                                type="submit"
                                style={{
                                    padding: "0.75rem 0.5rem",
                                    fontSize: "1.25rem",
                                }}
                            >
                                {isSubmitting ? <LoadingSpinner /> : "Nạp tiền"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <Modal
                isOpen={detailModalOpen}
                setIsOpen={setDetailModalOpen}
                title="Chi tiết giao dịch"
            >
                {selectedTransaction ? (
                    <div className="transaction-detail">
                        <div className="detail-section">
                            <h5>Thông tin giao dịch</h5>
                            <div className="detail-item">
                                <label>Mã giao dịch:</label>
                                <span className="transaction-id">
                                    {selectedTransaction.id}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Loại:</label>
                                <span>
                                    {getTypeText(selectedTransaction.type)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Số tiền:</label>
                                <span className="amount-value">
                                    {selectedTransaction.type === "Credit" ||
                                        selectedTransaction.type === "TransferIn" ||
                                        selectedTransaction.type === "RefundIn" ||
                                        selectedTransaction.type ===
                                        "DepositRefundIn" ||
                                        selectedTransaction.type === "PayoutIn" ||
                                        selectedTransaction.type === "EscrowIn"
                                        ? "+"
                                        : "-"}
                                    {formatCurrency(
                                        Math.abs(selectedTransaction.amount),
                                    )}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Trạng thái:</label>
                                <span
                                    className={`status-badge ${getStatusClass(
                                        selectedTransaction.status,
                                    )}`}
                                >
                                    {getStatusText(selectedTransaction.status)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Thời gian:</label>
                                <span>
                                    {formatDate(selectedTransaction.createdAt)}
                                </span>
                            </div>
                            {selectedTransaction.note && (
                                <div className="detail-item">
                                    <label>Ghi chú:</label>
                                    <span>{selectedTransaction.note}</span>
                                </div>
                            )}
                        </div>
                        {selectedTransaction.counterpartyUsername && (
                            <div className="detail-section">
                                <h5>Người liên quan</h5>
                                <div className="detail-item">
                                    <label>Họ và tên:</label>
                                    <span>
                                        {
                                            selectedTransaction.counterpartyUsername
                                        }
                                    </span>
                                </div>
                                {selectedTransaction.counterpartyUserId && (
                                    <div className="detail-item">
                                        <label>User ID:</label>
                                        <span className="user-id">
                                            {
                                                selectedTransaction.counterpartyUserId
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
            <WithdrawalRequestModal
                isOpen={isWithdrawalRequestOpen}
                setIsOpen={setIsWithdrawalRequestOpen}
                balance={balance?.balance || 0}
                onSubmit={(
                    values: CreateWithdrawalRequestParams,
                    helpers: FormikHelpers<CreateWithdrawalRequestParams>,
                ) => {
                    dispatch(createWithdrawalRequestApiThunk(values))
                        .unwrap()
                        .then(() => {
                            setIsWithdrawalRequestOpen(false);
                            toast.success(
                                "✅ Rút tiền thành công! Tiền đã được trừ khỏi ví và chuyển đến tài khoản của bạn.",
                            );
                            dispatch(checkBalanceApiThunk());
                            loadWithdrawalRequests();
                        })
                        .catch((error) => {
                            const errorData = get(
                                error,
                                "data.message",
                                error?.errorMessage || "Có lỗi xảy ra",
                            );
                            toast.error(errorData);
                            helpers.setSubmitting(false);
                        });
                }}
            />
        </section>
    );
};

export default TutorWalletPage;
