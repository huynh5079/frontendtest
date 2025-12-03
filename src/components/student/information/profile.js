import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { DatePickerElement, LoadingSpinner, MultiSelect } from "../../elements";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileStudent } from "../../../app/selector";
import { getProfileStudentApiThunk, updateProfileStudentApiThunk, } from "../../../services/user/userThunk";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GiMale } from "react-icons/gi";
import { get } from "lodash";
import { toast } from "react-toastify";
const subjectsByLevel = {
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
const StudentProfile = () => {
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfileStudent);
    useEffect(() => {
        dispatch(getProfileStudentApiThunk());
    }, [dispatch]);
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
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
    return (_jsxs("div", { className: "student-profile", children: [_jsx("div", { className: "avatar-container", children: _jsx("img", { src: profile?.avatarUrl, className: "avatar" }) }), _jsx(Formik, { enableReinitialize: true, initialValues: initialValues, validationSchema: validationSchema, onSubmit: (values, { setSubmitting }) => {
                    const payload = {
                        ...values,
                        dateOfBirth: formatDateReverse(values.dateOfBirth),
                        preferredSubjects: values.preferredSubjects.join(","), // array → string
                    };
                    setSubmitting(true);
                    dispatch(updateProfileStudentApiThunk(payload))
                        .unwrap()
                        .then((res) => {
                        toast.success(get(res, "data.message", "Cập nhật thành công"));
                        dispatch(getProfileStudentApiThunk());
                    })
                        .catch((err) => {
                        toast.error(get(err, "data.message", "Có lỗi xảy ra"));
                    })
                        .finally(() => setSubmitting(false));
                }, children: ({ values, setFieldValue, isSubmitting }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "username", type: "text", className: "form-input", placeholder: "Nh\u1EADp h\u1ECD v\u00E0 t\u00EAn" })] }), _jsx(ErrorMessage, { name: "username", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiMail, { className: "form-input-icon" }), _jsx("input", { type: "email", className: "form-input", value: profile?.email || "", disabled: true })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaMapMarkerAlt, { className: "form-input-icon" }), _jsx(Field, { name: "address", type: "text", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9" })] }), _jsx(ErrorMessage, { name: "address", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaPhone, { className: "form-input-icon" }), _jsx(Field, { name: "phone", type: "text", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i" })] }), _jsx(ErrorMessage, { name: "phone", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y sinh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendarDate, { className: "form-input-icon" }), _jsx(DatePickerElement, { value: values.dateOfBirth
                                                ? new Date(values.dateOfBirth)
                                                : null, onChange: (date) => setFieldValue("dateOfBirth", date), maxDate: maxDate })] }), _jsx(ErrorMessage, { name: "dateOfBirth", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Gi\u1EDBi t\u00EDnh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(GiMale, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "gender", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn gi\u1EDBi t\u00EDnh --" }), _jsx("option", { value: "male", children: "Nam" }), _jsx("option", { value: "female", children: "N\u1EEF" })] })] }), _jsx(ErrorMessage, { name: "gender", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "educationLevelId", className: "form-input", onChange: (e) => {
                                                setFieldValue("educationLevelId", e.target.value);
                                                // Reset môn khi đổi cấp
                                                setFieldValue("preferredSubjects", []);
                                            }, children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn c\u1EA5p b\u1EADc --" }), _jsx("option", { value: "Ti\u1EC3u h\u1ECDc", children: "Ti\u1EC3u h\u1ECDc" }), _jsx("option", { value: "Trung h\u1ECDc c\u01A1 s\u1EDF", children: "Trung h\u1ECDc c\u01A1 s\u1EDF" }), _jsx("option", { value: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng", children: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng" })] })] }), _jsx(ErrorMessage, { name: "educationLevelId", component: "p", className: "text-error" })] }), _jsx(MultiSelect, { label: "M\u00F4n h\u1ECDc y\u00EAu th\u00EDch", placeholder: "Ch\u1ECDn m\u00F4n h\u1ECDc", options: values.educationLevelId
                                ? subjectsByLevel[values.educationLevelId].map((s) => ({
                                    label: s,
                                    value: s,
                                }))
                                : [], value: values.preferredSubjects.map((s) => ({
                                label: s,
                                value: s,
                            })), onChange: (selected) => {
                                setFieldValue("preferredSubjects", selected.map((item) => item.value));
                            } }), _jsx(ErrorMessage, { name: "preferredSubjects", component: "p", className: "form-error" }), _jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Cập nhật" })] })) })] }));
};
export default StudentProfile;
