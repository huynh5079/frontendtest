import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaBookOpen, FaCertificate, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaUniversity, } from "react-icons/fa";
import { MdOutlineDescription, MdOutlineDriveFileRenameOutline, } from "react-icons/md";
import { DatePickerElement, MultiSelect } from "../../../components/elements";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileTutor } from "../../../app/selector";
import { getProfileTutorApiThunk } from "../../../services/user/userThunk";
import { TbBriefcase2 } from "react-icons/tb";
import { HiOutlineIdentification } from "react-icons/hi";
import { PiGenderIntersex } from "react-icons/pi";
import { csvToArray, useDocumentTitle } from "../../../utils/helper";
// --- Subject options ---
export const subjectsOptions = [
    { value: "Toán", label: "Toán" },
    { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "Tiếng Anh", label: "Tiếng Anh" },
    { value: "Ngữ văn", label: "Ngữ Văn" },
    { value: "Vật Lí", label: "Vật Lí" },
    { value: "Hóa Học", label: "Hóa Học" },
    { value: "Sinh Học", label: "Sinh Học" },
];
const levelSubjectsMap = {
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
const TutorInformationPage = () => {
    const dispatch = useAppDispatch();
    const tutorProfile = useAppSelector(selectProfileTutor);
    const teachingLevels = csvToArray(String(tutorProfile?.teachingLevel));
    const teachingSubjects = csvToArray(String(tutorProfile?.teachingSubjects));
    useEffect(() => {
        dispatch(getProfileTutorApiThunk());
    }, [dispatch]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const initialValues = {
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
    const handleSubmit = async (values) => {
        console.log(values);
    };
    useDocumentTitle("Trang cá nhân");
    return (_jsx("section", { id: "tutor-information-section", children: _jsxs("div", { className: "tis-container", children: [_jsxs("div", { className: "tiscr1", children: [_jsx("h4", { children: "Trang c\u00E1 nh\u00E2n" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "Trang c\u00E1 nh\u00E2n" })] })] }), _jsx("div", { className: "tiscr2", children: _jsx("div", { className: "pr-btn", onClick: () => navigateHook(routes.tutor.change_password), children: "Thay \u0111\u1ED5i m\u1EADt kh\u1EA9u" }) }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, enableReinitialize: true, onSubmit: handleSubmit, children: ({ isSubmitting, setFieldValue, resetForm }) => (_jsxs(Form, { className: "tiscr3", children: [_jsx("div", { className: "tiscr3r1", children: _jsxs("div", { className: "tiscr3r1c1", children: [_jsx("h5", { children: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" }), _jsx("img", { className: "avatar", src: tutorProfile?.avatarUrl || "" }), _jsxs("div", { className: "group-btn", children: [_jsx("div", { className: "pr-btn", children: "T\u1EA3i \u1EA3nh l\u00EAn" }), _jsx("div", { className: "sc-btn", onClick: () => resetForm(), children: "L\u00E0m m\u1EDBi" })] }), _jsx("p", { children: "Cho ph\u00E9p JPG ho\u1EB7c PNG" })] }) }), _jsxs("div", { className: "tiscr3r2", children: [_jsx("h5", { children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), _jsxs("div", { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "username", type: "text", className: "form-input", placeholder: "Nh\u1EADp h\u1ECD t\u00EAn" })] }), _jsx(ErrorMessage, { name: "username", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Email" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiMail, { className: "form-input-icon" }), _jsx(Field, { name: "email", type: "email", disabled: true, className: "form-input" })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaMapMarkerAlt, { className: "form-input-icon" }), _jsx(Field, { name: "address", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9" })] }), _jsx(ErrorMessage, { name: "address", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaPhone, { className: "form-input-icon" }), _jsx(Field, { name: "phone", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i" })] }), _jsx(ErrorMessage, { name: "phone", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Ng\u00E0y sinh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendarDate, { className: "form-input-icon" }), _jsx(DatePickerElement, { value: tutorProfile?.dateOfBirth
                                                                    ? new Date(tutorProfile?.dateOfBirth)
                                                                    : null, onChange: (date) => setFieldValue("dateOfBirth", date) })] }), _jsx(ErrorMessage, { name: "dateOfBirth", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Gi\u1EDBi t\u00EDnh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(PiGenderIntersex, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "gender", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn gi\u1EDBi t\u00EDnh --" }), _jsx("option", { value: "male", children: "Nam" }), _jsx("option", { value: "female", children: "N\u1EEF" }), _jsx("option", { value: "other", children: "Kh\u00E1c" })] })] }), _jsx(ErrorMessage, { name: "gender", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field form-field-textarea", children: [_jsx("label", { children: "M\u00F4 t\u1EA3 b\u1EA3n th\u00E2n" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDescription, { className: "form-input-icon" }), _jsx(Field, { as: "textarea", name: "bio", rows: 4, placeholder: "M\u00F4 t\u1EA3 b\u1EA3n th\u00E2n", className: "form-input" })] }), _jsx(ErrorMessage, { name: "bio", component: "p", className: "text-error" })] })] }), _jsx("h5", { children: "H\u1ED3 s\u01A1 c\u00E1 nh\u00E2n" }), _jsxs("div", { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Tr\u00ECnh \u0111\u1ED9 h\u1ECDc v\u1EA5n" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaGraduationCap, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "educationLevel", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn tr\u00ECnh \u0111\u1ED9 --" }), _jsx("option", { value: "\u0110\u1EA1i h\u1ECDc", children: "\u0110\u1EA1i h\u1ECDc" }), _jsx("option", { value: "Cao \u0111\u1EB3ng", children: "Cao \u0111\u1EB3ng" }), _jsx("option", { value: "\u0110\u00E3 t\u1ED1t nghi\u1EC7p", children: "\u0110\u00E3 t\u1ED1t nghi\u1EC7p" })] })] }), _jsx(ErrorMessage, { name: "educationLevel", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0nh h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaBookOpen, { className: "form-input-icon" }), _jsx(Field, { name: "major", placeholder: "Nh\u1EADp ng\u00E0nh h\u1ECDc", className: "form-input" })] }), _jsx(ErrorMessage, { name: "major", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Tr\u01B0\u1EDDng / \u0110\u01A1n v\u1ECB \u0111\u00E0o t\u1EA1o" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaUniversity, { className: "form-input-icon" }), _jsx(Field, { name: "university", placeholder: "Nh\u1EADp t\u00EAn tr\u01B0\u1EDDng", className: "form-input" })] }), _jsx(ErrorMessage, { name: "university", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 n\u0103m kinh nghi\u1EC7m" }), _jsxs("div", { className: "form-input-container", children: [_jsx(TbBriefcase2, { className: "form-input-icon" }), _jsx(Field, { name: "teachingExperienceYears", placeholder: "Nh\u1EADp s\u1ED1 n\u0103m kinh nghi\u1EC7m", className: "form-input" })] }), _jsx(ErrorMessage, { name: "teachingExperienceYears", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx(MultiSelect, { label: "C\u1EA5p \u0111\u1ED9 gi\u1EA3ng d\u1EA1y", placeholder: "Ch\u1ECDn c\u1EA5p \u0111\u1ED9 gi\u1EA3ng d\u1EA1y", options: [
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
                                                        ], value: teachingLevels.map((level) => ({
                                                            value: level,
                                                            label: level,
                                                        })), onChange: (selected) => {
                                                            // Lưu vào Formik
                                                            const selectedLevels = selected.map((s) => s.value);
                                                            setFieldValue("teachingLevel", selectedLevels);
                                                            // Lọc lại môn học tương ứng
                                                            const allowedSubjects = selectedLevels.flatMap((level) => levelSubjectsMap[level] || []);
                                                            const newFiltered = subjectsOptions.filter((s) => allowedSubjects.includes(s.value));
                                                            setFilteredSubjects(newFiltered);
                                                            // Reset môn học nếu không còn hợp lệ
                                                            const validSelectedSubjects = teachingSubjects.filter((subj) => allowedSubjects.includes(subj));
                                                            setFieldValue("teachingSubjects", validSelectedSubjects);
                                                        } }), _jsx(ErrorMessage, { name: "teachingLevel", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx(MultiSelect, { label: "M\u00F4n d\u1EA1y", placeholder: "Ch\u1ECDn m\u00F4n d\u1EA1y", options: filteredSubjects, value: teachingSubjects.map((level) => ({
                                                            value: level,
                                                            label: level,
                                                        })), onChange: (selected) => setFieldValue("teachingSubjects", selected.map((s) => s.value)) }), _jsx(ErrorMessage, { name: "teachingSubjects", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "C\u0103n c\u01B0\u1EDBc c\u00F4ng d\u00E2n" }), _jsxs("div", { className: "form-input-container", children: [_jsx(HiOutlineIdentification, { className: "form-input-icon" }), _jsx("input", { type: "file", multiple: true, onChange: (e) => setFieldValue("identityDocuments", Array.from(e.target.files ||
                                                                    [])), className: "form-input" })] }), _jsx(ErrorMessage, { name: "identityDocuments", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ch\u1EE9ng ch\u1EC9 / B\u1EB1ng c\u1EA5p" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaCertificate, { className: "form-input-icon" }), _jsx("input", { type: "file", multiple: true, onChange: (e) => setFieldValue("certificatesFiles", Array.from(e.target.files ||
                                                                    [])), className: "form-input" })] }), _jsx(ErrorMessage, { name: "certificatesFiles", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u00ECnh \u1EA3nh CCCD" }), tutorProfile?.identityDocuments.map((identityDocument) => (_jsx("img", { src: identityDocument.url, alt: "", style: { width: "250px" } }, identityDocument.id)))] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ch\u1EE9ng ch\u1EC9 / B\u1EB1ng c\u1EA5p" }), tutorProfile?.certificates.map((certificate, index) => {
                                                        return (_jsxs("div", { children: [_jsxs("h2", { children: [certificate.fileName, " "] }, certificate.id), _jsx("a", { href: certificate.url, download: true, children: "Xem" })] }, index));
                                                    })] })] }), _jsxs("div", { className: "group-btn", children: [_jsx("button", { type: "submit", className: "pr-btn", disabled: isSubmitting, children: isSubmitting
                                                    ? "Đang cập nhật..."
                                                    : "Cập nhật" }), _jsx("div", { className: "sc-btn", onClick: () => resetForm(), children: "L\u00E0m m\u1EDBi" })] })] })] })) })] }) }));
};
export default TutorInformationPage;
