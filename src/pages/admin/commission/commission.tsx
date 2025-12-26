import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectCommission, selectCommissionLoading } from "../../../app/selector";
import { getCommissionApiThunk, updateCommissionApiThunk } from "../../../services/admin/commission/adminCommissionThunk";
import { useDocumentTitle } from "../../../utils/helper";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/elements";
import { MdSettings, MdPercent, MdHistory } from "react-icons/md";
import { routes } from "../../../routes/routeName";

const validationSchema = Yup.object().shape({
    oneToOneOnline: Yup.number()
        .min(0, "Tỷ lệ phải >= 0")
        .max(1, "Tỷ lệ phải <= 1 (100%)")
        .required("Vui lòng nhập tỷ lệ"),
    oneToOneOffline: Yup.number()
        .min(0, "Tỷ lệ phải >= 0")
        .max(1, "Tỷ lệ phải <= 1 (100%)")
        .required("Vui lòng nhập tỷ lệ"),
    groupClassOnline: Yup.number()
        .min(0, "Tỷ lệ phải >= 0")
        .max(1, "Tỷ lệ phải <= 1 (100%)")
        .required("Vui lòng nhập tỷ lệ"),
    groupClassOffline: Yup.number()
        .min(0, "Tỷ lệ phải >= 0")
        .max(1, "Tỷ lệ phải <= 1 (100%)")
        .required("Vui lòng nhập tỷ lệ"),
});

const AdminCommissionPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const commission = useAppSelector(selectCommission);
    const loading = useAppSelector(selectCommissionLoading);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useDocumentTitle("Quản lý hoa hồng");

    useEffect(() => {
        dispatch(getCommissionApiThunk());
    }, [dispatch]);

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            await dispatch(
                updateCommissionApiThunk({
                    oneToOneOnline: values.oneToOneOnline,
                    oneToOneOffline: values.oneToOneOffline,
                    groupClassOnline: values.groupClassOnline,
                    groupClassOffline: values.groupClassOffline,
                })
            ).unwrap();
            toast.success("Cập nhật tỷ lệ hoa hồng thành công");
        } catch (error: any) {
            toast.error(error?.data?.message || "Có lỗi xảy ra khi cập nhật");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPercent = (value: number) => {
        return (value * 100).toFixed(2) + "%";
    };

    if (loading && !commission) {
        return (
            <section id="admin-commission-section">
                <div className="ac-container">
                    <div className="loading-container">
                        <LoadingSpinner />
                        <p>Đang tải...</p>
                    </div>
                </div>
            </section>
        );
    }

    const initialValues = {
        oneToOneOnline: commission?.oneToOneOnline ?? 0.12,
        oneToOneOffline: commission?.oneToOneOffline ?? 0.15,
        groupClassOnline: commission?.groupClassOnline ?? 0.10,
        groupClassOffline: commission?.groupClassOffline ?? 0.12,
    };

    return (
        <section id="admin-commission-section">
            <div className="ac-container">
                <div className="ac-header">
                    <div className="ac-header-icon">
                        <MdSettings />
                    </div>
                    <div className="ac-header-content">
                        <h4>Quản lý hoa hồng</h4>
                        <p>Trang tổng quát <span>Hoa hồng</span></p>
                    </div>
                    <button
                        className="pr-btn"
                        onClick={() => navigate(routes.admin.commissionHistory)}
                        style={{ marginLeft: "auto" }}
                    >
                        <MdHistory style={{ marginRight: "0.5rem" }} />
                        Xem lịch sử
                    </button>
                </div>

                <div className="ac-content">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, errors, touched, handleChange, handleBlur }) => (
                            <Form className="ac-form">
                                <div className="ac-form-section">
                                    <h5 className="ac-form-section-title">
                                        <MdPercent className="ac-form-section-icon" />
                                        Tỷ lệ hoa hồng
                                    </h5>
                                    <p className="ac-form-section-description">
                                        Cập nhật tỷ lệ hoa hồng cho các loại lớp học. Tỷ lệ được tính theo phần trăm (0.12 = 12%).
                                    </p>

                                    <div className="ac-form-grid">
                                        <div className="ac-form-field">
                                            <label className="ac-form-label">
                                                1-1 Online (%)
                                            </label>
                                            <div className="ac-form-input-wrapper">
                                                <input
                                                    type="number"
                                                    name="oneToOneOnline"
                                                    className={`ac-form-input ${errors.oneToOneOnline && touched.oneToOneOnline ? "error" : ""}`}
                                                    value={values.oneToOneOnline}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    step="0.01"
                                                    min="0"
                                                    max="1"
                                                    placeholder="0.12"
                                                />
                                                <span className="ac-form-percent">
                                                    {formatPercent(values.oneToOneOnline)}
                                                </span>
                                            </div>
                                            {errors.oneToOneOnline && touched.oneToOneOnline && (
                                                <span className="ac-form-error">
                                                    {String(errors.oneToOneOnline)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="ac-form-field">
                                            <label className="ac-form-label">
                                                1-1 Offline (%)
                                            </label>
                                            <div className="ac-form-input-wrapper">
                                                <input
                                                    type="number"
                                                    name="oneToOneOffline"
                                                    className={`ac-form-input ${errors.oneToOneOffline && touched.oneToOneOffline ? "error" : ""}`}
                                                    value={values.oneToOneOffline}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    step="0.01"
                                                    min="0"
                                                    max="1"
                                                    placeholder="0.15"
                                                />
                                                <span className="ac-form-percent">
                                                    {formatPercent(values.oneToOneOffline)}
                                                </span>
                                            </div>
                                            {errors.oneToOneOffline && touched.oneToOneOffline && (
                                                <span className="ac-form-error">
                                                    {String(errors.oneToOneOffline)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="ac-form-field">
                                            <label className="ac-form-label">
                                                Nhóm Online (%)
                                            </label>
                                            <div className="ac-form-input-wrapper">
                                                <input
                                                    type="number"
                                                    name="groupClassOnline"
                                                    className={`ac-form-input ${errors.groupClassOnline && touched.groupClassOnline ? "error" : ""}`}
                                                    value={values.groupClassOnline}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    step="0.01"
                                                    min="0"
                                                    max="1"
                                                    placeholder="0.10"
                                                />
                                                <span className="ac-form-percent">
                                                    {formatPercent(values.groupClassOnline)}
                                                </span>
                                            </div>
                                            {errors.groupClassOnline && touched.groupClassOnline && (
                                                <span className="ac-form-error">
                                                    {String(errors.groupClassOnline)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="ac-form-field">
                                            <label className="ac-form-label">
                                                Nhóm Offline (%)
                                            </label>
                                            <div className="ac-form-input-wrapper">
                                                <input
                                                    type="number"
                                                    name="groupClassOffline"
                                                    className={`ac-form-input ${errors.groupClassOffline && touched.groupClassOffline ? "error" : ""}`}
                                                    value={values.groupClassOffline}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    step="0.01"
                                                    min="0"
                                                    max="1"
                                                    placeholder="0.12"
                                                />
                                                <span className="ac-form-percent">
                                                    {formatPercent(values.groupClassOffline)}
                                                </span>
                                            </div>
                                            {errors.groupClassOffline && touched.groupClassOffline && (
                                                <span className="ac-form-error">
                                                    {String(errors.groupClassOffline)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="ac-form-actions">
                                    <button
                                        type="submit"
                                        className={`ac-form-submit ${isSubmitting ? "disabled" : ""}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner />
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            "Cập nhật tỷ lệ hoa hồng"
                                        )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default AdminCommissionPage;

