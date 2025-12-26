import { useEffect, useRef, useState, type FC } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { DatePickerElement, LoadingSpinner } from "../../elements";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileParent } from "../../../app/selector";
import {
    getProfileParentApiThunk,
    updateAvatarApiThunk,
    updateProfileParentApiThunk,
} from "../../../services/user/userThunk";
import type { UpdateParentParams } from "../../../types/parent";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import { SystemLogo } from "../../../assets/images";
import { toast } from "react-toastify";
import { get } from "lodash";
import { UpdateParentProfileParams } from "../../../types/user";
import { GiMale } from "react-icons/gi";

const ParentProfile: FC = () => {
    const dispatch = useAppDispatch();
    const parentProfile = useAppSelector(selectProfileParent);

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        dispatch(getProfileParentApiThunk());
    }, [dispatch]);

    const today = new Date();
    const maxDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate(),
    );

    // ✅ Schema kiểm tra dữ liệu
    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        phone: Yup.string()
            .required("Vui lòng nhập số điện thoại")
            .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: Yup.date().required("Vui lòng chọn ngày sinh"),
    });

    // ✅ Giá trị mặc định (lấy từ store nếu có)
    const initialValues: UpdateParentProfileParams = {
        username: parentProfile?.username || "",
        phone: parentProfile?.phone || "",
        address: parentProfile?.address || "",
        gender: parentProfile?.gender || "male",
        dateOfBirth: parentProfile?.dateOfBirth || "",
    };

    const handleSubmit = async (
        values: UpdateParentProfileParams,
        helpers: FormikHelpers<UpdateParentProfileParams>,
    ) => {
        const payload: UpdateParentProfileParams = {
            ...values,
            dateOfBirth: formatDateReverse(values.dateOfBirth),
        };

        helpers.setSubmitting(true);
        dispatch(updateProfileParentApiThunk(payload))
            .unwrap()
            .then((res) => {
                toast.success(get(res, "data.message", "Cập nhật thành công"));
                dispatch(getProfileParentApiThunk());
            })
            .catch((err) => {
                toast.error(get(err, "data.message", "Có lỗi xảy ra"));
            })
            .finally(() => helpers.setSubmitting(false));
    };

    useDocumentTitle("Trang cá nhân");

    const handleUpdateAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setIsUploadingAvatar(true);

        dispatch(updateAvatarApiThunk(formData))
            .unwrap()
            .then(() => {
                toast.success("Cập nhật ảnh đại diện thành công");
                dispatch(getProfileParentApiThunk());
            })
            .catch((err) => {
                toast.error(
                    get(err, "data.message", "Cập nhật ảnh đại diện thất bại"),
                );
            })
            .finally(() => {
                setIsUploadingAvatar(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            });
    };

    return (
        <div className="parent-profile">
            <div className="avatar-container">
                <img
                    src={parentProfile?.avatarUrl || SystemLogo}
                    className="avatar"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = SystemLogo;
                    }}
                />

                {/* Input ẩn */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleUpdateAvatar}
                />

                {/* Button thay thế */}
                <button
                    type="button"
                    className={isUploadingAvatar ? "disable-btn" : "pr-btn"}
                    disabled={isUploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploadingAvatar ? (
                        <LoadingSpinner />
                    ) : (
                        "Thay đổi ảnh đại diện"
                    )}
                </button>
            </div>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form>
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
                                                date?.toISOString() || "",
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
                            </div>

                            {/* ----------- Giới tính ----------- */}
                            <div className="form-field">
                                <label className="form-label">Giới tính</label>
                                <div className="form-input-container">
                                    <GiMale className="form-input-icon" />
                                    <Field
                                        as="select"
                                        name="gender"
                                        className="form-input"
                                    >
                                        <option value="">
                                            -- Chọn giới tính --
                                        </option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </Field>
                                </div>
                                <ErrorMessage
                                    name="gender"
                                    component="p"
                                    className="text-error"
                                />
                            </div>
                        </div>

                        <div className="group-btn">
                            <div className="sc-btn">Làm mới</div>
                            <button
                                type="submit"
                                className={isSubmitting ? "disable-btn" : "pr-btn"}
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
