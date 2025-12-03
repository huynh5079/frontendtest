import type { FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import type { ChangePassword } from "../../../types/auth";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useAppDispatch } from "../../../app/store";
import { changePasswordApiThunk } from "../../../services/auth/authThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/elements";
import { FaLock } from "react-icons/fa";
import { useDocumentTitle } from "../../../utils/helper";

const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: Yup.string()
        .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
        .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu nhập lại không khớp")
        .required("Vui lòng xác nhận mật khẩu mới"),
});

const TutorChangePasswordPage: FC = () => {
    const dispatch = useAppDispatch();

    const initialValues: ChangePassword = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const handleSubmit = async (
        values: ChangePassword,
        helpers: FormikHelpers<ChangePassword>,
    ) => {
        await dispatch(changePasswordApiThunk(values))
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Đổi mật khẩu thành công");
                toast.success(message);
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
                helpers.resetForm();
            });
    };

    useDocumentTitle("Đổi mật khẩu")

    return (
        <section id="tutor-change-password-section">
            <div className="tcps-container">
                <div className="tcpscr1">
                    <h4>Trang cá nhân</h4>
                    <p>
                        Trang tổng quát <span>Trang cá nhân</span>
                    </p>
                </div>
                <div className="tcpscr2">
                    <div
                        className="pr-btn"
                        onClick={() => {
                            navigateHook(routes.tutor.information);
                        }}
                    >
                        Quay lại
                    </div>
                </div>
                <div className="tcpscr3">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={ChangePasswordSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="form">
                                {/* Old password */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Mật khẩu cũ
                                    </label>
                                    <div className="form-input-container">
                                        <FaLock className="form-input-icon" />
                                        <Field
                                            type="password"
                                            name="oldPassword"
                                            className="form-input"
                                            placeholder="Nhập mật khẩu cũ của bạn"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="oldPassword"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* New password */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Mật khẩu mới
                                    </label>
                                    <div className="form-input-container">
                                        <FaLock className="form-input-icon" />
                                        <Field
                                            type="password"
                                            name="newPassword"
                                            className="form-input"
                                            placeholder="Nhập mật khẩu mới của bạn"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="newPassword"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Confirm password */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Nhập lại mật khẩu mới
                                    </label>
                                    <div className="form-input-container">
                                        <FaLock className="form-input-icon" />
                                        <Field
                                            type="password"
                                            name="confirmPassword"
                                            className="form-input"
                                            placeholder="Nhập lại mật khẩu mới của bạn"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={
                                        isSubmitting ? "disable-btn" : "pr-btn"
                                    }
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Đổi mật khẩu"
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

export default TutorChangePasswordPage;
