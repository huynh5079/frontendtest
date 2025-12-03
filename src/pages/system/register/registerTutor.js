import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdOutlineDriveFileRenameOutline, MdOutlineEmail, MdOutlineDescription, MdOutlineLeaderboard, } from "react-icons/md";
import { PiGenderIntersex } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { LiaMapMarkerAltSolid } from "react-icons/lia";
import { FaGraduationCap, FaUniversity, FaBookOpen, FaChalkboardTeacher, FaCertificate, } from "react-icons/fa";
import { HiOutlineIdentification } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbBriefcase2 } from "react-icons/tb";
import { GiSkills } from "react-icons/gi";
import { DatePickerElement, LoadingSpinner, MultiSelect, } from "../../../components/elements";
import { useAppDispatch } from "../../../app/store";
import { verifyEmailApiThunk } from "../../../services/auth/authThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { toast } from "react-toastify";
import { get } from "lodash";
import { setRegisterTutorData } from "../../../services/auth/registerTutorSlice";
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
const FormField = ({ name, label, placeholder, icon: Icon, type = "text", as, options, multiple, onChangeFile, }) => (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: label }), _jsxs("div", { className: "form-input-container", children: [_jsx(Icon, { className: "form-input-icon" }), onChangeFile ? (_jsx("input", { type: "file", multiple: multiple, className: "form-input", onChange: (e) => onChangeFile &&
                        onChangeFile(Array.from(e.target.files || [])) })) : as === "textarea" ? (_jsx(Field, { as: "textarea", name: name, placeholder: placeholder, className: "form-input" })) : as === "select" ? (_jsxs(Field, { as: "select", name: name, className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn --" }), options?.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })) : (_jsx(Field, { name: name, type: type, placeholder: placeholder, className: "form-input" }))] }), _jsx(ErrorMessage, { name: name, component: "p", className: "text-error" })] }));
// --- Steps Components ---
const Step1 = ({ values, setFieldValue }) => (_jsxs("div", { className: "form", children: [_jsx(FormField, { name: "username", label: "H\u1ECD v\u00E0 t\u00EAn", placeholder: "Nh\u1EADp h\u1ECD v\u00E0 t\u00EAn", icon: MdOutlineDriveFileRenameOutline }), _jsx(FormField, { name: "gender", label: "Gi\u1EDBi t\u00EDnh", icon: PiGenderIntersex, as: "select", options: [
                { value: "0", label: "Nam" },
                { value: "1", label: "Nữ" },
            ] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y sinh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendarDate, { className: "form-input-icon" }), _jsx(DatePickerElement, { value: values.DateOfBirth, onChange: (date) => setFieldValue("DateOfBirth", date) })] }), _jsx(ErrorMessage, { name: "DateOfBirth", component: "p", className: "text-error" })] }), _jsx(FormField, { name: "phoneNumber", label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i", placeholder: "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i", icon: IoPhonePortraitOutline }), _jsx(FormField, { name: "email", label: "Email", placeholder: "Nh\u1EADp email", icon: MdOutlineEmail, type: "email" }), _jsx(FormField, { name: "address", label: "\u0110\u1ECBa ch\u1EC9", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9", icon: LiaMapMarkerAltSolid }), _jsx(FormField, { name: "password", label: "M\u1EADt kh\u1EA9u", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u", icon: RiLockPasswordLine, type: "password" }), _jsx(FormField, { name: "identityDocuments", label: "C\u0103n c\u01B0\u1EDBc c\u00F4ng d\u00E2n", icon: HiOutlineIdentification, onChangeFile: (files) => setFieldValue("identityDocuments", files), multiple: true }), _jsx(FormField, { name: "seftDescription", label: "M\u00F4 t\u1EA3 b\u1EA3n th\u00E2n", placeholder: "M\u00F4 t\u1EA3 b\u1EA3n th\u00E2n", icon: MdOutlineDescription, as: "textarea" })] }));
const Step2 = ({ setFieldValue }) => {
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const handleLevelChange = (e) => {
        const selectedLevel = e.target.value;
        setFieldValue("teachingLevel", selectedLevel);
        const allowedSubjects = levelSubjectsMap[selectedLevel] || [];
        setFilteredSubjects(subjectsOptions.filter((s) => allowedSubjects.includes(s.value)));
    };
    return (_jsxs("div", { className: "form", children: [_jsx(FormField, { name: "educationLevel", label: "Tr\u00ECnh \u0111\u1ED9 h\u1ECDc v\u1EA5n", icon: FaGraduationCap, as: "select", options: [
                    { value: "Đại học", label: "Đại học" },
                    { value: "Cao đẳng", label: "Cao đẳng" },
                    { value: "Đã tốt nghiệp", label: "Đã tốt nghiệp" },
                ] }), _jsx(FormField, { name: "major", label: "Ng\u00E0nh h\u1ECDc", placeholder: "Nh\u1EADp ng\u00E0nh h\u1ECDc", icon: FaBookOpen }), _jsx(FormField, { name: "university", label: "Tr\u01B0\u1EDDng/\u0110\u01A1n v\u1ECB \u0111\u00E0o t\u1EA1o", placeholder: "Nh\u1EADp t\u00EAn tr\u01B0\u1EDDng", icon: FaUniversity }), _jsx(FormField, { name: "teachingLevel", label: "C\u1EA5p \u0111\u1ED9 gi\u1EA3ng d\u1EA1y", icon: MdOutlineLeaderboard, as: "select", options: [
                    { value: "Tiểu học", label: "Tiểu học" },
                    { value: "Trung học cơ sở", label: "Trung học cơ sở" },
                    {
                        value: "Trung học phổ thông",
                        label: "Trung học phổ thông",
                    },
                ], onChange: (e) => handleLevelChange(e) }), _jsxs("div", { className: "form-field", children: [_jsx(MultiSelect, { label: "M\u00F4n d\u1EA1y", placeholder: "Ch\u1ECDn m\u00F4n d\u1EA1y", options: filteredSubjects, onChange: (selected) => setFieldValue("teachingSubjects", selected.map((s) => s.value)) }), _jsx(ErrorMessage, { name: "teachingSubjects", component: "p", className: "text-error" })] })] }));
};
const Step3 = ({ setFieldValue }) => (_jsxs("div", { className: "form", children: [_jsx(FormField, { name: "teachingExperienceYears", label: "S\u1ED1 n\u0103m kinh nghi\u1EC7m", placeholder: "Nh\u1EADp s\u1ED1 n\u0103m kinh nghi\u1EC7m", icon: TbBriefcase2 }), _jsx(FormField, { name: "experienceDetails", label: "Chi ti\u1EBFt kinh nghi\u1EC7m", placeholder: "Nh\u1EADp chi ti\u1EBFt kinh nghi\u1EC7m", icon: FaChalkboardTeacher }), _jsx(FormField, { name: "certificatesFiles", label: "Ch\u1EE9ng ch\u1EC9 / B\u1EB1ng c\u1EA5p", icon: FaCertificate, onChangeFile: (files) => setFieldValue("certificatesFiles", files), multiple: true }), _jsx(FormField, { name: "specialSkills", label: "K\u1EF9 n\u0103ng \u0111\u1EB7c bi\u1EC7t", placeholder: "Nh\u1EADp k\u1EF9 n\u0103ng \u0111\u1EB7c bi\u1EC7t", icon: GiSkills })] }));
// --- Main RegisterTutorPage ---
const RegisterTutorPage = () => {
    const dispatch = useAppDispatch();
    const [isStep, setIsStep] = useState(1);
    const initialValues = {
        username: "",
        password: "",
        email: "",
        gender: "",
        DateOfBirth: null,
        phoneNumber: "",
        address: "",
        seftDescription: "",
        educationLevel: "",
        university: "",
        major: "",
        teachingExperienceYears: "",
        experienceDetails: "",
        teachingSubjects: [],
        teachingLevel: "",
        specialSkills: "",
        certificatesFiles: [],
        identityDocuments: [],
    };
    const RegisterTutorSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ tên"),
        password: Yup.string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .required("Vui lòng nhập mật khẩu"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        DateOfBirth: Yup.date().nullable().required("Vui lòng chọn ngày sinh"),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        seftDescription: Yup.string()
            .max(500, "Tối đa 500 ký tự")
            .required("Vui lòng nhập mô tả"),
        educationLevel: Yup.string().required("Vui lòng chọn trình độ học vấn"),
        university: Yup.string().required("Vui lòng nhập tên trường"),
        major: Yup.string().required("Vui lòng nhập chuyên ngành"),
        teachingExperienceYears: Yup.number()
            .typeError("Vui lòng nhập số năm hợp lệ")
            .min(0, "Không hợp lệ")
            .required("Vui lòng nhập số năm"),
        experienceDetails: Yup.string().required("Vui lòng mô tả kinh nghiệm giảng dạy"),
        teachingSubjects: Yup.array()
            .min(1, "Vui lòng chọn ít nhất một môn giảng dạy")
            .required("Vui lòng chọn môn giảng dạy"),
        teachingLevel: Yup.string().required("Vui lòng chọn cấp độ giảng dạy"),
        specialSkills: Yup.string()
            .max(200, "Tối đa 200 ký tự")
            .required("Vui lòng nhập kiểu năng đặc biệt"),
        certificatesFiles: Yup.array().min(1, "Vui lòng tải lên ít nhất một chứng chỉ"),
        identityDocuments: Yup.array().min(1, "Vui lòng tải lên giấy tờ tùy thân"),
    });
    const handleNextStep = () => setIsStep(isStep + 1);
    const handlePrevStep = () => setIsStep(isStep - 1);
    const handleSubmit = async (values, helpers) => {
        await dispatch(verifyEmailApiThunk({ email: values.email }))
            .unwrap()
            .then(() => {
            dispatch(setRegisterTutorData(values));
            navigateHook(routes.verify_otp.tutor);
        })
            .catch((error) => {
            const errorData = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            helpers.setSubmitting(false);
        });
    };
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký trở thành gia sư";
    }, []);
    return (_jsx("section", { id: "register-tutor-section", children: _jsxs("div", { className: "rts-container", children: [_jsx("h2", { children: "\u0110\u0103ng k\u00FD t\u00E0i kho\u1EA3n gia s\u01B0" }), _jsx(Formik, { initialValues: initialValues, validationSchema: RegisterTutorSchema, onSubmit: handleSubmit, children: ({ values, setFieldValue, isSubmitting }) => (_jsxs(Form, { children: [_jsx("div", { className: "rtscr1", children: [
                                    "Thông tin cá nhân",
                                    "Học vấn & chuyên môn",
                                    "Kinh nghiệm & kỹ năng",
                                ].map((title, idx) => (_jsxs("div", { className: `rtscr1-step ${isStep === idx + 1
                                        ? "rtscr1-step-active"
                                        : ""}`, onClick: () => setIsStep(idx + 1), children: [_jsx("span", { children: idx + 1 }), title] }, idx))) }), isStep === 1 && (_jsx(Step1, { values: values, setFieldValue: setFieldValue })), isStep === 2 && (_jsx(Step2, { values: values, setFieldValue: setFieldValue })), isStep === 3 && (_jsx(Step3, { setFieldValue: setFieldValue })), _jsxs("div", { className: "group-btn", children: [isStep > 1 && (_jsx("button", { type: "button", className: "sc-btn", onClick: handlePrevStep, children: "Quay l\u1EA1i" })), isStep < 3 ? (_jsx("button", { type: "button", className: "pr-btn", onClick: handleNextStep, children: "Ti\u1EBFp theo" })) : (_jsx("button", { type: "submit", className: isSubmitting
                                            ? "disable-btn"
                                            : "pr-btn", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đăng ký") }))] })] })) })] }) }));
};
export default RegisterTutorPage;
