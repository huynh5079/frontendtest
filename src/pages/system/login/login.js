import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { loginApiThunk } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { selectIsAuthenticated, selectUserLogin } from "../../../app/selector";
import { LoadingSpinner } from "../../../components/elements";
// === VALIDATION SCHEMA ===
const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
});
// === INITIAL VALUES ===
const initialValues = {
    email: "",
    password: "",
};
const LoginPage = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userRole = useAppSelector(selectUserLogin)?.role;
    // Map role -> route
    const roleRoutes = {
        Parent: routes.parent.home,
        Student: routes.student.home,
        Tutor: routes.tutor.dashboard,
        Admin: routes.admin.dashboard,
    };
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng nhập";
        if (isAuthenticated && userRole) {
            const redirectPath = roleRoutes[userRole];
            if (redirectPath)
                navigateHook(redirectPath);
        }
    }, [isAuthenticated, userRole]);
    // === HANDLERS ===
    const handleLogin = async (values, helpers) => {
        try {
            const res = await dispatch(loginApiThunk(values)).unwrap();
            const message = get(res, "data.message", "Đăng nhập thành công");
            toast.success(message);
        }
        catch (error) {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        }
        finally {
            helpers.setSubmitting(false);
        }
    };
    return (_jsx(Formik, { initialValues: initialValues, onSubmit: handleLogin, validationSchema: loginSchema, children: ({ handleSubmit, isSubmitting }) => (_jsx(Form, { onSubmit: handleSubmit, className: "form", children: _jsx("section", { id: "login-section", children: _jsxs("div", { className: "ls-container", children: [_jsx("div", { className: "lscc1" }), _jsxs("div", { className: "lscc2", children: [_jsx("h2", { children: "\u0110\u0103ng nh\u1EADp v\u00E0o h\u1EC7 th\u1ED1ng" }), _jsxs("div", { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiMail, { className: "form-input-icon" }), _jsx(Field, { type: "email", name: "email", className: "form-input", placeholder: "Nh\u1EADp email c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "email", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u1EADt kh\u1EA9u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(RiLockPasswordLine, { className: "form-input-icon" }), _jsx(Field, { type: "password", name: "password", className: "form-input", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "password", component: "div", className: "text-error" })] }), _jsx("p", { className: "forgot-password", onClick: () => navigateHook(routes.forgot_password), children: "Qu\u00EAn m\u1EADt kh\u1EA9u" }), _jsx("button", { className: isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn", type: "submit", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đăng nhập") })] }), _jsx("p", { className: "no-account", children: "B\u1EA1n ch\u01B0a c\u00F3 t\u00E0i kho\u1EA3n?" }), _jsxs("div", { className: "reg-now-container", children: [_jsx("div", { className: "line-left" }), _jsx("p", { className: "reg-now-text", onClick: () => navigateHook(routes.register.general), children: "\u0110\u0103ng k\u00FD ngay" }), _jsx("div", { className: "line-right" })] })] })] }) }) })) }));
};
export default LoginPage;
