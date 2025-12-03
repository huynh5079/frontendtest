import { useEffect, type FC } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import type { RegisterParent } from "../../../types/auth";
import { useAppDispatch } from "../../../app/store";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { verifyEmailApiThunk } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";

// === VALIDATION SCHEMA & INITIAL VALUES ===
const initialValues: RegisterParent = {
    username: "",
    email: "",
    password: "",
};

const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập họ và tên"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(8, "Mật khẩu tối thiểu 8 ký tự").required("Vui lòng nhập mật khẩu"),
});

const RegisterParentPage: FC = () => {
    const dispatch = useAppDispatch();

    const handleSubmit = async (
        values: RegisterParent,
        helpers: FormikHelpers<RegisterParent>
    ) => {
        try {
            await dispatch(verifyEmailApiThunk({ email: values.email })).unwrap();
            navigateHook(routes.verify_otp.parent, { state: values });
        } catch (error) {
            const errorMessage = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorMessage);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký trở thành phụ huynh";
    }, []);

    return (
        <section id="register-parent-section">
            <div className="rps-container">
                <div className="rpscc1"></div>
                <div className="rpscc2">
                    <h2>Đăng ký tài khoản phụ huynh</h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="form">
                                {[
                                    { name: "username", label: "Họ và tên", type: "text", icon: MdOutlineDriveFileRenameOutline, placeholder: "Nhập họ và tên của bạn" },
                                    { name: "email", label: "Email", type: "email", icon: CiMail, placeholder: "Nhập email của bạn" },
                                    { name: "password", label: "Mật khẩu", type: "password", icon: RiLockPasswordLine, placeholder: "Nhập mật khẩu của bạn" },
                                ].map((field) => {
                                    const Icon = field.icon;
                                    return (
                                        <div key={field.name} className="form-field">
                                            <label className="form-label">{field.label}</label>
                                            <div className="form-input-container">
                                                <Icon className="form-input-icon" />
                                                <Field
                                                    name={field.name}
                                                    type={field.type}
                                                    className="form-input"
                                                    placeholder={field.placeholder}
                                                />
                                            </div>
                                            <ErrorMessage
                                                name={field.name}
                                                component="p"
                                                className="text-error"
                                            />
                                        </div>
                                    );
                                })}

                                <p className="forgot-password">Quên mật khẩu</p>

                                <button
                                    type="submit"
                                    className={isSubmitting ? "disable-btn" : "pr-btn"}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <LoadingSpinner /> : "Đăng ký"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <p className="no-account">Bạn đã có tài khoản?</p>
                    <div className="reg-now-container">
                        <div className="line-left"></div>
                        <p className="reg-now-text" onClick={() => navigateHook(routes.login)}>
                            Đăng nhập ngay
                        </p>
                        <div className="line-right"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegisterParentPage;
