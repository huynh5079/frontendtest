import { useEffect, useState, useCallback, type FC } from "react";
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
import WithdrawalRequestModal from "../../wallet/WithdrawalRequestModal";
import type {
    DepositWalletParams,
    DepositWalletResponse,
    CreateWithdrawalRequestParams,
    WithdrawalRequestDto,
} from "../../../types/wallet";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { LoadingSpinner } from "../../elements";
import { toast } from "react-toastify";
import { get } from "lodash";
import { Modal } from "../../modal";
import { MoMoImg, PayOsImg } from "../../../assets/images";

const ParentWallet: FC = () => {
    const dispatch = useAppDispatch();
    const balance = useAppSelector(selectBalance);
    const transactrionHistory = useAppSelector(selectListTransactionHistory);
    const myWithdrawalRequests = useAppSelector(selectMyWithdrawalRequests);

    const [isDepositOpend, setIsDepositOpend] = useState(false);
    const [isWithdrawalRequestOpen, setIsWithdrawalRequestOpen] =
        useState(false);
    const [transactionPage, setTransactionPage] = useState(1);
    const [withdrawalPage, setWithdrawalPage] = useState(1);
    const [activeTab, setActiveTab] = useState<"transactions" | "withdrawals">(
        "transactions",
    );
    const [paymentProvider, setPaymentProvider] = useState<
        "MoMo" | "PayOS" | ""
    >(""); // Default to PayOS

    const pageSize = 6;

    const transactionTotalPages = transactrionHistory
        ? Math.ceil(transactrionHistory.total / transactrionHistory.size)
        : 1;
    const withdrawalTotalPages = myWithdrawalRequests
        ? Math.ceil(myWithdrawalRequests.total / myWithdrawalRequests.size)
        : 1;

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

    const loadWithdrawalRequests = useCallback(() => {
        dispatch(
            getMyWithdrawalRequestsApiThunk({
                page: withdrawalPage,
                size: pageSize,
            }),
        );
    }, [dispatch, withdrawalPage, pageSize]);

    useEffect(() => {
        dispatch(checkBalanceApiThunk());

        dispatch(
            getAllTransactionHistoryApiThunk({
                page: transactionPage,
                size: pageSize,
            }),
        );

        if (activeTab === "withdrawals") {
            loadWithdrawalRequests();
        }
    }, [
        dispatch,
        activeTab,
        loadWithdrawalRequests,
        pageSize,
        transactionPage,
    ]);

    // Check payment status when window gains focus (user returns from payment)
    useEffect(() => {
        const handleFocus = () => {
            const lastPaymentId = localStorage.getItem("lastPaymentId");
            if (lastPaymentId) {
                // Check khi user quay lại từ MoMo (đợi 3 giây để đảm bảo MoMo đã redirect)
                setTimeout(() => {
                    checkPaymentAndRefreshBalance(lastPaymentId);
                    // Clear paymentId sau khi check
                    localStorage.removeItem("lastPaymentId");
                }, 3000);
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

    const Pagination = ({
        page,
        totalPages,
        onPrev,
        onNext,
    }: {
        page: number;
        totalPages: number;
        onPrev: () => void;
        onNext: () => void;
    }) => {
        if (totalPages <= 1) return null;

        return (
            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={onPrev}
                    className="pg-btn"
                >
                    <FaArrowLeft />
                </button>

                <span className="pg-info">
                    Trang {page} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={onNext}
                    className="pg-btn"
                >
                    <FaArrowRight />
                </button>
            </div>
        );
    };

    return (
        <div className="parent-wallet">
            <div className="pwr1">
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
                <div className="pwr2">
                    <h3>Lịch sử giao dịch</h3>
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Số tiền giao dịch
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian giao dịch
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {transactrionHistory?.items.length === 0 ? (
                                <tr className="table-body-row">
                                    <td
                                        colSpan={3}
                                        className="table-body-cell no-data"
                                    >
                                        Chưa có giao dịch nào
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {transactrionHistory?.items?.map((item) => (
                                        <tr
                                            className="table-body-row"
                                            key={item.id}
                                        >
                                            <td className="table-body-cell">
                                                {item.amount.toLocaleString()}Đ
                                            </td>
                                            <td className="table-body-cell">
                                                {item.status}
                                            </td>
                                            <td className="table-body-cell">
                                                {formatDate(item.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>

                    {transactionTotalPages > 1 && (
                        <Pagination
                            page={transactionPage}
                            totalPages={transactionTotalPages || 1}
                            onPrev={() =>
                                setTransactionPage((p) => Math.max(1, p - 1))
                            }
                            onNext={() =>
                                setTransactionPage((p) =>
                                    Math.min(p + 1, transactionTotalPages || p),
                                )
                            }
                        />
                    )}
                </div>
            )}

            {activeTab === "withdrawals" && (
                <div className="pwr2">
                    <h3>Yêu cầu rút tiền</h3>
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Số tiền</th>
                                <th className="table-head-cell">Phương thức</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">Thời gian</th>
                                <th className="table-head-cell">Thao tác</th>
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
                                                {item.status === "Pending" && (
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
                                        className="table-body-cell no-data"
                                    >
                                        Chưa có yêu cầu rút tiền nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {withdrawalTotalPages > 1 && (
                        <Pagination
                            page={withdrawalPage}
                            totalPages={withdrawalTotalPages || 1}
                            onPrev={() =>
                                setWithdrawalPage((p) => Math.max(1, p - 1))
                            }
                            onNext={() =>
                                setWithdrawalPage((p) =>
                                    Math.min(p + 1, withdrawalTotalPages || p),
                                )
                            }
                        />
                    )}
                </div>
            )}
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
                                            className={`payment-method-figure ${
                                                paymentProvider === "PayOS"
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
                                            className={`payment-method-figure ${
                                                paymentProvider === "MoMo"
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
        </div>
    );
};

export default ParentWallet;
