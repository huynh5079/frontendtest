import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectBalance, selectListTransactionHistory, } from "../../../app/selector";
import { checkBalanceApiThunk, depositWalletApiThunk, getAllTransactionHistoryApiThunk, } from "../../../services/wallet/walletThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { Modal } from "../../modal";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { LoadingSpinner } from "../../elements";
import { toast } from "react-toastify";
import { get } from "lodash";
const StudentWallet = () => {
    const dispatch = useAppDispatch();
    const balance = useAppSelector(selectBalance);
    const transactrionHistory = useAppSelector(selectListTransactionHistory);
    const [isDepositOpend, setIsDepositOpend] = useState(false);
    const initialValues = {
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
        dispatch(getAllTransactionHistoryApiThunk({
            page: 1,
            size: 5,
        }));
    }, [dispatch]);
    useDocumentTitle("Ví thanh toán");
    return (_jsxs("div", { className: "student-wallet", children: [_jsxs("div", { className: "swr1", children: [_jsxs("p", { children: [_jsx("span", { children: "S\u1ED1 d\u01B0 hi\u1EC7n t\u1EA1i" }), ":", " ", balance?.balance.toLocaleString(), "\u0110"] }), _jsx("button", { className: "sc-btn", onClick: () => setIsDepositOpend(true), children: "N\u1EA1p ti\u1EC1n" })] }), _jsxs("div", { className: "swr2", children: [_jsx("h3", { children: "L\u1ECBch s\u1EED giao d\u1ECBch" }), _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "S\u1ED1 ti\u1EC1n giao d\u1ECBch" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian giao d\u1ECBch" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: transactrionHistory?.items?.map((item) => (_jsxs("tr", { className: "table-body-row", children: [_jsxs("td", { className: "table-body-cell", children: [item.amount.toLocaleString(), "\u0110"] }), _jsx("td", { className: "table-body-cell", children: item.status }), _jsx("td", { className: "table-body-cell", children: formatDate(item.createdAt) })] }, item.id))) })] })] }), _jsx(Modal, { isOpen: isDepositOpend, setIsOpen: setIsDepositOpend, title: "N\u1EA1p ti\u1EC1n", children: _jsx(Formik, { initialValues: initialValues, validationSchema: depositSchema, onSubmit: (values, helpers) => {
                        dispatch(depositWalletApiThunk(values))
                            .unwrap()
                            .then((res) => {
                            setIsDepositOpend(false);
                            // navigate(res.payUrl);
                            window.open(res.payUrl, "_blank");
                        })
                            .catch((error) => {
                            const errorData = get(error, "message", "Có lỗi xảy ra");
                            toast.error(errorData);
                            helpers.setSubmitting(false);
                        });
                    }, children: ({ isSubmitting }) => (_jsxs(Form, { action: "", className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "So\u0302\u0301 tie\u0302\u0300n" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineAttachMoney, { className: "form-input-icon" }), _jsx(Field, { type: "number", className: "form-input", placeholder: "Nha\u0323\u0302p so\u0302\u0301 tie\u0302\u0300n", name: "amount" })] }), _jsx(ErrorMessage, { name: "amount", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ghi chu\u0301" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineAttachMoney, { className: "form-input-icon" }), _jsx(Field, { type: "text", className: "form-input", placeholder: "Nha\u0323\u0302p ghi chu\u0301", name: "description" })] }), _jsx(ErrorMessage, { name: "description", component: "div", className: "text-error" })] }), _jsx("button", { className: isSubmitting ? "disable-btn" : "pr-btn", type: "submit", style: {
                                    padding: "0.75rem 0.5rem",
                                    fontSize: "1.25rem",
                                }, children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Nạp tiền" })] })) }) })] }));
};
export default StudentWallet;
