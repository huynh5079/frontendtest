import { type FC } from "react";
import { FaLock } from "react-icons/fa";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get } from "lodash";

import { useAppDispatch } from "../../../app/store";
import { changePasswordApiThunk } from "../../../services/auth/authThunk";
import { LoadingSpinner } from "../../elements";
import { useDocumentTitle } from "../../../utils/helper";
import type { ChangePassword } from "../../../types/auth";

/* ================================
   Main Component
================================ */
const StudentChangePassword: FC = () => {
    const dispatch = useAppDispatch();
    useDocumentTitle("Đổi mật khẩu");

    /* ================================
        Formik Initial Values
    ================================ */
    const initialValues: ChangePassword = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    /* ================================
        Yup Validation Schema
    ================================ */
    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
        newPassword: Yup.string()
            .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
            .required("Vui lòng nhập mật khẩu mới"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Mật khẩu nhập lại không khớp")
            .required("Vui lòng xác nhận mật khẩu mới"),
    });

    /* ================================
       Submit Handler
    ================================= */
    const handleSubmit = async (
        values: ChangePassword,
        helpers: FormikHelpers<ChangePassword>,
    ) => {
        helpers.setSubmitting(true);
        await dispatch(changePasswordApiThunk(values))
            .unwrap()
            .then((res) => {
                toast.success(get(res, "message", "Đổi mật khẩu thành công"));
            })
            .catch((error) => {
                toast.error(get(error, "message", "Có lỗi xảy ra"));
            })
            .finally(() => {
                helpers.setSubmitting(false);
                helpers.resetForm();
            });
    };

    /* ================================
       JSX
    ================================= */
    return (
        <div className="student-change-password">
            <Formik
                initialValues={initialValues}
                validationSchema={ChangePasswordSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="form">
                        {/* Old password */}
                        <PasswordField
                            name="oldPassword"
                            label="Mật khẩu cũ"
                            placeholder="Nhập mật khẩu cũ của bạn"
                        />

                        {/* New password */}
                        <PasswordField
                            name="newPassword"
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới của bạn"
                        />

                        {/* Confirm password */}
                        <PasswordField
                            name="confirmPassword"
                            label="Nhập lại mật khẩu mới"
                            placeholder="Nhập lại mật khẩu mới của bạn"
                        />

                        <button
                            type="submit"
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Đổi mật khẩu"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default StudentChangePassword;

/* ================================
   Reusable Password Field Component
================================ */
const PasswordField: FC<{
    name: string;
    label: string;
    placeholder: string;
}> = ({ name, label, placeholder }) => (
    <div className="form-field">
        <label className="form-label">{label}</label>

        <div className="form-input-container">
            <FaLock className="form-input-icon" />
            <Field
                type="password"
                name={name}
                className="form-input"
                placeholder={placeholder}
            />
        </div>

        <ErrorMessage name={name} component="div" className="text-error" />
    </div>
);
