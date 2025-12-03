import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { DatePickerElement, LoadingSpinner } from "../../elements";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectProfileParent } from "../../../app/selector";
import { getProfileParentApiThunk } from "../../../services/user/userThunk";
import { useDocumentTitle } from "../../../utils/helper";
const ParentProfile = () => {
    const dispatch = useAppDispatch();
    const parentProfile = useAppSelector(selectProfileParent);
    useEffect(() => {
        dispatch(getProfileParentApiThunk());
    }, [dispatch]);
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
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
    const initialValues = {
        username: parentProfile?.username || "",
        avatarUrl: parentProfile?.avatarUrl || "",
        email: parentProfile?.email || "",
        phone: parentProfile?.phone || "",
        address: parentProfile?.address || "",
        gender: parentProfile?.gender || "male",
        dateOfBirth: parentProfile?.dateOfBirth || "",
    };
    const handleSubmit = async (values) => {
        console.log(values);
    };
    useDocumentTitle("Trang cá nhân");
    return (_jsx("div", { className: "parent-profile", children: _jsx(Formik, { enableReinitialize: true, initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ setFieldValue, values, isSubmitting }) => (_jsxs(Form, { children: [_jsxs("div", { className: "avatar-container", children: [_jsx("h5", { children: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" }), _jsx("img", { className: "avatar", src: values.avatarUrl || "" }), _jsx("div", { className: "group-btn", children: _jsx("div", { className: "pr-btn", children: "T\u1EA3i \u1EA3nh l\u00EAn" }) })] }), _jsxs("div", { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "username", type: "text", className: "form-input", placeholder: "Nh\u1EADp h\u1ECD v\u00E0 t\u00EAn c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "username", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiMail, { className: "form-input-icon" }), _jsx(Field, { name: "email", type: "email", disabled: true, className: "form-input", placeholder: "Nh\u1EADp email c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "email", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaMapMarkerAlt, { className: "form-input-icon" }), _jsx(Field, { name: "address", type: "text", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "address", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaPhone, { className: "form-input-icon" }), _jsx(Field, { name: "phone", type: "text", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i c\u1EE7a b\u1EA1n" })] }), _jsx(ErrorMessage, { name: "phone", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y sinh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendarDate, { className: "form-input-icon" }), _jsx(DatePickerElement, { value: values.dateOfBirth
                                                    ? new Date(values.dateOfBirth)
                                                    : null, onChange: (date) => setFieldValue("dateOfBirth", date?.toISOString() || ""), maxDate: maxDate })] }), _jsx(ErrorMessage, { name: "dateOfBirth", component: "div", className: "text-error" }), _jsxs("p", { className: "form-note", children: [_jsx("span", { children: "L\u01B0u \u00FD:" }), " H\u1ECDc vi\u00EAn c\u1EA7n \u0111\u1EE7 t\u1EEB 16 tu\u1ED5i tr\u1EDF l\u00EAn"] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y sinh" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendarDate, { className: "form-input-icon" }), _jsx(DatePickerElement, { value: values.dateOfBirth
                                                    ? new Date(values.dateOfBirth)
                                                    : null, onChange: (date) => setFieldValue("dateOfBirth", date) })] }), _jsx(ErrorMessage, { name: "dateOfBirth", component: "p", className: "text-error" })] })] }), _jsxs("div", { className: "group-btn", children: [_jsx("div", { className: "sc-btn", children: "L\u00E0m m\u1EDBi" }), _jsx("button", { type: "submit", className: "pr-btn", disabled: isSubmitting, children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Cập nhật" })] })] })) }) }));
};
export default ParentProfile;
