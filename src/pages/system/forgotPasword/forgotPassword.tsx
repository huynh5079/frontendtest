import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { ForgotPassword } from "../../../types/auth";
import type { FC } from "react";
import { useAppDispatch } from "../../../app/store";
import { verifyEmailForgotPasswordApiThunk } from "../../../services/auth/authThunk";
import { get } from "lodash";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/elements";
import { useDocumentTitle } from "../../../utils/helper";

// === Component con cho input ===
interface FormFieldProps {
    name: keyof ForgotPassword;
    label: string;
    placeholder: string;
    type?: string;
    Icon: FC<any>;
}

const FormField: FC<FormFieldProps> = ({
    name,
    label,
    placeholder,
    type = "text",
    Icon,
}) => (
    <div className="form-field">
        <label className="form-label">{label}</label>
        <div className="form-input-container">
            <Icon className="form-input-icon" />
            <Field
                type={type}
                name={name}
                className="form-input"
                placeholder={placeholder}
            />
        </div>
        <ErrorMessage name={name} component="div" className="text-error" />
    </div>
);

const ForgotPasswordPage: FC = () => {
    const dispatch = useAppDispatch();

    const initialValues: ForgotPassword = {
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

    const handleSubmit = async (
        values: ForgotPassword,
        helpers: FormikHelpers<ForgotPassword>,
    ) => {
        try {
            await dispatch(
                verifyEmailForgotPasswordApiThunk({ email: values.email }),
            ).unwrap();
            navigateHook(routes.verify_otp.forgot_password, { state: values });
        } catch (error) {
            const message = get(error, "message", "Có lỗi xảy ra");
            toast.error(message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    useDocumentTitle("Quên mật khẩu");

    return (
        <section id="forgot-password-section">
            <div className="fps-container">
                <div className="fpscc1" />
                <div className="fpscc2">
                    <h2>Quên mật khẩu</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="form">
                                <FormField
                                    name="email"
                                    label="Email"
                                    placeholder="Nhập email của bạn"
                                    Icon={CiMail}
                                />
                                <FormField
                                    name="newPassword"
                                    label="Mật khẩu mới"
                                    placeholder="Nhập mật khẩu mới của bạn"
                                    type="password"
                                    Icon={RiLockPasswordLine}
                                />
                                <FormField
                                    name="confirmPassword"
                                    label="Nhập lại mật khẩu"
                                    placeholder="Nhập lại mật khẩu mới của bạn"
                                    type="password"
                                    Icon={RiLockPasswordLine}
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
                                        "Xác nhận"
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

export default ForgotPasswordPage;
