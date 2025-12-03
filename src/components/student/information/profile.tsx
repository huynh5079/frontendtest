import { useEffect, type FC } from "react";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { DatePickerElement, LoadingSpinner, MultiSelect } from "../../elements";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileStudent } from "../../../app/selector";
import {
    getProfileStudentApiThunk,
    updateProfileStudentApiThunk,
} from "../../../services/user/userThunk";
import type {
    ProfileStudent,
    UpdateStudentProfileParams,
} from "../../../types/user";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GiMale } from "react-icons/gi";
import { get } from "lodash";
import { toast } from "react-toastify";

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

const StudentProfile: FC = () => {
    const dispatch = useAppDispatch();
    const profile: ProfileStudent | null = useAppSelector(selectProfileStudent);

    useEffect(() => {
        dispatch(getProfileStudentApiThunk());
    }, [dispatch]);

    const today = new Date();
    const maxDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate(),
    );

    useDocumentTitle("Trang cá nhân");

    // ★ Formik initial values
    const initialValues = {
        username: profile?.username || "",
        address: profile?.address || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        dateOfBirth: profile?.dateOfBirth || "",
        educationLevelId: profile?.educationLevel || "",
        preferredSubjects: profile?.preferredSubjects
            ? profile.preferredSubjects.split(",") // API → array
            : [],
    };

    // ★ Yup validation
    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        phone: Yup.string()
            .required("Vui lòng nhập số điện thoại")
            .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
        dateOfBirth: Yup.date()
            .max(maxDate, "Học viên phải từ 16 tuổi trở lên")
            .required("Vui lòng chọn ngày sinh"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        educationLevelId: Yup.string().required("Vui lòng chọn cấp bậc học"),
        preferredSubjects: Yup.array()
            .min(1, "Vui lòng chọn ít nhất 1 môn học")
            .required(),
    });

    return (
        <div className="student-profile">
            <div className="avatar-container">
                <img src={profile?.avatarUrl} className="avatar" />
            </div>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const payload: UpdateStudentProfileParams = {
                        ...values,
                        dateOfBirth: formatDateReverse(values.dateOfBirth),
                        preferredSubjects: values.preferredSubjects.join(","), // array → string
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
                        {/* ================= Họ và tên ================= */}
                        <div className="form-field">
                            <label className="form-label">Họ và tên</label>
                            <div className="form-input-container">
                                <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                <Field
                                    name="username"
                                    type="text"
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

                        {/* ================= Email ================= */}
                        <div className="form-field">
                            <label className="form-label">Email</label>
                            <div className="form-input-container">
                                <CiMail className="form-input-icon" />
                                <input
                                    type="email"
                                    className="form-input"
                                    value={profile?.email || ""}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* ================= Địa chỉ ================= */}
                        <div className="form-field">
                            <label className="form-label">Địa chỉ</label>
                            <div className="form-input-container">
                                <FaMapMarkerAlt className="form-input-icon" />
                                <Field
                                    name="address"
                                    type="text"
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

                        {/* ================= Số điện thoại ================= */}
                        <div className="form-field">
                            <label className="form-label">Số điện thoại</label>
                            <div className="form-input-container">
                                <FaPhone className="form-input-icon" />
                                <Field
                                    name="phone"
                                    type="text"
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

                        {/* ================= Ngày sinh ================= */}
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
                                    maxDate={maxDate}
                                />
                            </div>
                            <ErrorMessage
                                name="dateOfBirth"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        {/* ================= Giới tính ================= */}
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

                        {/* ================= Cấp bậc học ================= */}
                        <div className="form-field">
                            <label className="form-label">Cấp bậc học</label>
                            <div className="form-input-container">
                                <MdOutlineDriveFileRenameOutline className="form-input-icon" />

                                <Field
                                    as="select"
                                    name="educationLevelId"
                                    className="form-input"
                                    onChange={(e: any) => {
                                        setFieldValue(
                                            "educationLevelId",
                                            e.target.value,
                                        );
                                        // Reset môn khi đổi cấp
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
                                name="educationLevelId"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        {/* ================= Môn học ================= */}
                        <MultiSelect
                            label="Môn học yêu thích"
                            placeholder="Chọn môn học"
                            options={
                                values.educationLevelId
                                    ? subjectsByLevel[
                                          values.educationLevelId as LevelType
                                      ].map((s) => ({
                                          label: s,
                                          value: s,
                                      }))
                                    : []
                            }
                            value={values.preferredSubjects.map(
                                (s: string) => ({
                                    label: s,
                                    value: s,
                                }),
                            )}
                            onChange={(selected: any) => {
                                setFieldValue(
                                    "preferredSubjects",
                                    selected.map((item: any) => item.value),
                                );
                            }}
                        />
                        <ErrorMessage
                            name="preferredSubjects"
                            component="p"
                            className="form-error"
                        />

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
