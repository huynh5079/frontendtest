import { useEffect, useState, type FC } from "react";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
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
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import type {
    DepositWalletParams,
    DepositWalletResponse,
} from "../../../types/wallet";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";
import { Modal } from "../../../components/modal";

const TutorWalletPage: FC = () => {
    const dispatch = useAppDispatch();
    const balance = useAppSelector(selectBalance);
    const transactrionHistory = useAppSelector(selectListTransactionHistory);

    const [isDepositOpend, setIsDepositOpend] = useState(false);

    const initialValues: DepositWalletParams = {
        amount: 0,
        contextType: "WalletDeposit",
        contextId: balance?.userId || "",
        description: "",
        extraData: "",
    };

    const depositSchema = Yup.object().shape({
        amount: Yup.number()
            .min(0, "Số tiền phải lớn hơn 0")
            .required("Vui lòng nhập số tiền"),
        description: Yup.string().required("Vui lòng nhập ghi chú"),
    });

    useEffect(() => {
        dispatch(checkBalanceApiThunk());
        dispatch(
            getAllTransactionHistoryApiThunk({
                page: 1,
                size: 5,
            })
        );
    }, [dispatch]);

    useDocumentTitle("Ví thanh toán");

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
                    <div className="twscr2-item active">
                        <FaListUl className="twscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 giao dịch</p>
                        </div>
                    </div>
                    <div className="twscr2-item">
                        <FaArrowCircleUp className="twscr2-item-icon" />
                        <div className="amount">
                            <h5>Tiền chuyển đi</h5>
                            <p>2 giao dịch</p>
                        </div>
                    </div>
                    <div className="twscr2-item">
                        <FaArrowCircleDown className="twscr2-item-icon" />
                        <div className="amount">
                            <h5>Tiền nhận vào</h5>
                            <p>1 giao dịch</p>
                        </div>
                    </div>
                </div>
                <div className="twscr3">
                    <p>
                        <span>Số dư hiện tại</span>:{" "}
                        {balance?.balance.toLocaleString()}Đ
                    </p>
                    <button className="pr-btn">Nạp tiền</button>
                </div>
                <div className="twscr4">
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
                                <th className="table-head-cell">Thao tác</th>
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
                                // navigate(res.payUrl);
                                window.open(res.payUrl, "_blank");
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
        </section>
    );
};

export default TutorWalletPage;
