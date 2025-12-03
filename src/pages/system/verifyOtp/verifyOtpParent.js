import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LoadingSpinner, OTPInput } from "../../../components/elements";
import { useAppDispatch } from "../../../app/store";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useLocation } from "react-router-dom";
import { registerParentApiThunk, verifyOtpApiThunk, } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { useDocumentTitle } from "../../../utils/helper";
const VerifyOtpParentPage = () => {
    const dispatch = useAppDispatch();
    const { state } = useLocation();
    const initialValues = {
        email: state?.email || "",
        code: "",
    };
    const validationSchema = Yup.object({
        code: Yup.string()
            .length(6, "Mã OTP phải có 6 chữ số")
            .required("Vui lòng nhập mã OTP"),
    });
    const handleSubmit = async (values, helpers) => {
        helpers.setSubmitting(true);
        try {
            await dispatch(verifyOtpApiThunk(values)).unwrap();
            const res = await dispatch(registerParentApiThunk(state)).unwrap();
            toast.success(res?.message ?? "Đăng ký thành công");
            navigateHook(routes.login);
        }
        catch (error) {
            // ưu tiên lỗi từ server
            const message = error?.data?.message ?? error?.message ?? "Có lỗi xảy ra";
            toast.error(message);
        }
        finally {
            helpers.setSubmitting(false);
        }
    };
    useDocumentTitle("Xác thực mã OTP");
    return (_jsx("section", { id: "verify-otp-section", children: _jsxs("div", { className: "vos-container", children: [_jsx("div", { className: "voscc1" }), _jsxs("div", { className: "voscc2", children: [_jsx("h2", { children: "X\u00E1c th\u1EF1c m\u00E3 OTP" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ setFieldValue, isSubmitting }) => (_jsxs(Form, { children: [_jsx(OTPInput, { onChange: (code) => setFieldValue("code", code) }), _jsx(ErrorMessage, { name: "code", component: "div", className: "text-error" }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Xác thực") })] })) })] })] }) }));
};
export default VerifyOtpParentPage;
