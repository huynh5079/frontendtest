import { useEffect, useRef, useState, type FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { get } from "lodash";
import { toast } from "react-toastify";

// UI Icons
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { GiMale } from "react-icons/gi";

// Components
import { DatePickerElement, LoadingSpinner, MultiSelect } from "../../elements";

// Helpers
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";

// Store
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileStudent } from "../../../app/selector";

// API Thunks
import {
    getProfileStudentApiThunk,
    updateAvatarApiThunk,
    updateProfileStudentApiThunk,
} from "../../../services/user/userThunk";

// Types
import type {
    ProfileStudent,
    UpdateStudentProfileParams,
} from "../../../types/user";
import { SystemLogo } from "../../../assets/images";

// -------------------- Constants --------------------
type LevelType = "Tiểu học" | "Trung học cơ sở" | "Trung học phổ thông";

const subjectsByLevel: Record<LevelType, string[]> = {
    "Tiểu học": ["Toán", "Tiếng Anh", "Tiếng Việt"],
    "Trung học cơ sở": [
        "Toán",
        "Tiếng Anh",
        "Ngữ Văn",
        "Vật Lý",
        "Hóa Học",
        "Sinh Học",
    ],
    "Trung học phổ thông": [
        "Toán",
        "Tiếng Anh",
        "Ngữ Văn",
        "Vật Lý",
        "Hóa Học",
        "Sinh Học",
    ],
};

// =====================================================
//                    COMPONENT
// =====================================================
const StudentProfile: FC = () => {
    const dispatch = useAppDispatch();
    const profile: ProfileStudent | null = useAppSelector(selectProfileStudent);

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        dispatch(getProfileStudentApiThunk());
    }, [dispatch]);

    useDocumentTitle("Trang cá nhân");

    // ================= Formik Initial Values =================
    const initialValues = {
        username: profile?.username || "",
        address: profile?.address || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        dateOfBirth: profile?.dateOfBirth || "",
        educationLevel: profile?.educationLevel || "",
        preferredSubjects: profile?.preferredSubjects
            ? profile.preferredSubjects.split(",")
            : [],
    };

    // ================= Yup Validation =================
    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        phone: Yup.string()
            .required("Vui lòng nhập số điện thoại")
            .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: Yup.date().required("Vui lòng chọn ngày sinh"),
        educationLevel: Yup.string().required("Vui lòng chọn cấp bậc học"),
        preferredSubjects: Yup.array()
            .min(1, "Vui lòng chọn ít nhất 1 môn học")
            .required(),
    });

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
                dispatch(getProfileStudentApiThunk());
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

    // =====================================================
    return (
        <div className="student-profile">
            {/* Avatar */}
            <div className="avatar-container">
                <img
                    src={profile?.avatarUrl || SystemLogo}
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

            {/* ================= Formik Form ================= */}
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const payload: UpdateStudentProfileParams = {
                        ...values,
                        dateOfBirth: formatDateReverse(values.dateOfBirth),
                        preferredSubjects: values.preferredSubjects.join(","),
                    };

                    setSubmitting(true);
                    dispatch(updateProfileStudentApiThunk(payload))
                        .unwrap()
                        .then((res) => {
                            toast.success(
                                get(res, "data.message", "Cập nhật thành công"),
                            );
                            dispatch(getProfileStudentApiThunk());
                        })
                        .catch((err) => {
                            toast.error(
                                get(err, "data.message", "Có lỗi xảy ra"),
                            );
                        })
                        .finally(() => setSubmitting(false));
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="form">
                        {/* ----------- Họ và tên ----------- */}
                        <div className="form-field">
                            <label className="form-label">Họ và tên</label>
                            <div className="form-input-container">
                                <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                <Field
                                    name="username"
                                    className="form-input"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <ErrorMessage
                                name="username"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        {/* ----------- Email ----------- */}
                        <div className="form-field">
                            <label className="form-label">Email</label>
                            <div className="form-input-container">
                                <CiMail className="form-input-icon" />
                                <input
                                    value={profile?.email || ""}
                                    className="form-input"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* ----------- Địa chỉ ----------- */}
                        <div className="form-field">
                            <label className="form-label">Địa chỉ</label>
                            <div className="form-input-container">
                                <FaMapMarkerAlt className="form-input-icon" />
                                <Field
                                    name="address"
                                    className="form-input"
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                            <ErrorMessage
                                name="address"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        {/* ----------- Phone ----------- */}
                        <div className="form-field">
                            <label className="form-label">Số điện thoại</label>
                            <div className="form-input-container">
                                <FaPhone className="form-input-icon" />
                                <Field
                                    name="phone"
                                    className="form-input"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <ErrorMessage
                                name="phone"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        {/* ----------- Ngày sinh ----------- */}
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

                        {/* ----------- Cấp bậc ----------- */}
                        <div className="form-field">
                            <label className="form-label">Cấp bậc học</label>
                            <div className="form-input-container">
                                <MdOutlineDriveFileRenameOutline className="form-input-icon" />

                                <Field
                                    as="select"
                                    name="educationLevel"
                                    className="form-input"
                                    onChange={(e: any) => {
                                        setFieldValue(
                                            "educationLevel",
                                            e.target.value,
                                        );
                                        setFieldValue("preferredSubjects", []);
                                    }}
                                >
                                    <option value="">-- Chọn cấp bậc --</option>
                                    <option value="Tiểu học">Tiểu học</option>
                                    <option value="Trung học cơ sở">
                                        Trung học cơ sở
                                    </option>
                                    <option value="Trung học phổ thông">
                                        Trung học phổ thông
                                    </option>
                                </Field>
                            </div>
                            <ErrorMessage
                                name="educationLevel"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        {/* ----------- Môn học ----------- */}
                        <MultiSelect
                            label="Môn học yêu thích"
                            placeholder="Chọn môn học"
                            options={
                                values.educationLevel
                                    ? subjectsByLevel[
                                          values.educationLevel as LevelType
                                      ].map((s) => ({
                                          label: s,
                                          value: s,
                                      }))
                                    : []
                            }
                            value={values.preferredSubjects.map((s) => ({
                                label: s,
                                value: s,
                            }))}
                            onChange={(selected: any) =>
                                setFieldValue(
                                    "preferredSubjects",
                                    selected.map((i: any) => i.value),
                                )
                            }
                        />
                        <ErrorMessage
                            name="preferredSubjects"
                            component="p"
                            className="form-error"
                        />

                        {/* ----------- Submit ----------- */}
                        <button
                            type="submit"
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Cập nhật"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default StudentProfile;
