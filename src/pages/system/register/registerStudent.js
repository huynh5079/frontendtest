import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { DatePickerElement, LoadingSpinner, } from "../../../components/elements";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../app/store";
import { verifyEmailApiThunk } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
// === MAX DATE & INITIAL VALUES & VALIDATION SCHEMA ===
const today = new Date();
const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
const initialValues = {
    username: "",
    email: "",
    password: "",
    birthday: null,
};
const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập họ và tên"),
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
    password: Yup.string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    birthday: Yup.date()
        .nullable()
        .max(maxDate, "Học viên cần đủ từ 16 tuổi trở lên")
        .required("Vui lòng chọn ngày sinh"),
});
const fields = [
    {
        name: "username",
        label: "Họ và tên",
        type: "text",
        icon: MdOutlineDriveFileRenameOutline,
        placeholder: "Nhập họ và tên của bạn",
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        icon: CiMail,
        placeholder: "Nhập email của bạn",
    },
    {
        name: "password",
        label: "Mật khẩu",
        type: "password",
        icon: RiLockPasswordLine,
        placeholder: "Nhập mật khẩu của bạn",
    },
];
const RegisterStudentPage = () => {
    const dispatch = useAppDispatch();
    const handleSubmit = async (values, helpers) => {
        const formatted = {
            ...values,
            birthday: values.birthday
                ? values.birthday.toLocaleDateString("en-CA")
                : "",
        };
        try {
            await dispatch(verifyEmailApiThunk({ email: formatted.email })).unwrap();
            navigateHook(routes.verify_otp.student, { state: formatted });
        }
        catch (error) {
            const errorMessage = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorMessage);
        }
        finally {
            helpers.setSubmitting(false);
        }
    };
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký trở thành học viên";
    }, []);
    return (_jsx("section", { id: "register-student-section", children: _jsxs("div", { className: "rss-container", children: [_jsxs("div", { className: "rsscc1", children: [_jsx("h2", { children: "\u0110\u0103ng k\u00FD t\u00E0i kho\u1EA3n h\u1ECDc vi\u00EAn" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ setFieldValue, values, isSubmitting }) => (_jsxs(Form, { className: "form", children: [fields.map((field) => {
                                        const Icon = field.icon;
                                        return (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: field.label }), _jsxs("div", { className: "form-input-container", children: [_jsx(Icon, { className: "form-input-icon" }), _jsx(Field, { name: field.name, type: field.type, className: "form-input", placeholder: field.placeholder })] }), _jsx(ErrorMessage, { name: field.name, component: "p", className: "text-error" })] }, field.name));
                                    }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y sinh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendarDate, { className: "form-input-icon" }), _jsx(DatePickerElement, { value: values.birthday, onChange: (date) => setFieldValue("birthday", date), maxDate: maxDate })] }), _jsxs("p", { className: "form-note", children: [_jsx("span", { children: "L\u01B0u \u00FD:" }), " H\u1ECDc vi\u00EAn c\u1EA7n \u0111\u1EE7 t\u1EEB 16 tu\u1ED5i tr\u1EDF l\u00EAn"] }), _jsx(ErrorMessage, { name: "birthday", component: "p", className: "text-error" })] }), _jsx("p", { className: "forgot-password", children: "Qu\u00EAn m\u1EADt kh\u1EA9u" }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đăng ký") })] })) }), _jsx("p", { className: "no-account", children: "B\u1EA1n \u0111\u00E3 c\u00F3 t\u00E0i kho\u1EA3n?" }), _jsxs("div", { className: "reg-now-container", children: [_jsx("div", { className: "line-left" }), _jsx("p", { className: "reg-now-text", onClick: () => navigateHook(routes.login), children: "\u0110\u0103ng nh\u1EADp ngay" }), _jsx("div", { className: "line-right" })] })] }), _jsx("div", { className: "rsscc2" })] }) }));
};
export default RegisterStudentPage;
