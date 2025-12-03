import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../app/store";
import { verifyEmailForgotPasswordApiThunk } from "../../../services/auth/authThunk";
import { get } from "lodash";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/elements";
import { useDocumentTitle } from "../../../utils/helper";
const FormField = ({ name, label, placeholder, type = "text", Icon, }) => (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: label }), _jsxs("div", { className: "form-input-container", children: [_jsx(Icon, { className: "form-input-icon" }), _jsx(Field, { type: type, name: name, className: "form-input", placeholder: placeholder })] }), _jsx(ErrorMessage, { name: name, component: "div", className: "text-error" })] }));
const ForgotPasswordPage = () => {
    const dispatch = useAppDispatch();
    const initialValues = {
        email: "",
        newPassword: "",
        confirmPassword: "",
    };
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        newPassword: Yup.string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .required("Vui lòng nhập mật khẩu mới"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Mật khẩu nhập lại không khớp")
            .required("Vui lòng nhập lại mật khẩu"),
    });
    const handleSubmit = async (values, helpers) => {
        try {
            await dispatch(verifyEmailForgotPasswordApiThunk({ email: values.email })).unwrap();
            navigateHook(routes.verify_otp.forgot_password, { state: values });
        }
        catch (error) {
            const message = get(error, "message", "Có lỗi xảy ra");
            toast.error(message);
        }
        finally {
            helpers.setSubmitting(false);
        }
    };
    useDocumentTitle("Quên mật khẩu");
    return (_jsx("section", { id: "forgot-password-section", children: _jsxs("div", { className: "fps-container", children: [_jsx("div", { className: "fpscc1" }), _jsxs("div", { className: "fpscc2", children: [_jsx("h2", { children: "Qu\u00EAn m\u1EADt kh\u1EA9u" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ isSubmitting }) => (_jsxs(Form, { className: "form", children: [_jsx(FormField, { name: "email", label: "Email", placeholder: "Nh\u1EADp email c\u1EE7a b\u1EA1n", Icon: CiMail }), _jsx(FormField, { name: "newPassword", label: "M\u1EADt kh\u1EA9u m\u1EDBi", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u m\u1EDBi c\u1EE7a b\u1EA1n", type: "password", Icon: RiLockPasswordLine }), _jsx(FormField, { name: "confirmPassword", label: "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u", placeholder: "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi c\u1EE7a b\u1EA1n", type: "password", Icon: RiLockPasswordLine }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Xác nhận") })] })) })] })] }) }));
};
export default ForgotPasswordPage;
