import { useEffect, type FC } from "react";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import {
    DatePickerElement,
    LoadingSpinner,
} from "../../../components/elements";
import type { RegisterStudent } from "../../../types/auth";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../app/store";
import { verifyEmailApiThunk } from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";

// === MAX DATE & INITIAL VALUES & VALIDATION SCHEMA ===
const today = new Date();
const maxDate = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate(),
);

const initialValues: RegisterStudent = {
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

const RegisterStudentPage: FC = () => {
    const dispatch = useAppDispatch();

    const handleSubmit = async (
        values: RegisterStudent,
        helpers: FormikHelpers<RegisterStudent>,
    ) => {
        const formatted = {
            ...values,
            birthday: values.birthday
                ? values.birthday.toLocaleDateString("en-CA")
                : "",
        };

        try {
            await dispatch(
                verifyEmailApiThunk({ email: formatted.email }),
            ).unwrap();
            navigateHook(routes.verify_otp.student, { state: formatted });
        } catch (error) {
            const errorMessage = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorMessage);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký trở thành học viên";
    }, []);

    return (
        <section id="register-student-section">
            <div className="rss-container">
                <div className="rsscc1">
                    <h2>Đăng ký tài khoản học viên</h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, values, isSubmitting }) => (
                            <Form className="form">
                                {fields.map((field) => {
                                    const Icon = field.icon;
                                    return (
                                        <div
                                            key={field.name}
                                            className="form-field"
                                        >
                                            <label className="form-label">
                                                {field.label}
                                            </label>
                                            <div className="form-input-container">
                                                <Icon className="form-input-icon" />
                                                <Field
                                                    name={field.name}
                                                    type={field.type}
                                                    className="form-input"
                                                    placeholder={
                                                        field.placeholder
                                                    }
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

                                {/* Ngày sinh */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Ngày sinh
                                    </label>
                                    <div className="form-input-container">
                                        <CiCalendarDate className="form-input-icon" />
                                        <DatePickerElement
                                            value={values.birthday}
                                            onChange={(date) =>
                                                setFieldValue("birthday", date)
                                            }
                                            maxDate={maxDate}
                                        />
                                    </div>
                                    <p className="form-note">
                                        <span>Lưu ý:</span> Học viên cần đủ từ
                                        16 tuổi trở lên
                                    </p>
                                    <ErrorMessage
                                        name="birthday"
                                        component="p"
                                        className="text-error"
                                    />
                                </div>

                                <p className="forgot-password">Quên mật khẩu</p>

                                <button
                                    type="submit"
                                    className={
                                        isSubmitting ? "disable-btn" : "pr-btn"
                                    }
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Đăng ký"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <p className="no-account">Bạn đã có tài khoản?</p>
                    <div className="reg-now-container">
                        <div className="line-left"></div>
                        <p
                            className="reg-now-text"
                            onClick={() => navigateHook(routes.login)}
                        >
                            Đăng nhập ngay
                        </p>
                        <div className="line-right"></div>
                    </div>
                </div>
                <div className="rsscc2"></div>
            </div>
        </section>
    );
};

export default RegisterStudentPage;
