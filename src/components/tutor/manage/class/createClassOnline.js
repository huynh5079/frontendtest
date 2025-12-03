import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createClassApiThunk } from "../../../../services/tutor/class/classThunk";
import { useAppDispatch } from "../../../../app/store";
import { get } from "lodash";
import { toast } from "react-toastify";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { DatePickerElement, LoadingSpinner, WeekCalendarCreateClass, } from "../../../elements";
// Validation schema
const ClassOfflineSchema = Yup.object().shape({
    price: Yup.number()
        .typeError("Học phí phải là số")
        .min(200000, "Tối thiểu 200.000 VND")
        .required("Vui lòng nhập học phí"),
    classStartDate: Yup.date().required("Vui lòng chọn ngày bắt đầu học"),
});
const CreateClassOnline = ({ infoTutor, startDateStudy, setStartDateStudy, busySchedules, }) => {
    const dispatch = useAppDispatch();
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [sessionsPerWeek, setSessionsPerWeek] = useState("");
    // Số buổi học — người dùng tự nhập
    const handleSessionsChange = (e) => {
        const value = e.target.value;
        const numberValue = parseInt(value, 10);
        setSessionsPerWeek(value === "" ? "" : numberValue);
    };
    // Formik initial values
    const initialValues = {
        subject: infoTutor?.subject || "",
        educationLevel: infoTutor?.educationLevel || "",
        description: infoTutor?.description || "",
        location: "",
        price: 0, // 🔹 Người dùng tự nhập
        mode: "Offline",
        classStartDate: "",
        onlineStudyLink: "",
        title: infoTutor?.title || "",
        scheduleRules: [],
        studentLimit: infoTutor?.studentLimit || 0,
    };
    // Submit
    const handleSubmit = async (values, helpers) => {
        const payload = {
            ...values,
            classStartDate: startDateStudy
                ? startDateStudy.toISOString()
                : new Date().toISOString(),
            price: values.price, // 🔹 lấy đúng giá do người dùng nhập
            scheduleRules: selectedSchedules,
        };
        await dispatch(createClassApiThunk(payload))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.message", "Tạo thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            helpers.setSubmitting(false);
            navigateHook(routes.tutor.class.list);
        });
    };
    return (_jsx(Formik, { initialValues: initialValues, validationSchema: ClassOfflineSchema, enableReinitialize: true, onSubmit: handleSubmit, children: ({ setFieldValue, isSubmitting }) => {
            const isSlotValid = sessionsPerWeek !== "" &&
                selectedSchedules.length === sessionsPerWeek;
            return (_jsxs(Form, { children: [_jsxs("div", { className: "form form-2", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 bu\u1ED5i trong m\u1ED9t tu\u1EA7n" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx("input", { type: "number", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 bu\u1ED5i trong m\u1ED9t tu\u1EA7n", min: 1, max: 7, value: sessionsPerWeek, onChange: handleSessionsChange })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECDc ph\u00ED 1 th\u00E1ng" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "price", type: "number", className: "form-input", placeholder: "Nh\u1EADp h\u1ECDc ph\u00ED 1 th\u00E1ng", min: 0 })] }), _jsx(ErrorMessage, { name: "price", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Link h\u1ECDc tr\u1EF1c tuy\u1EBFn" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "onlineStudyLink", type: "text", className: "form-input", placeholder: "Nh\u1EADp Link h\u1ECDc tr\u1EF1c tuy\u1EBFn h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "onlineStudyLink", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y mong mu\u1ED1n b\u1EAFt \u0111\u1EA7u h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(DatePickerElement, { placeholder: "Ch\u1ECDn ng\u00E0y b\u1EAFt \u0111\u1EA7u h\u1ECDc", value: startDateStudy, onChange: (date) => {
                                                    setStartDateStudy(date);
                                                    setFieldValue("classStartDate", date);
                                                } })] }), _jsx(ErrorMessage, { name: "classStartDate", component: "div", className: "text-error" })] })] }), _jsx(WeekCalendarCreateClass, { busySchedules: busySchedules, onSelectedChange: setSelectedSchedules, sessionsPerWeek: sessionsPerWeek }), sessionsPerWeek !== "" && !isSlotValid && (_jsxs("div", { className: "text-error", children: ["\u26A0 Vui l\u00F2ng ch\u1ECDn \u0111\u00FAng ", sessionsPerWeek, " bu\u1ED5i trong tu\u1EA7n"] })), _jsx("div", { className: "form-submit", children: _jsx("button", { type: "submit", className: isSubmitting
                                ? "disable-btn"
                                : "pr-btn payment-btn", disabled: !isSlotValid, children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Đặt lịch" }) })] }));
        } }));
};
export default CreateClassOnline;
