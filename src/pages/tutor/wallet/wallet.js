import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectBalance, selectListTransactionHistory, } from "../../../app/selector";
import { checkBalanceApiThunk, depositWalletApiThunk, getAllTransactionHistoryApiThunk, } from "../../../services/wallet/walletThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";
import { Modal } from "../../../components/modal";
const TutorWalletPage = () => {
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
    return (_jsxs("section", { id: "tutor-wallet-section", children: [_jsxs("div", { className: "tws-container", children: [_jsxs("div", { className: "twscr1", children: [_jsx("h4", { children: "V\u00ED thanh to\u00E1n" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "V\u00ED thanh to\u00E1n" })] })] }), _jsxs("div", { className: "twscr2", children: [_jsxs("div", { className: "twscr2-item active", children: [_jsx(FaListUl, { className: "twscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 giao d\u1ECBch" })] })] }), _jsxs("div", { className: "twscr2-item", children: [_jsx(FaArrowCircleUp, { className: "twscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "Ti\u1EC1n chuy\u1EC3n \u0111i" }), _jsx("p", { children: "2 giao d\u1ECBch" })] })] }), _jsxs("div", { className: "twscr2-item", children: [_jsx(FaArrowCircleDown, { className: "twscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "Ti\u1EC1n nh\u1EADn v\u00E0o" }), _jsx("p", { children: "1 giao d\u1ECBch" })] })] })] }), _jsxs("div", { className: "twscr3", children: [_jsxs("p", { children: [_jsx("span", { children: "S\u1ED1 d\u01B0 hi\u1EC7n t\u1EA1i" }), ":", " ", balance?.balance.toLocaleString(), "\u0110"] }), _jsx("button", { className: "pr-btn", children: "N\u1EA1p ti\u1EC1n" })] }), _jsx("div", { className: "twscr4", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "S\u1ED1 ti\u1EC1n giao d\u1ECBch" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian giao d\u1ECBch" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: transactrionHistory?.items?.map((item) => (_jsxs("tr", { className: "table-body-row", children: [_jsxs("td", { className: "table-body-cell", children: [item.amount.toLocaleString(), "\u0110"] }), _jsx("td", { className: "table-body-cell", children: item.status }), _jsx("td", { className: "table-body-cell", children: formatDate(item.createdAt) })] }, item.id))) })] }) })] }), _jsx(Modal, { isOpen: isDepositOpend, setIsOpen: setIsDepositOpend, title: "N\u1EA1p ti\u1EC1n", children: _jsx(Formik, { initialValues: initialValues, validationSchema: depositSchema, onSubmit: (values, helpers) => {
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
export default TutorWalletPage;
