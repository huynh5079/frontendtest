import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaLock } from "react-icons/fa";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoadingSpinner } from "../../elements";
import { useAppDispatch } from "../../../app/store";
import { changePasswordApiThunk } from "../../../services/auth/authThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { useDocumentTitle } from "../../../utils/helper";
const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: Yup.string()
        .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
        .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu nhập lại không khớp")
        .required("Vui lòng xác nhận mật khẩu mới"),
});
const ParentChangePassword = () => {
    const dispatch = useAppDispatch();
    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    const handleSubmit = async (values, helpers) => {
        await dispatch(changePasswordApiThunk(values))
            .unwrap()
            .then((res) => {
            const message = get(res, "message", "Đổi mật khẩu thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            helpers.setSubmitting(false);
            helpers.resetForm();
        });
    };
    useDocumentTitle("Đổi mật khẩu");
    return (_jsx("div", { className: "parent-change-password", children: _jsx(Formik, { initialValues: initialValues, validationSchema: ChangePasswordSchema, onSubmit: handleSubmit, children: ({ isSubmitting }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u1EADt kh\u1EA9u c\u0169" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaLock, { className: "form-input-icon" }), _jsx(Field, { type: "password", name: "oldPassword", className: "form-input", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u c\u0169 c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "oldPassword", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u1EADt kh\u1EA9u m\u1EDBi" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaLock, { className: "form-input-icon" }), _jsx(Field, { type: "password", name: "newPassword", className: "form-input", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u m\u1EDBi c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "newPassword", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaLock, { className: "form-input-icon" }), _jsx(Field, { type: "password", name: "confirmPassword", className: "form-input", placeholder: "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "confirmPassword", component: "div", className: "text-error" })] }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Đổi mật khẩu" })] })) }) }));
};
export default ParentChangePassword;
