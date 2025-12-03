import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch } from "../../../app/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { verifyEmailApiThunk } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";
// === VALIDATION SCHEMA & INITIAL VALUES ===
const initialValues = {
    username: "",
    email: "",
    password: "",
};
const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập họ và tên"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(8, "Mật khẩu tối thiểu 8 ký tự").required("Vui lòng nhập mật khẩu"),
});
const RegisterParentPage = () => {
    const dispatch = useAppDispatch();
    const handleSubmit = async (values, helpers) => {
        try {
            await dispatch(verifyEmailApiThunk({ email: values.email })).unwrap();
            navigateHook(routes.verify_otp.parent, { state: values });
        }
        catch (error) {
            const errorMessage = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorMessage);
        }
        finally {
            helpers.setSubmitting(false);
        }
    };
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký trở thành phụ huynh";
    }, []);
    return (_jsx("section", { id: "register-parent-section", children: _jsxs("div", { className: "rps-container", children: [_jsx("div", { className: "rpscc1" }), _jsxs("div", { className: "rpscc2", children: [_jsx("h2", { children: "\u0110\u0103ng k\u00FD t\u00E0i kho\u1EA3n ph\u1EE5 huynh" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ isSubmitting }) => (_jsxs(Form, { className: "form", children: [[
                                        { name: "username", label: "Họ và tên", type: "text", icon: MdOutlineDriveFileRenameOutline, placeholder: "Nhập họ và tên của bạn" },
                                        { name: "email", label: "Email", type: "email", icon: CiMail, placeholder: "Nhập email của bạn" },
                                        { name: "password", label: "Mật khẩu", type: "password", icon: RiLockPasswordLine, placeholder: "Nhập mật khẩu của bạn" },
                                    ].map((field) => {
                                        const Icon = field.icon;
                                        return (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: field.label }), _jsxs("div", { className: "form-input-container", children: [_jsx(Icon, { className: "form-input-icon" }), _jsx(Field, { name: field.name, type: field.type, className: "form-input", placeholder: field.placeholder })] }), _jsx(ErrorMessage, { name: field.name, component: "p", className: "text-error" })] }, field.name));
                                    }), _jsx("p", { className: "forgot-password", children: "Qu\u00EAn m\u1EADt kh\u1EA9u" }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", disabled: isSubmitting, children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Đăng ký" })] })) }), _jsx("p", { className: "no-account", children: "B\u1EA1n \u0111\u00E3 c\u00F3 t\u00E0i kho\u1EA3n?" }), _jsxs("div", { className: "reg-now-container", children: [_jsx("div", { className: "line-left" }), _jsx("p", { className: "reg-now-text", onClick: () => navigateHook(routes.login), children: "\u0110\u0103ng nh\u1EADp ngay" }), _jsx("div", { className: "line-right" })] })] })] }) }));
};
export default RegisterParentPage;
