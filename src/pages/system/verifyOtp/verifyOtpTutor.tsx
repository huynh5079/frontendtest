import { type FC } from "react";
import { Formik, Form, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { LoadingSpinner, OTPInput } from "../../../components/elements";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import type { VerifyOtp } from "../../../types/auth";
import {
    registerTutorApiThunk,
    verifyOtpApiThunk,
} from "../../../services/auth/authThunk";
import { toast } from "react-toastify";

const VerifyOtpTutorPage: FC = () => {
    const dispatch = useAppDispatch();
    const tutorData = useAppSelector((state) => state.registerTutor.formData);

    const initialValues: VerifyOtp = {
        email: tutorData?.email || "",
        code: "",
    };

    const validationSchema = Yup.object({
        code: Yup.string()
            .length(6, "Mã OTP phải có 6 chữ số")
            .required("Vui lòng nhập mã OTP"),
    });

    // Hàm build FormData từ tutorData
    const buildFormData = (_: typeof tutorData) => {
        const formData = new FormData();
        Object.entries(tutorData ?? {}).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            switch (key) {
                case "gender":
                    formData.append(
                        "Gender",
                        value === "0" ? "0" : value === "1" ? "1" : "Other",
                    );
                    break;
                case "DateOfBirth":
                    formData.append(
                        "DateOfBirth",
                        new Date(value as string).toISOString().split("T")[0],
                    );
                    break;
                case "certificatesFiles":
                    (value as File[]).forEach((file) =>
                        formData.append("CertificateFiles", file),
                    );
                    break;
                case "identityDocuments":
                    (value as File[]).forEach((file) =>
                        formData.append("IdentityDocuments", file),
                    );
                    break;
                case "teachingSubjects":
                    (value as string[]).forEach((subject) =>
                        formData.append("TeachingSubjects", subject),
                    );
                    break;
                case "acceptPolicy":
                    formData.append("AcceptPolicy", value ? "true" : "false");
                    break;
                default:
                    // Map key sang tên backend nếu cần
                    const apiKeyMap: Record<string, string> = {
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
                        acceptPolicy: "AcceptPolicy",
                    };
                    formData.append(apiKeyMap[key] ?? key, value as any);
                    break;
            }
        });
        return formData;
    };

    const handleSubmit = async (
        values: VerifyOtp,
        helpers: FormikHelpers<VerifyOtp>,
    ) => {
        helpers.setSubmitting(true);
        try {
            await dispatch(verifyOtpApiThunk(values)).unwrap();

            if (!tutorData) {
                toast.error("Không có dữ liệu đăng ký. Vui lòng đăng ký lại.");
                return;
            }

            const formData = buildFormData(tutorData);
            const res = await dispatch(
                registerTutorApiThunk(formData),
            ).unwrap();

            toast.success(res?.message ?? "Đăng ký thành công");
            navigateHook(routes.login);
        } catch (error: any) {
            const message =
                error?.data?.message ?? error?.message ?? "Có lỗi xảy ra";
            toast.error(message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <section id="verify-otp-section">
            <div className="vos-container">
                <div className="voscc1" />
                <div className="voscc2">
                    <h2>Xác thực mã OTP</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, isSubmitting }) => (
                            <Form>
                                <OTPInput
                                    onChange={(code) =>
                                        setFieldValue("code", code)
                                    }
                                />
                                <ErrorMessage
                                    name="code"
                                    component="div"
                                    className="text-error"
                                />
                                <button
                                    type="submit"
                                    className={
                                        isSubmitting ? "disable-btn" : "pr-btn"
                                    }
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Xác thực"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default VerifyOtpTutorPage;
