import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendar, CiText, CiStickyNote, CiRepeat } from "react-icons/ci";
import Modal from "./modal";
import { DateTimePickerElement, LoadingSpinner } from "../elements";
import dayjs from "dayjs";
import { useAppDispatch } from "../../app/store";
import { createAvailabilityBlockForTutorApiThunk, getAllAvailabilityBlockForTutorApiThunk, } from "../../services/tutor/availabilityBlock/tutorAvailabilityBlockThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
// Validation schema
const CreateAvailabilitySchema = Yup.object().shape({
    title: Yup.string().required("Vui lòng nhập tiêu đề"),
    startTime: Yup.date().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.date()
        .required("Vui lòng chọn thời gian kết thúc")
        .min(Yup.ref("startTime"), "Thời gian kết thúc phải sau thời gian bắt đầu"),
    notes: Yup.string().required("Vui lòng nhập ghi chú"),
    recurrenceRule: Yup.object()
        .shape({
        frequency: Yup.string()
            .oneOf(["Daily", "Weekly", "Monthly", "Yearly"])
            .required("Vui lòng chọn tần suất lặp lại"),
        daysOfWeek: Yup.array().when("frequency", {
            is: "Weekly",
            then: (schema) => schema.min(1, "Vui lòng chọn ít nhất một ngày trong tuần"),
            otherwise: (schema) => schema.min(1, "Vui lòng chọn một ngày"),
        }),
        untilDate: Yup.date().required("Vui lòng chọn ngày kết thúc lặp lại"),
    })
        .required("Vui lòng chọn quy tắc lặp lại"),
});
const weekdays = [
    { label: "Chủ nhật", value: "Sunday" },
    { label: "Thứ 2", value: "Monday" },
    { label: "Thứ 3", value: "Tuesday" },
    { label: "Thứ 4", value: "Wednesday" },
    { label: "Thứ 5", value: "Thursday" },
    { label: "Thứ 6", value: "Friday" },
    { label: "Thứ 7", value: "Saturday" },
];
const CreateAvailabilityBlockForTutorModal = ({ isOpen, setIsOpen, startDateProps, endDateProps }) => {
    const initialValues = {
        title: "",
        startTime: "",
        endTime: "",
        notes: "",
        recurrenceRule: {
            frequency: "Daily",
            daysOfWeek: [],
            untilDate: dayjs().add(1, "week").toISOString(),
        },
    };
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [untilDate, setUntilDate] = useState(dayjs().add(1, "week").toDate());
    const dispatch = useAppDispatch();
    const handleSubmit = async (values, helpers) => {
        const formattedValues = {
            ...values,
            startTime: startDate ? dayjs(startDate).format("HH:mm:ss") : "",
            endTime: endDate ? dayjs(endDate).format("HH:mm:ss") : "",
            recurrenceRule: {
                ...values.recurrenceRule,
                // Nếu Daily thì tự lấy ngày đầu tiên đã chọn
                daysOfWeek: values.recurrenceRule?.frequency === "Daily"
                    ? values.recurrenceRule?.daysOfWeek
                        ? [values.recurrenceRule.daysOfWeek[0]]
                        : []
                    : values.recurrenceRule?.daysOfWeek || [],
                untilDate: untilDate
                    ? dayjs(untilDate).format("YYYY-MM-DDTHH:mm:ss")
                    : "",
            },
        };
        dispatch(createAvailabilityBlockForTutorApiThunk(formattedValues))
            .unwrap()
            .then((res) => {
            toast.success(get(res, "data.message", "Xử lí thành công"));
            setIsOpen(false);
            dispatch(getAllAvailabilityBlockForTutorApiThunk({
                startTime: startDateProps,
                endTime: endDateProps,
            }));
            helpers.resetForm();
        })
            .catch((error) => {
            toast.error(get(error, "data.message", "Có lỗi xảy ra"));
        })
            .finally(() => {
            helpers.setSubmitting(false);
        });
    };
    return (_jsx(Modal, { isOpen: isOpen, setIsOpen: setIsOpen, children: _jsx("section", { id: "create-availability-block-for-tutor-modal-section", children: _jsxs("div", { className: "cabftm-container", children: [_jsx("h2", { children: "T\u1EA1o l\u1ECBch b\u1EADn" }), _jsx(Formik, { initialValues: initialValues, validationSchema: CreateAvailabilitySchema, onSubmit: handleSubmit, children: ({ setFieldValue, values, isSubmitting }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ti\u00EAu \u0111\u1EC1" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiText, { className: "form-input-icon" }), _jsx(Field, { name: "title", placeholder: "Nh\u1EADp ti\u00EAu \u0111\u1EC1...", className: "form-input" })] }), _jsx(ErrorMessage, { name: "title", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Th\u1EDDi gian b\u1EAFt \u0111\u1EA7u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendar, { className: "form-input-icon" }), _jsx(DateTimePickerElement, { value: startDate, onChange: (date) => {
                                                        setStartDate(date);
                                                        setFieldValue("startTime", date);
                                                    }, placeholder: "Ch\u1ECDn th\u1EDDi gian b\u1EAFt \u0111\u1EA7u" })] }), _jsx(ErrorMessage, { name: "startTime", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Th\u1EDDi gian k\u1EBFt th\u00FAc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendar, { className: "form-input-icon" }), _jsx(DateTimePickerElement, { value: endDate, onChange: (date) => {
                                                        setEndDate(date);
                                                        setFieldValue("endTime", date);
                                                    }, placeholder: "Ch\u1ECDn th\u1EDDi gian k\u1EBFt th\u00FAc" })] }), _jsx(ErrorMessage, { name: "endTime", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "L\u1EB7p l\u1EA1i" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiRepeat, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "recurrenceRule.frequency", className: "form-input", onChange: (e) => {
                                                        const freq = e.target.value;
                                                        setFieldValue("recurrenceRule", {
                                                            frequency: freq,
                                                            daysOfWeek: [],
                                                            untilDate: untilDate?.toISOString(),
                                                        });
                                                    }, value: values.recurrenceRule?.frequency, children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn t\u1EA7n su\u1EA5t --" }), _jsx("option", { value: "Daily", children: "H\u1EB1ng ng\u00E0y" }), _jsx("option", { value: "Weekly", children: "H\u1EB1ng tu\u1EA7n" }), _jsx("option", { value: "Monthly", children: "H\u1EB1ng th\u00E1ng" }), _jsx("option", { value: "Yearly", children: "H\u1EB1ng n\u0103m" })] })] }), _jsx(ErrorMessage, { name: "recurrenceRule.frequency", component: "div", className: "text-error" })] }), values.recurrenceRule?.frequency && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: values.recurrenceRule.frequency ===
                                                "Weekly"
                                                ? "Chọn ngày trong tuần"
                                                : "Chọn ngày bắt đầu" }), _jsx("div", { className: "days-checkbox-group", children: weekdays.map((day) => {
                                                const checked = values.recurrenceRule?.daysOfWeek?.includes(day.value);
                                                return (_jsxs("label", { className: "checkbox-item", children: [_jsx("input", { type: "checkbox", checked: checked, onChange: (e) => {
                                                                const prev = values
                                                                    .recurrenceRule
                                                                    ?.daysOfWeek ||
                                                                    [];
                                                                let updated = [];
                                                                if (values
                                                                    .recurrenceRule
                                                                    ?.frequency ===
                                                                    "Daily") {
                                                                    updated = e
                                                                        .target
                                                                        .checked
                                                                        ? [
                                                                            day.value,
                                                                        ]
                                                                        : [];
                                                                }
                                                                else {
                                                                    updated = e
                                                                        .target
                                                                        .checked
                                                                        ? Array.from(new Set([
                                                                            ...prev,
                                                                            day.value,
                                                                        ]))
                                                                        : prev.filter((d) => d !==
                                                                            day.value);
                                                                }
                                                                setFieldValue("recurrenceRule.daysOfWeek", updated);
                                                            } }), day.label] }, day.value));
                                            }) }), _jsx(ErrorMessage, { name: "recurrenceRule.daysOfWeek", component: "div", className: "text-error" })] })), values.recurrenceRule && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y k\u1EBFt th\u00FAc l\u1EB7p l\u1EA1i" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendar, { className: "form-input-icon" }), _jsx(DateTimePickerElement, { value: untilDate, onChange: (date) => {
                                                        setUntilDate(date);
                                                        setFieldValue("recurrenceRule.untilDate", date);
                                                    }, placeholder: "Ch\u1ECDn ng\u00E0y k\u1EBFt th\u00FAc l\u1EB7p l\u1EA1i" })] }), _jsx(ErrorMessage, { name: "recurrenceRule.untilDate", component: "div", className: "text-error" })] })), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ghi ch\u00FA" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiStickyNote, { className: "form-input-icon" }), _jsx(Field, { as: "textarea", name: "notes", placeholder: "Nh\u1EADp ghi ch\u00FA...", className: "form-input", rows: 3 })] }), _jsx(ErrorMessage, { name: "notes", component: "div", className: "text-error" })] }), _jsxs("div", { className: "group-btn", children: [_jsx("button", { type: "button", className: "sc-btn", onClick: () => setIsOpen(false), children: "H\u1EE7y" }), _jsx("button", { type: "submit", className: isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Tạo lịch") })] })] })) })] }) }) }));
};
export default CreateAvailabilityBlockForTutorModal;
