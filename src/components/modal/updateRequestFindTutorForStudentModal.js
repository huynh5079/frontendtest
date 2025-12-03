import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./modal";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useAppDispatch } from "../../app/store";
import { getDetailClassRequestForStudentApiThunk, updateInfoClassRequestForStudentApiThunk, updateScheduleClassRequestForStudentApiThunk, } from "../../services/student/bookingTutor/bookingTutorThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner, WeekCalendarUpdateRequestFindTutor, } from "../elements";
const UpdateRequestFindTutorForStudentModal = ({ isOpen, setIsOpen, selectedBooking }) => {
    const dispatch = useAppDispatch();
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    useEffect(() => {
        if (selectedBooking) {
            setSelectedSchedule(selectedBooking.schedules || []);
        }
    }, [selectedBooking]);
    const initialValues = {
        description: selectedBooking?.description || "",
        budget: selectedBooking?.budget || 0,
        location: selectedBooking?.location || "",
        mode: selectedBooking?.mode || "Offline",
        onlineStudyLink: selectedBooking?.onlineStudyLink || null,
    };
    const validationSchema = Yup.object().shape({
        description: Yup.string().required("Vui lòng nhập mô tả"),
        mode: Yup.string()
            .oneOf(["Online", "Offline"])
            .required("Chọn hình thức học"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });
    return (_jsx(Modal, { isOpen: isOpen, setIsOpen: setIsOpen, children: _jsxs("section", { id: "update-booking-tutor-for-student-modal", children: [_jsx("h3", { children: "C\u1EADp nh\u1EADt l\u1ECBch \u0111\u1EB7t gia s\u01B0 " }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: (values) => {
                        Promise.all([
                            dispatch(updateInfoClassRequestForStudentApiThunk({
                                classRequestId: String(selectedBooking?.id),
                                params: values,
                            })),
                            dispatch(updateScheduleClassRequestForStudentApiThunk({
                                classRequestId: String(selectedBooking?.id),
                                params: selectedSchedule,
                            })),
                        ])
                            .then((res) => {
                            const message = get(res, "data.message", "Cập nhật thành công");
                            toast.success(message);
                            dispatch(getDetailClassRequestForStudentApiThunk(selectedBooking?.id));
                        })
                            .catch((error) => {
                            const errorData = get(error, "data.message", "Có lỗi xảy ra");
                            toast.error(errorData);
                        })
                            .finally(() => {
                            setIsOpen(false);
                            dispatch(getDetailClassRequestForStudentApiThunk(selectedBooking?.id || "")).unwrap();
                        });
                    }, children: ({ values, setFieldValue, isSubmitting }) => (_jsxs(Form, { children: [_jsxs("div", { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4 t\u1EA3" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "description", type: "text", className: "form-input", placeholder: "Nh\u1EADp m\u00F4 t\u1EA3" })] }), _jsx(ErrorMessage, { name: "description", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "mode", className: "form-input", onChange: (e) => setFieldValue("mode", e.target.value), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn h\u00ECnh th\u1EE9c h\u1ECDc --" }), _jsx("option", { value: "Offline", children: "H\u1ECDc t\u1EA1i nh\u00E0" }), _jsx("option", { value: "Online", children: "H\u1ECDc tr\u1EF1c tuy\u1EBFn" })] })] }), _jsx(ErrorMessage, { name: "mode", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECDc ph\u00ED 1 th\u00E1ng" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "budget", children: ({ field }) => (_jsx("input", { type: "text", className: "form-input", ...field, value: field.value.toLocaleString(), onChange: (e) => {
                                                                // chuyển string có dấu phẩy về number
                                                                const val = Number(e.target.value.replace(/,/g, ""));
                                                                field.onChange({
                                                                    target: {
                                                                        name: field.name,
                                                                        value: val,
                                                                    },
                                                                });
                                                            } })) })] })] }), values.mode === "Offline" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { name: "location", type: "text", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "location", component: "div", className: "text-error" })] }))] }), _jsx("div", { className: "schedule-container", children: _jsx(WeekCalendarUpdateRequestFindTutor, { onSelectedChange: setSelectedSchedule, initialEvents: selectedSchedule }) }), _jsxs("div", { className: "group-btn", children: [_jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Cập nhật") }), _jsx("button", { type: "button", className: "sc-btn", onClick: () => setIsOpen(false), children: "Hu\u1EF7" })] })] })) })] }) }));
};
export default UpdateRequestFindTutorForStudentModal;
