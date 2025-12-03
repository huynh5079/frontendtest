import { useEffect, type FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { DatePickerElement, LoadingSpinner } from "../../elements";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileParent } from "../../../app/selector";
import { getProfileParentApiThunk } from "../../../services/user/userThunk";
import type { UpdateParentParams } from "../../../types/parent";
import { useDocumentTitle } from "../../../utils/helper";

const ParentProfile: FC = () => {
    const dispatch = useAppDispatch();
    const parentProfile = useAppSelector(selectProfileParent);

    useEffect(() => {
        dispatch(getProfileParentApiThunk());
    }, [dispatch]);

    const today = new Date();
    const maxDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
    );

    // ✅ Schema kiểm tra dữ liệu
    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
            .required("Vui lòng nhập số điện thoại"),
        dateOfBirth: Yup.date()
            .max(maxDate, "Bạn cần đủ 16 tuổi trở lên")
            .required("Vui lòng chọn ngày sinh"),
    });

    // ✅ Giá trị mặc định (lấy từ store nếu có)
    const initialValues: UpdateParentParams = {
        username: parentProfile?.username || "",
        avatarUrl: parentProfile?.avatarUrl || "",
        email: parentProfile?.email || "",
        phone: parentProfile?.phone || "",
        address: parentProfile?.address || "",
        gender: parentProfile?.gender || "male",
        dateOfBirth: parentProfile?.dateOfBirth || "",
    };

    const handleSubmit = async (values: UpdateParentParams) => {
        console.log(values)
    };

    useDocumentTitle("Trang cá nhân")

    return (
        <div className="parent-profile">
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form>
                        <div className="avatar-container">
                            <h5>Ảnh đại diện</h5>
                            <img
                                className="avatar"
                                src={values.avatarUrl || ""}
                            />
                            <div className="group-btn">
                                <div className="pr-btn">Tải ảnh lên</div>
                            </div>
                        </div>
                        <div className="form">
                            {/* Họ và tên */}
                            <div className="form-field">
                                <label className="form-label">Họ và tên</label>
                                <div className="form-input-container">
                                    <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                    <Field
                                        name="username"
                                        type="text"
                                        className="form-input"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Email */}
                            <div className="form-field">
                                <label className="form-label">Email</label>
                                <div className="form-input-container">
                                    <CiMail className="form-input-icon" />
                                    <Field
                                        name="email"
                                        type="email"
                                        disabled
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

                            {/* Địa chỉ */}
                            <div className="form-field">
                                <label className="form-label">Địa chỉ</label>
                                <div className="form-input-container">
                                    <FaMapMarkerAlt className="form-input-icon" />
                                    <Field
                                        name="address"
                                        type="text"
                                        className="form-input"
                                        placeholder="Nhập địa chỉ của bạn"
                                    />
                                </div>
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="form-field">
                                <label className="form-label">
                                    Số điện thoại
                                </label>
                                <div className="form-input-container">
                                    <FaPhone className="form-input-icon" />
                                    <Field
                                        name="phone"
                                        type="text"
                                        className="form-input"
                                        placeholder="Nhập số điện thoại của bạn"
                                    />
                                </div>
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Ngày sinh */}
                            <div className="form-field">
                                <label className="form-label">Ngày sinh</label>
                                <div className="form-input-container">
                                    <CiCalendarDate className="form-input-icon" />
                                    <DatePickerElement
                                        value={
                                            values.dateOfBirth
                                                ? new Date(values.dateOfBirth)
                                                : null
                                        }
                                        onChange={(date) =>
                                            setFieldValue(
                                                "dateOfBirth",
                                                date?.toISOString() || ""
                                            )
                                        }
                                        maxDate={maxDate}
                                    />
                                </div>
                                <ErrorMessage
                                    name="dateOfBirth"
                                    component="div"
                                    className="text-error"
                                />
                                <p className="form-note">
                                    <span>Lưu ý:</span> Học viên cần đủ từ 16
                                    tuổi trở lên
                                </p>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Ngày sinh</label>
                                <div className="form-input-container">
                                    <CiCalendarDate className="form-input-icon" />
                                    <DatePickerElement
                                        value={
                                            values.dateOfBirth
                                                ? new Date(values.dateOfBirth)
                                                : null
                                        }
                                        onChange={(date) =>
                                            setFieldValue("dateOfBirth", date)
                                        }
                                    />
                                </div>
                                <ErrorMessage
                                    name="dateOfBirth"
                                    component="p"
                                    className="text-error"
                                />
                            </div>
                        </div>

                        <div className="group-btn">
                            <div className="sc-btn">Làm mới</div>
                            <button
                                type="submit"
                                className="pr-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <LoadingSpinner /> : "Cập nhật"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ParentProfile;
