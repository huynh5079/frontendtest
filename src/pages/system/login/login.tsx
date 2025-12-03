import { useEffect, type FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import type { LoginEmail } from "../../../types/auth";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
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
const initialValues: LoginEmail = {
    email: "",
    password: "",
};

const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userRole = useAppSelector(selectUserLogin)?.role;

    // Map role -> route
    const roleRoutes: Record<string, string> = {
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
            if (redirectPath) navigateHook(redirectPath);
        }
    }, [isAuthenticated, userRole]);

    // === HANDLERS ===
    const handleLogin = async (
        values: LoginEmail,
        helpers: FormikHelpers<LoginEmail>,
    ) => {
        try {
            const res = await dispatch(loginApiThunk(values)).unwrap();
            const message = get(res, "data.message", "Đăng nhập thành công");
            toast.success(message);
        } catch (error) {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleLogin}
            validationSchema={loginSchema}
        >
            {({ handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit} className="form">
                    <section id="login-section">
                        <div className="ls-container">
                            <div className="lscc1"></div>

                            <div className="lscc2">
                                <h2>Đăng nhập vào hệ thống</h2>

                                <div className="form">
                                    {/* EMAIL */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <div className="form-input-container">
                                            <CiMail className="form-input-icon" />
                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                placeholder="Nhập email của bạn"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="form-field">
                                        <label className="form-label">
                                            Mật khẩu
                                        </label>
                                        <div className="form-input-container">
                                            <RiLockPasswordLine className="form-input-icon" />
                                            <Field
                                                type="password"
                                                name="password"
                                                className="form-input"
                                                placeholder="Nhập mật khẩu của bạn"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-error"
                                        />
                                    </div>

                                    {/* FORGOT PASSWORD */}
                                    <p
                                        className="forgot-password"
                                        onClick={() =>
                                            navigateHook(routes.forgot_password)
                                        }
                                    >
                                        Quên mật khẩu
                                    </p>

                                    {/* LOGIN BUTTON */}
                                    <button
                                        className={
                                            isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn"
                                        }
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <LoadingSpinner />
                                        ) : (
                                            "Đăng nhập"
                                        )}
                                    </button>
                                </div>

                                {/* REGISTER */}
                                <p className="no-account">
                                    Bạn chưa có tài khoản?
                                </p>
                                <div className="reg-now-container">
                                    <div className="line-left"></div>
                                    <p
                                        className="reg-now-text"
                                        onClick={() =>
                                            navigateHook(
                                                routes.register.general,
                                            )
                                        }
                                    >
                                        Đăng ký ngay
                                    </p>
                                    <div className="line-right"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
};

export default LoginPage;
