import { useEffect, useState, useCallback, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectBalance,
    selectListTransactionHistory,
} from "../../../app/selector";
import {
    checkBalanceApiThunk,
    depositWalletApiThunk,
    getAllTransactionHistoryApiThunk,
} from "../../../services/wallet/walletThunk";
import { retryPaymentApi } from "../../../services/wallet/walletApi";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import type {
    DepositWalletParams,
    DepositWalletResponse,
} from "../../../types/wallet";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { LoadingSpinner } from "../../elements";
import { toast } from "react-toastify";
import { get } from "lodash";
import { Modal } from "../../modal";

const ParentWallet: FC = () => {
    const dispatch = useAppDispatch();
    const balance = useAppSelector(selectBalance);
    const transactrionHistory = useAppSelector(selectListTransactionHistory);

    const [isDepositOpend, setIsDepositOpend] = useState(false);

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
    const checkPaymentAndRefreshBalance = useCallback(async (paymentId: string, retryCount = 0) => {
        try {
            const result = await retryPaymentApi(paymentId);
            console.log("Payment retry result:", result);

            // Chỉ hiển thị thông báo khi backend xác nhận thành công
            if (result.status === "Ok") {
                toast.success("💰 Thanh toán thành công! Tiền đã được cộng vào ví.");

                // Refresh balance và transaction history sau 2 giây (đợi backend tạo transaction)
                setTimeout(() => {
                    dispatch(checkBalanceApiThunk());
                    dispatch(
                        getAllTransactionHistoryApiThunk({
                            page: 1,
                            size: 5,
                        })
                    );
                }, 2000);

                // Refresh lại lần nữa sau 5 giây để đảm bảo transaction đã được tạo
                setTimeout(() => {
                    dispatch(checkBalanceApiThunk());
                    dispatch(
                        getAllTransactionHistoryApiThunk({
                            page: 1,
                            size: 5,
                        })
                    );
                }, 5000);
            } else {
                // Không hiển thị thông báo lỗi, chỉ refresh balance im lặng
                dispatch(checkBalanceApiThunk());
                dispatch(
                    getAllTransactionHistoryApiThunk({
                        page: 1,
                        size: 5,
                    })
                );

                // Retry im lặng nếu chưa thành công và chưa quá 3 lần
                if (retryCount < 3) {
                    const delaySeconds = 10;
                    setTimeout(() => {
                        checkPaymentAndRefreshBalance(paymentId, retryCount + 1);
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
                })
            );

            // Retry im lặng nếu chưa quá 3 lần
            if (retryCount < 3) {
                const delaySeconds = 10;
                setTimeout(() => {
                    checkPaymentAndRefreshBalance(paymentId, retryCount + 1);
                }, delaySeconds * 1000);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(checkBalanceApiThunk());
        dispatch(
            getAllTransactionHistoryApiThunk({
                page: 1,
                size: 5,
            })
        );
    }, [dispatch]);

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
                    })
                );
            }
        };

        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [dispatch, checkPaymentAndRefreshBalance]);

    useDocumentTitle("Ví thanh toán");

    return (
        <div className="parent-wallet">
            <div className="pwr1">
                <p>
                    <span>Số dư hiện tại</span>:{" "}
                    {balance?.balance.toLocaleString()}Đ
                </p>
                <button
                    className="sc-btn"
                    onClick={() => setIsDepositOpend(true)}
                >
                    Nạp tiền
                </button>
            </div>
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
                        {transactrionHistory?.items?.map((item) => (
                            <tr className="table-body-row" key={item.id}>
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
                    </tbody>
                </table>
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
                        helpers: FormikHelpers<DepositWalletParams>
                    ) => {
                        dispatch(depositWalletApiThunk(values))
                            .unwrap()
                            .then((res: DepositWalletResponse) => {
                                setIsDepositOpend(false);
                                // Lưu paymentId để query sau
                                if (res.paymentId) {
                                    localStorage.setItem("lastPaymentId", res.paymentId);
                                }
                                // Mở payment URL
                                window.open(res.payUrl, "_blank");
                                toast.success("✅ Đã tạo đơn thanh toán. Vui lòng thanh toán trên MoMo.");
                                // Tự động query payment status sau 15 giây (đợi MoMo cập nhật - MoMo có thể cần 15-30 giây)
                                setTimeout(() => {
                                    if (res.paymentId) {
                                        checkPaymentAndRefreshBalance(res.paymentId);
                                    }
                                }, 15000); // 15 giây - tăng delay để đợi MoMo cập nhật
                            })
                            .catch((error) => {
                                const errorData = get(
                                    error,
                                    "message",
                                    "Có lỗi xảy ra"
                                );
                                toast.error(errorData);
                                helpers.setSubmitting(false);
                            });
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form action="" className="form">
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
