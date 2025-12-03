import { useEffect, useState, type FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import {
    FaBookOpen,
    FaCertificate,
    FaGraduationCap,
    FaMapMarkerAlt,
    FaPhone,
    FaUniversity,
} from "react-icons/fa";
import {
    MdOutlineDescription,
    MdOutlineDriveFileRenameOutline,
} from "react-icons/md";
import { DatePickerElement, MultiSelect } from "../../../components/elements";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileTutor } from "../../../app/selector";
import { getProfileTutorApiThunk } from "../../../services/user/userThunk";
import type {
    TutorProfileUpdateParams,
} from "../../../types/tutor";
import type { OptionMultiSelectData } from "../../../types/app";
import { TbBriefcase2 } from "react-icons/tb";
import { HiOutlineIdentification } from "react-icons/hi";
import { PiGenderIntersex } from "react-icons/pi";
import { csvToArray, useDocumentTitle } from "../../../utils/helper";

// --- Subject options ---
export const subjectsOptions: OptionMultiSelectData[] = [
    { value: "Toán", label: "Toán" },
    { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "Tiếng Anh", label: "Tiếng Anh" },
    { value: "Ngữ văn", label: "Ngữ Văn" },
    { value: "Vật Lí", label: "Vật Lí" },
    { value: "Hóa Học", label: "Hóa Học" },
    { value: "Sinh Học", label: "Sinh Học" },
];

const levelSubjectsMap: Record<string, string[]> = {
    "Tiểu học": ["Toán", "Tiếng Việt", "Tiếng Anh"],
    "Trung học cơ sở": [
        "Toán",
        "Tiếng Anh",
        "Ngữ văn",
        "Vật Lí",
        "Hóa Học",
        "Sinh Học",
    ],
    "Trung học phổ thông": [
        "Toán",
        "Tiếng Anh",
        "Ngữ văn",
        "Vật Lí",
        "Hóa Học",
        "Sinh Học",
    ],
};

const TutorInformationPage: FC = () => {
    const dispatch = useAppDispatch();
    const tutorProfile = useAppSelector(selectProfileTutor);
    const teachingLevels = csvToArray(String(tutorProfile?.teachingLevel));
    const teachingSubjects = csvToArray(String(tutorProfile?.teachingSubjects));

    useEffect(() => {
        dispatch(getProfileTutorApiThunk());
    }, [dispatch]);

    const [filteredSubjects, setFilteredSubjects] = useState<
        OptionMultiSelectData[]
    >([]);

    const initialValues: TutorProfileUpdateParams = {
        username: tutorProfile?.username || "",
        gender: tutorProfile?.gender || null,
        bio: tutorProfile?.bio || "",
        phone: tutorProfile?.phone || "",
        address: tutorProfile?.address || "",
        educationLevel: tutorProfile?.educationLevel || "",
        university: tutorProfile?.university || "",
        major: tutorProfile?.major || "",
        teachingExperienceYears: tutorProfile?.teachingExperienceYears || 0,
        teachingSubjects: tutorProfile?.teachingSubjects || "",
        teachingLevel: tutorProfile?.teachingLevel || "",
        specialSkills: tutorProfile?.specialSkills || "",
        newCertificates: tutorProfile?.certificates || [],
        avatarFile: null,
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ tên"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: Yup.date().nullable().required("Vui lòng chọn ngày sinh"),
        phone: Yup.string()
            .matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        bio: Yup.string()
            .max(500, "Tối đa 500 ký tự")
            .required("Vui lòng nhập mô tả bản thân"),
        educationLevel: Yup.string().required("Vui lòng chọn trình độ học vấn"),
        university: Yup.string().required("Vui lòng nhập tên trường"),
        major: Yup.string().required("Vui lòng nhập chuyên ngành"),
        teachingExperienceYears: Yup.number()
            .typeError("Phải là số")
            .min(0, "Không hợp lệ")
            .required("Vui lòng nhập số năm kinh nghiệm"),
        teachingLevel: Yup.string().required("Vui lòng chọn cấp độ giảng dạy"),
        specialSkills: Yup.string()
            .max(200, "Tối đa 200 ký tự")
            .required("Vui lòng nhập kỹ năng đặc biệt"),
    });

    const handleSubmit = async (values: TutorProfileUpdateParams) => {
        console.log(values);
    };

    useDocumentTitle("Trang cá nhân");

    return (
        <section id="tutor-information-section">
            <div className="tis-container">
                <div className="tiscr1">
                    <h4>Trang cá nhân</h4>
                    <p>
                        Trang tổng quát <span>Trang cá nhân</span>
                    </p>
                </div>

                <div className="tiscr2">
                    <div
                        className="pr-btn"
                        onClick={() =>
                            navigateHook(routes.tutor.change_password)
                        }
                    >
                        Thay đổi mật khẩu
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, resetForm }) => (
                        <Form className="tiscr3">
                            {/* ẢNH ĐẠI DIỆN */}
                            <div className="tiscr3r1">
                                <div className="tiscr3r1c1">
                                    <h5>Ảnh đại diện</h5>
                                    <img
                                        className="avatar"
                                        src={tutorProfile?.avatarUrl || ""}
                                    />
                                    <div className="group-btn">
                                        <div className="pr-btn">
                                            Tải ảnh lên
                                        </div>
                                        <div
                                            className="sc-btn"
                                            onClick={() => resetForm()}
                                        >
                                            Làm mới
                                        </div>
                                    </div>
                                    <p>Cho phép JPG hoặc PNG</p>
                                </div>
                            </div>

                            {/* THÔNG TIN CÁ NHÂN */}
                            <div className="tiscr3r2">
                                <h5>Thông tin cá nhân</h5>

                                <div className="form">
                                    <div className="form-field">
                                        <label>Họ và tên</label>
                                        <div className="form-input-container">
                                            <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                                            <Field
                                                name="username"
                                                type="text"
                                                className="form-input"
                                                placeholder="Nhập họ tên"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="username"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Email</label>
                                        <div className="form-input-container">
                                            <CiMail className="form-input-icon" />
                                            <Field
                                                name="email"
                                                type="email"
                                                disabled
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label>Địa chỉ</label>
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

                                    <div className="form-field">
                                        <label>Số điện thoại</label>
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

                                    <div className="form-field">
                                        <label>Ngày sinh</label>
                                        <div className="form-input-container">
                                            <CiCalendarDate className="form-input-icon" />
                                            <DatePickerElement
                                                value={
                                                    tutorProfile?.dateOfBirth
                                                        ? new Date(
                                                              tutorProfile?.dateOfBirth,
                                                          )
                                                        : null
                                                }
                                                onChange={(date) =>
                                                    setFieldValue(
                                                        "dateOfBirth",
                                                        date,
                                                    )
                                                }
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="dateOfBirth"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Giới tính</label>
                                        <div className="form-input-container">
                                            <PiGenderIntersex className="form-input-icon" />
                                            <Field
                                                as="select"
                                                name="gender"
                                                className="form-input"
                                            >
                                                <option value="">
                                                    -- Chọn giới tính --
                                                </option>
                                                <option value="male">
                                                    Nam
                                                </option>
                                                <option value="female">
                                                    Nữ
                                                </option>
                                                <option value="other">
                                                    Khác
                                                </option>
                                            </Field>
                                        </div>
                                        <ErrorMessage
                                            name="gender"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field form-field-textarea">
                                        <label>Mô tả bản thân</label>
                                        <div className="form-input-container">
                                            <MdOutlineDescription className="form-input-icon" />
                                            <Field
                                                as="textarea"
                                                name="bio"
                                                rows={4}
                                                placeholder="Mô tả bản thân"
                                                className="form-input"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="bio"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>
                                </div>

                                <h5>Hồ sơ cá nhân</h5>

                                <div className="form">
                                    <div className="form-field">
                                        <label className="form-label">
                                            Trình độ học vấn
                                        </label>
                                        <div className="form-input-container">
                                            <FaGraduationCap className="form-input-icon" />
                                            <Field
                                                as="select"
                                                name="educationLevel"
                                                className="form-input"
                                            >
                                                <option value="">
                                                    -- Chọn trình độ --
                                                </option>
                                                <option value="Đại học">
                                                    Đại học
                                                </option>
                                                <option value="Cao đẳng">
                                                    Cao đẳng
                                                </option>
                                                <option value="Đã tốt nghiệp">
                                                    Đã tốt nghiệp
                                                </option>
                                            </Field>
                                        </div>
                                        <ErrorMessage
                                            name="educationLevel"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Ngành học
                                        </label>
                                        <div className="form-input-container">
                                            <FaBookOpen className="form-input-icon" />
                                            <Field
                                                name="major"
                                                placeholder="Nhập ngành học"
                                                className="form-input"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="major"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Trường / Đơn vị đào tạo
                                        </label>
                                        <div className="form-input-container">
                                            <FaUniversity className="form-input-icon" />
                                            <Field
                                                name="university"
                                                placeholder="Nhập tên trường"
                                                className="form-input"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="university"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Số năm kinh nghiệm
                                        </label>
                                        <div className="form-input-container">
                                            <TbBriefcase2 className="form-input-icon" />
                                            <Field
                                                name="teachingExperienceYears"
                                                placeholder="Nhập số năm kinh nghiệm"
                                                className="form-input"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="teachingExperienceYears"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <MultiSelect
                                            label="Cấp độ giảng dạy"
                                            placeholder="Chọn cấp độ giảng dạy"
                                            options={[
                                                {
                                                    value: "Tiểu học",
                                                    label: "Tiểu học",
                                                },
                                                {
                                                    value: "Trung học cơ sở",
                                                    label: "Trung học cơ sở",
                                                },
                                                {
                                                    value: "Trung học phổ thông",
                                                    label: "Trung học phổ thông",
                                                },
                                            ]}
                                            value={teachingLevels.map(
                                                (level) => ({
                                                    value: level,
                                                    label: level,
                                                }),
                                            )}
                                            onChange={(selected) => {
                                                // Lưu vào Formik
                                                const selectedLevels =
                                                    selected.map(
                                                        (s) => s.value,
                                                    );
                                                setFieldValue(
                                                    "teachingLevel",
                                                    selectedLevels,
                                                );

                                                // Lọc lại môn học tương ứng
                                                const allowedSubjects =
                                                    selectedLevels.flatMap(
                                                        (level) =>
                                                            levelSubjectsMap[
                                                                level
                                                            ] || [],
                                                    );
                                                const newFiltered =
                                                    subjectsOptions.filter(
                                                        (s) =>
                                                            allowedSubjects.includes(
                                                                s.value,
                                                            ),
                                                    );
                                                setFilteredSubjects(
                                                    newFiltered,
                                                );

                                                // Reset môn học nếu không còn hợp lệ
                                                const validSelectedSubjects =
                                                    teachingSubjects.filter(
                                                        (subj) =>
                                                            allowedSubjects.includes(
                                                                subj,
                                                            ),
                                                    );
                                                setFieldValue(
                                                    "teachingSubjects",
                                                    validSelectedSubjects,
                                                );
                                            }}
                                        />
                                        <ErrorMessage
                                            name="teachingLevel"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <MultiSelect
                                            label="Môn dạy"
                                            placeholder="Chọn môn dạy"
                                            options={filteredSubjects}
                                            value={teachingSubjects.map(
                                                (level) => ({
                                                    value: level,
                                                    label: level,
                                                }),
                                            )}
                                            onChange={(selected) =>
                                                setFieldValue(
                                                    "teachingSubjects",
                                                    selected.map(
                                                        (s) => s.value,
                                                    ),
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name="teachingSubjects"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Căn cước công dân
                                        </label>
                                        <div className="form-input-container">
                                            <HiOutlineIdentification className="form-input-icon" />
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        "identityDocuments",
                                                        Array.from(
                                                            e.target.files ||
                                                                [],
                                                        ),
                                                    )
                                                }
                                                className="form-input"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="identityDocuments"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Chứng chỉ / Bằng cấp
                                        </label>
                                        <div className="form-input-container">
                                            <FaCertificate className="form-input-icon" />
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        "certificatesFiles",
                                                        Array.from(
                                                            e.target.files ||
                                                                [],
                                                        ),
                                                    )
                                                }
                                                className="form-input"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="certificatesFiles"
                                            component="p"
                                            className="text-error"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Hình ảnh CCCD
                                        </label>
                                        {tutorProfile?.identityDocuments.map(
                                            (identityDocument) => (
                                                <img
                                                    key={identityDocument.id}
                                                    src={identityDocument.url}
                                                    alt=""
                                                    style={{ width: "250px" }}
                                                />
                                            ),
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">
                                            Chứng chỉ / Bằng cấp
                                        </label>
                                        {tutorProfile?.certificates.map(
                                            (certificate, index) => {
                                                return (
                                                    <div key={index}>
                                                        <h2
                                                            key={certificate.id}
                                                        >
                                                            {
                                                                certificate.fileName
                                                            }{" "}
                                                        </h2>
                                                        <a
                                                            href={
                                                                certificate.url
                                                            }
                                                            download
                                                        >
                                                            Xem
                                                        </a>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                {/* NÚT SUBMIT */}
                                <div className="group-btn">
                                    <button
                                        type="submit"
                                        className="pr-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Đang cập nhật..."
                                            : "Cập nhật"}
                                    </button>
                                    <div
                                        className="sc-btn"
                                        onClick={() => resetForm()}
                                    >
                                        Làm mới
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
};

export default TutorInformationPage;
