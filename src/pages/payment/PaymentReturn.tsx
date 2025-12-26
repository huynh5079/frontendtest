import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { checkBalanceApiThunk, getAllTransactionHistoryApiThunk } from "../../services/wallet/walletThunk";
import { retryPaymentPayOSApi, retryPaymentApi } from "../../services/wallet/walletApi";
import "./payment-return.css";

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState<"loading" | "success" | "failed" | "cancelled">("loading");
    const [message, setMessage] = useState("");

    // Detect payment provider from URL path
    const isPayOS = location.pathname.includes("/payos/");
    const isMoMo = location.pathname.includes("/momo/");

    // PayOS parameters
    const payosCode = searchParams.get("code");
    const payosStatus = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");
    const cancel = searchParams.get("cancel");
    const payosId = searchParams.get("id");

    // MoMo parameters
    const momoResultCode = searchParams.get("resultCode");
    const momoMessage = searchParams.get("message");
    const momoOrderId = searchParams.get("orderId");
    const momoTransId = searchParams.get("transId");

    useEffect(() => {
        const processPayment = async () => {
            console.log("Payment Return params:", {
                isPayOS, isMoMo,
                payosCode, payosStatus, orderCode, cancel, payosId,
                momoResultCode, momoMessage, momoOrderId
            });

            // Check if payment was cancelled
            if (cancel === "true" || location.pathname.includes("/cancel")) {
                setStatus("cancelled");
                setMessage("Giao dịch đã bị hủy.");
                return;
            }

            // Get paymentId from localStorage
            const paymentId = localStorage.getItem("lastPaymentId");
            const savedProvider = localStorage.getItem(`paymentProvider_${paymentId}`);

            // Handle PayOS response
            if (isPayOS || savedProvider === "PayOS") {
                if (payosStatus === "PAID" || payosCode === "00") {
                    setStatus("success");
                    setMessage("Thanh toán PayOS thành công! Tiền sẽ được cộng vào ví của bạn.");

                    if (paymentId) {
                        try {
                            await retryPaymentPayOSApi(paymentId);
                            console.log("PayOS Payment retry successful");
                        } catch (error) {
                            console.log("PayOS Payment retry error (may be already processed):", error);
                        }
                        localStorage.removeItem("lastPaymentId");
                        localStorage.removeItem(`paymentProvider_${paymentId}`);
                    }
                } else if (payosStatus === "CANCELLED") {
                    setStatus("cancelled");
                    setMessage("Giao dịch PayOS đã bị hủy.");
                } else {
                    setStatus("failed");
                    setMessage("Thanh toán PayOS thất bại. Vui lòng thử lại.");
                }
            }
            // Handle MoMo response
            else if (isMoMo || savedProvider === "MoMo") {
                if (momoResultCode === "0") {
                    setStatus("success");
                    setMessage("Thanh toán MoMo thành công! Tiền sẽ được cộng vào ví của bạn.");

                    if (paymentId) {
                        try {
                            await retryPaymentApi(paymentId);
                            console.log("MoMo Payment retry successful");
                        } catch (error) {
                            console.log("MoMo Payment retry error (may be already processed):", error);
                        }
                        localStorage.removeItem("lastPaymentId");
                        localStorage.removeItem(`paymentProvider_${paymentId}`);
                    }
                } else if (momoResultCode === "1006") {
                    setStatus("cancelled");
                    setMessage("Giao dịch MoMo đã bị hủy.");
                } else {
                    setStatus("failed");
                    setMessage(`Thanh toán MoMo thất bại: ${momoMessage || "Vui lòng thử lại."}`);
                }
            }
            // Unknown provider - try generic success check
            else {
                setStatus("success");
                setMessage("Thanh toán hoàn tất!");

                if (paymentId) {
                    try {
                        // Try both APIs
                        if (savedProvider === "PayOS") {
                            await retryPaymentPayOSApi(paymentId);
                        } else {
                            await retryPaymentApi(paymentId);
                        }
                    } catch (error) {
                        console.log("Payment retry error:", error);
                    }
                    localStorage.removeItem("lastPaymentId");
                }
            }

            // Refresh balance and transaction history
            setTimeout(() => {
                dispatch(checkBalanceApiThunk());
                dispatch(getAllTransactionHistoryApiThunk({ page: 1, size: 10 }));
            }, 1000);
        };

        processPayment();
    }, [dispatch, isPayOS, isMoMo, payosCode, payosStatus, orderCode, cancel, payosId, momoResultCode, momoMessage, momoOrderId, location.pathname]);

    const handleBackToWallet = () => {
        // Navigate based on user role - for now redirect to a general path
        // User should be redirected back to their wallet
        const userRole = localStorage.getItem("roleName");
        if (userRole === "Student") {
            navigate("/student/information");
        } else if (userRole === "Tutor") {
            navigate("/tutor/wallet");
        } else if (userRole === "Parent") {
            navigate("/parent/information");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="payment-return-container">
            <div className="payment-return-card">
                {status === "loading" && (
                    <>
                        <div className="payment-return-icon loading">
                            <div className="spinner"></div>
                        </div>
                        <h2>Đang xử lý...</h2>
                        <p>Vui lòng đợi trong giây lát</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="payment-return-icon success">
                            ✓
                        </div>
                        <h2>Thanh toán thành công!</h2>
                        <p>{message}</p>
                        {orderCode && <p className="order-code">Mã đơn hàng: {orderCode}</p>}
                    </>
                )}

                {status === "failed" && (
                    <>
                        <div className="payment-return-icon failed">
                            ✗
                        </div>
                        <h2>Thanh toán thất bại</h2>
                        <p>{message}</p>
                    </>
                )}

                {status === "cancelled" && (
                    <>
                        <div className="payment-return-icon cancelled">
                            ⚠
                        </div>
                        <h2>Giao dịch đã hủy</h2>
                        <p>{message}</p>
                    </>
                )}

                <button className="back-btn" onClick={handleBackToWallet}>
                    Quay lại ví
                </button>
            </div>
        </div>
    );
};

export default PaymentReturn;
