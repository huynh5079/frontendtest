import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiCalendar, CiText, CiStickyNote } from "react-icons/ci";
import Modal from "./modal";
import { DateTimePickerElement } from "../elements";
import { useAppDispatch } from "../../app/store";
import { deleteAvailabilityBlockForTutorApiThunk, getAllAvailabilityBlockForTutorApiThunk, } from "../../services/tutor/availabilityBlock/tutorAvailabilityBlockThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { useEffect } from "react";
import dayjs from "dayjs";
const CreateAvailabilitySchema = Yup.object().shape({
    title: Yup.string().required("Vui lòng nhập tiêu đề"),
    startTime: Yup.date().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.date()
        .required("Vui lòng chọn thời gian kết thúc")
        .min(Yup.ref("startTime"), "Thời gian kết thúc phải sau thời gian bắt đầu"),
    notes: Yup.string().optional(),
});
const DeleteAvailabilityBlockForTutorModal = ({ isOpen, setIsOpen, startDateProps, endDateProps, selectedAvailabilityBlock, }) => {
    const initialValues = {
        title: "",
        startTime: selectedAvailabilityBlock?.startTime || "",
        endTime: selectedAvailabilityBlock?.endTime || "",
        notes: "",
        recurrenceRule: null,
    };
    useEffect(() => {
        if (selectedAvailabilityBlock) {
            if (selectedAvailabilityBlock.startTime) {
                setStartDate(dayjs(selectedAvailabilityBlock.startTime).toDate());
            }
            if (selectedAvailabilityBlock.endTime) {
                setEndDate(dayjs(selectedAvailabilityBlock.endTime).toDate());
            }
        }
    }, [selectedAvailabilityBlock]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const dispatch = useAppDispatch();
    const handleSubmit = async (values) => {
        console.log(values);
    };
    const handleDelete = async () => {
        await dispatch(deleteAvailabilityBlockForTutorApiThunk(selectedAvailabilityBlock?.id.toLowerCase()))
            .unwrap()
            .then((res) => {
            const message = get(res, "message", "Xử lí thành công");
            toast.success(message);
            setIsOpen(false);
            dispatch(getAllAvailabilityBlockForTutorApiThunk({
                startTime: startDateProps,
                endTime: endDateProps,
            }));
        })
            .catch((error) => {
            const errorData = get(error, "message", "Có lỗi xảy ra");
            toast.error(errorData);
        });
    };
    return (_jsx(Modal, { isOpen: isOpen, setIsOpen: setIsOpen, children: _jsx("section", { id: "delete-availability-block-for-tutor-modal-section", children: _jsxs("div", { className: "dabftm-container", children: [_jsx("h2", { children: "T\u1EA1o l\u1ECBch b\u1EADn" }), _jsx(Formik, { initialValues: initialValues, validationSchema: CreateAvailabilitySchema, onSubmit: handleSubmit, children: ({ setFieldValue, isSubmitting }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ti\u00EAu \u0111\u1EC1" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiText, { className: "form-input-icon" }), _jsx(Field, { name: "title", placeholder: "Nh\u1EADp ti\u00EAu \u0111\u1EC1...", className: "form-input" })] }), _jsx(ErrorMessage, { name: "title", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Th\u1EDDi gian b\u1EAFt \u0111\u1EA7u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendar, { className: "form-input-icon" }), _jsx(DateTimePickerElement, { value: startDate, onChange: (date) => {
                                                        setStartDate(date);
                                                        setFieldValue("startTime", date);
                                                    }, placeholder: "Ch\u1ECDn th\u1EDDi gian b\u1EAFt \u0111\u1EA7u" })] }), _jsx(ErrorMessage, { name: "startTime", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Th\u1EDDi gian k\u1EBFt th\u00FAc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiCalendar, { className: "form-input-icon" }), _jsx(DateTimePickerElement, { value: endDate, onChange: (date) => {
                                                        setEndDate(date);
                                                        setFieldValue("endTime", date);
                                                    }, placeholder: "Ch\u1ECDn th\u1EDDi gian k\u1EBFt th\u00FAc" })] }), _jsx(ErrorMessage, { name: "endTime", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ghi ch\u00FA (tu\u1EF3 ch\u1ECDn)" }), _jsxs("div", { className: "form-input-container", children: [_jsx(CiStickyNote, { className: "form-input-icon" }), _jsx(Field, { as: "textarea", name: "notes", placeholder: "Nh\u1EADp ghi ch\u00FA...", className: "form-input", rows: 3 })] })] }), _jsxs("div", { className: "group-btn", children: [_jsx("div", { className: "sc-btn", onClick: handleDelete, children: "Xo\u00E1" }), _jsx("button", { type: "submit", className: "pr-btn", children: isSubmitting
                                                ? "Đang cập nhật"
                                                : "Cập nhật" })] })] })) })] }) }) }));
};
export default DeleteAvailabilityBlockForTutorModal;
