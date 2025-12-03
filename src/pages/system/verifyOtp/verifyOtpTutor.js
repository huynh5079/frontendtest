import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LoadingSpinner, OTPInput } from "../../../components/elements";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { registerTutorApiThunk, verifyOtpApiThunk, } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
const VerifyOtpTutorPage = () => {
    const dispatch = useAppDispatch();
    const tutorData = useAppSelector((state) => state.registerTutor.formData);
    const initialValues = {
        email: tutorData?.email || "",
        code: "",
    };
    const validationSchema = Yup.object({
        code: Yup.string()
            .length(6, "Mã OTP phải có 6 chữ số")
            .required("Vui lòng nhập mã OTP"),
    });
    // Hàm build FormData từ tutorData
    const buildFormData = (_) => {
        const formData = new FormData();
        Object.entries(tutorData ?? {}).forEach(([key, value]) => {
            if (value === null || value === undefined)
                return;
            switch (key) {
                case "gender":
                    formData.append("Gender", value === "0" ? "0" : value === "1" ? "1" : "Other");
                    break;
                case "DateOfBirth":
                    formData.append("DateOfBirth", new Date(value).toISOString().split("T")[0]);
                    break;
                case "certificatesFiles":
                    value.forEach((file) => formData.append("CertificateFiles", file));
                    break;
                case "identityDocuments":
                    value.forEach((file) => formData.append("IdentityDocuments", file));
                    break;
                case "teachingSubjects":
                    value.forEach((subject) => formData.append("TeachingSubjects", subject));
                    break;
                default:
                    // Map key sang tên backend nếu cần
                    const apiKeyMap = {
                        username: "Username",
                        password: "Password",
                        email: "Email",
                        phoneNumber: "PhoneNumber",
                        address: "Address",
                        seftDescription: "SelfDescription",
                        educationLevel: "EducationLevel",
                        university: "University",
                        major: "Major",
                        teachingExperienceYears: "TeachingExperienceYears",
                        experienceDetails: "ExperienceDetails",
                        teachingLevel: "TeachingLevel",
                        specialSkills: "SpecialSkills",
                    };
                    formData.append(apiKeyMap[key] ?? key, value);
                    break;
            }
        });
        return formData;
    };
    const handleSubmit = async (values, helpers) => {
        helpers.setSubmitting(true);
        try {
            await dispatch(verifyOtpApiThunk(values)).unwrap();
            if (!tutorData) {
                toast.error("Không có dữ liệu đăng ký. Vui lòng đăng ký lại.");
                return;
            }
            const formData = buildFormData(tutorData);
            const res = await dispatch(registerTutorApiThunk(formData)).unwrap();
            toast.success(res?.message ?? "Đăng ký thành công");
            navigateHook(routes.login);
        }
        catch (error) {
            const message = error?.data?.message ?? error?.message ?? "Có lỗi xảy ra";
            toast.error(message);
        }
        finally {
            helpers.setSubmitting(false);
        }
    };
    return (_jsx("section", { id: "verify-otp-section", children: _jsxs("div", { className: "vos-container", children: [_jsx("div", { className: "voscc1" }), _jsxs("div", { className: "voscc2", children: [_jsx("h2", { children: "X\u00E1c th\u1EF1c m\u00E3 OTP" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ setFieldValue, isSubmitting }) => (_jsxs(Form, { children: [_jsx(OTPInput, { onChange: (code) => setFieldValue("code", code) }), _jsx(ErrorMessage, { name: "code", component: "div", className: "text-error" }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Xác thực") })] })) })] })] }) }));
};
export default VerifyOtpTutorPage;
