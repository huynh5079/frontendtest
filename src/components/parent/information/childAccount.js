import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaUserFriends, FaPhoneAlt, } from "react-icons/fa";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoadingSpinner, MultiSelect } from "../../elements";
import { selectDetailChildAccount, selectListChildAccount, selectProfileParent, } from "../../../app/selector";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { MdOutlineLeaderboard } from "react-icons/md";
import { createChildAccountApiThunk, getAllChildAccountApiThunk, getDetailChildAccountApiThunk, } from "../../../services/parent/childAccount/childAccountThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../../../utils/helper";
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
const ParentChildAccount = () => {
    const dispatch = useAppDispatch();
    const parentProfile = useAppSelector(selectProfileParent);
    const childAccounts = useAppSelector(selectListChildAccount);
    const childAccount = useAppSelector(selectDetailChildAccount);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [isStep, setIsStep] = useState(1);
    const handleNextStep = () => setIsStep(isStep + 1);
    const handlePrevStep = () => setIsStep(isStep - 1);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);
    useEffect(() => {
        if (id) {
            dispatch(getDetailChildAccountApiThunk(id));
        }
    }, [dispatch, id]);
    const handleViewDetail = (id) => {
        navigate(`/parent/information?tab=child-account&id=${id}`);
    };
    const handleBack = () => {
        navigate(`/parent/information?tab=child-account`);
    };
    const initialValues = {
        username: "",
        email: "",
        address: parentProfile?.address || "",
        phone: parentProfile?.phone || "",
        educationLevelId: "",
        preferredSubjects: "",
        relationship: "",
        initialPassword: "",
    };
    const validationSchema = Yup.object({
        username: Yup.string().required("Vui lòng nhập họ và tên"),
        email: Yup.string().email("Email không hợp lệ"),
        educationLevelId: Yup.string().required("Vui lòng chọn trình độ học vấn"),
        preferredSubjects: Yup.string().required("Vui lòng nhập môn học yêu thích"),
        relationship: Yup.string().required("Vui lòng nhập mối quan hệ"),
        initialPassword: Yup.string()
            .min(8, "Mật khẩu tối thiểu 8 ký tự")
            .required("Vui lòng nhập mật khẩu"),
    });
    const handleSubmit = async (values, helpers) => {
        await dispatch(createChildAccountApiThunk(values))
            .unwrap()
            .then((res) => {
            const message = get(res, "message", "Tạo tài khoản thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            helpers.setSubmitting(false);
            helpers.resetForm();
            setIsStep(1);
        });
    };
    const handleLevelChange = (e, setFieldValue) => {
        const selectedLevel = e.target.value;
        setFieldValue("educationLevelId", selectedLevel);
        const allowedSubjects = levelSubjectsMap[selectedLevel] || [];
        const newFiltered = subjectsOptions.filter((s) => allowedSubjects.includes(s.value));
        setFilteredSubjects(newFiltered);
    };
    useDocumentTitle("Danh sách tài khoản của con");
    return (_jsxs("div", { className: "parent-child-account", children: [isStep === 1 && (_jsx(_Fragment, { children: !id ? (_jsxs("div", { className: `pca-step-1 step ${isStep === 1 ? "step-active" : "step-hidden"}`, children: [_jsxs("div", { className: "pcas1r1", children: [_jsx("h3", { children: "Danh s\u00E1ch t\u00E0i kho\u1EA3n c\u1EE7a con" }), _jsx("button", { className: "pr-btn", onClick: handleNextStep, children: "T\u1EA1o t\u00E0i kho\u1EA3n" })] }), _jsx("div", { className: "pcas1r2", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "H\u1ECD v\u00E0 T\u00EAn" }), _jsx("th", { className: "table-head-cell", children: "Email" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: childAccounts?.map((childAccount) => (_jsxs("tr", { children: [_jsx("td", { className: "table-body-cell", children: childAccount.username }), _jsx("td", { className: "table-body-cell", children: childAccount.email }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { onClick: () => handleViewDetail(childAccount.studentId), className: "pr-btn", children: "Chi ti\u1EBFt" }) })] }, childAccount.studentId))) })] }) })] })) : (_jsxs("div", { className: `pca-step-1 step ${isStep === 1 ? "step-active" : "step-hidden"}`, children: [_jsxs("div", { className: "pcas1r1", children: [_jsx("h3", { children: "Chi ti\u1EBFt t\u00E0i kho\u1EA3n c\u1EE7a con" }), _jsx("button", { className: "pr-btn", onClick: handleBack, children: "Quay l\u1EA1i" })] }), _jsxs("div", { className: "pcas1r2 pcas1r2-detail", children: [_jsx("div", { className: "pcas1r2dc1", children: _jsx("img", { src: childAccount?.avatarUrl, alt: "" }) }), _jsxs("div", { className: "pcas1r2dc2", children: [_jsx("h4", { children: "H\u1ECD v\u00E0 t\u00EAn:" }), _jsx("p", { children: childAccount?.username }), _jsx("h4", { children: "Email:" }), _jsx("p", { children: childAccount?.email }), _jsx("h4", { children: "Ng\u00E0y sinh:" }), _jsx("p", { children: childAccount?.dateOfBirth ||
                                                "Chưa cập nhật" }), _jsx("h4", { children: "Gi\u1EDBi t\u00EDnh:" }), _jsx("p", { children: childAccount?.gender ||
                                                "Chưa cập nhật" }), _jsx("h4", { children: "Tr\u00ECnh \u0111\u1ED9 h\u1ECDc v\u1EA5n:" }), _jsx("p", { children: childAccount?.educationLevel ||
                                                "Chưa cập nhật" }), _jsx("h4", { children: "M\u00F4n h\u1ECDc y\u00EAu th\u00EDch:" }), _jsx("p", { children: childAccount?.preferredSubjects }), _jsx("h4", { children: "M\u1ED1i quan h\u1EC7:" }), _jsx("p", { children: childAccount?.relationship })] })] })] })) })), isStep === 2 && (_jsxs("div", { className: `pca-step-2 step ${isStep === 2 ? "step-active" : "step-hidden"}`, children: [_jsx("button", { className: "sc-btn", onClick: handlePrevStep, children: "Quay l\u1EA1i" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: handleSubmit, children: ({ isSubmitting, setFieldValue }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaUser, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "username", className: "form-input", placeholder: "Nh\u1EADp h\u1ECD v\u00E0 t\u00EAn" })] }), _jsx(ErrorMessage, { name: "username", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaEnvelope, { className: "form-input-icon" }), _jsx(Field, { type: "email", name: "email", className: "form-input", placeholder: "Nh\u1EADp email" })] }), _jsx(ErrorMessage, { name: "email", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u1EADt kh\u1EA9u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaLock, { className: "form-input-icon" }), _jsx(Field, { type: "password", name: "initialPassword", className: "form-input", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u" })] }), _jsx(ErrorMessage, { name: "initialPassword", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaMapMarkerAlt, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "address", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9" })] }), _jsx(ErrorMessage, { name: "address", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u1ED1i quan h\u1EC7" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaUserFriends, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "relationship", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn m\u1ED1i quan h\u1EC7 --" }), _jsx("option", { value: "Cha/Con", children: "Cha/Con" }), _jsx("option", { value: "M\u1EB9/Con", children: "M\u1EB9/Con" }), _jsx("option", { value: "Anh/Em", children: "Anh/Em" }), _jsx("option", { value: "Ch\u1ECB/Em", children: "Ch\u1ECB/Em" })] })] }), _jsx(ErrorMessage, { name: "relationship", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsxs("div", { className: "form-input-container", children: [_jsx(FaPhoneAlt, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "phone", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i" })] }), _jsx(ErrorMessage, { name: "phone", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineLeaderboard, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "educationLevelId", className: "form-input", onChange: (e) => handleLevelChange(e, setFieldValue), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn c\u1EA5p \u0111\u1ED9 --" }), _jsx("option", { value: "Ti\u1EC3u h\u1ECDc", children: "Ti\u1EC3u h\u1ECDc" }), _jsx("option", { value: "Trung h\u1ECDc c\u01A1 s\u1EDF", children: "Trung h\u1ECDc c\u01A1 s\u1EDF" }), _jsx("option", { value: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng", children: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng" })] })] }), _jsx(ErrorMessage, { name: "educationLevelId", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx(MultiSelect, { label: "M\u00F4n h\u1ECDc y\u00EAu th\u00EDch", placeholder: "Ch\u1ECDn m\u00F4n h\u1ECDc y\u00EAu th\u00EDch", options: filteredSubjects, onChange: (selected) => setFieldValue("preferredSubjects", selected
                                                .map((s) => s.value)
                                                .join(", ")) }), _jsx(ErrorMessage, { name: "preferredSubjects", component: "p", className: "text-error" })] }), _jsx("button", { type: "submit", className: "pr-btn", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Tạo tài khoản") })] })) })] }))] }));
};
export default ParentChildAccount;
