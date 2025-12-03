import { type FC } from "react";
import { Formik, Form, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { LoadingSpinner, OTPInput } from "../../../components/elements";
import { useAppDispatch } from "../../../app/store";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import type { VerifyOtp } from "../../../types/auth";
import { useLocation } from "react-router-dom";
import {
    registerParentApiThunk,
    verifyOtpApiThunk,
} from "../../../services/auth/authThunk";
import { toast } from "react-toastify";
import { useDocumentTitle } from "../../../utils/helper";

const VerifyOtpParentPage: FC = () => {
    const dispatch = useAppDispatch();
    const { state } = useLocation();

    const initialValues: VerifyOtp = {
        email: state?.email || "",
        code: "",
    };

    const validationSchema = Yup.object({
        code: Yup.string()
            .length(6, "Mã OTP phải có 6 chữ số")
            .required("Vui lòng nhập mã OTP"),
    });

    const handleSubmit = async (
        values: VerifyOtp,
        helpers: FormikHelpers<VerifyOtp>,
    ) => {
        helpers.setSubmitting(true);
        try {
            await dispatch(verifyOtpApiThunk(values)).unwrap();
            const res = await dispatch(registerParentApiThunk(state)).unwrap();
            toast.success(res?.message ?? "Đăng ký thành công");
            navigateHook(routes.login);
        } catch (error: any) {
            // ưu tiên lỗi từ server
            const message =
                error?.data?.message ?? error?.message ?? "Có lỗi xảy ra";
            toast.error(message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    useDocumentTitle("Xác thực mã OTP");

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

export default VerifyOtpParentPage;
