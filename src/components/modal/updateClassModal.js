import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./modal";
import { MdAttachMoney, MdDescription, MdLinkOff, MdLocationOn, MdOutlineCastForEducation, MdPersonAdd, MdTitle, } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner, WeekCalendarUpdate } from "../elements";
import { convertScheduleStringToSchedule, formatDateToYMD, groupSchedulesByWeek, } from "../../utils/helper";
import { getAllTutorScheduleApiThunk } from "../../services/booking/bookingThunk";
import { selectListTutorSchedule } from "../../app/selector";
import { getDetailClassApiThunk, updateInfoClassForTutorApiThunk, updateScheduleClassForTutorApiThunk, } from "../../services/tutor/class/classThunk";
const UpdateClassModal = ({ selectedClass, isOpen, setIsOpen, }) => {
    const dispatch = useAppDispatch();
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    const tutorSchedules = useAppSelector(selectListTutorSchedule);
    const scheduleRulesNumber = convertScheduleStringToSchedule(selectedClass?.scheduleRules || []);
    const busySchedules = groupSchedulesByWeek(Array.isArray(tutorSchedules) ? tutorSchedules : []);
    useEffect(() => {
        if (selectedClass) {
            setSelectedSchedule(scheduleRulesNumber || []);
        }
    }, [selectedClass]);
    useEffect(() => {
        if (selectedClass?.tutorProfileId && selectedClass.classStartDate) {
            const start = formatDateToYMD(new Date(selectedClass.classStartDate));
            const endDate = new Date(selectedClass.classStartDate);
            endDate.setDate(endDate.getDate() + 30);
            const end = formatDateToYMD(endDate);
            dispatch(getAllTutorScheduleApiThunk({
                tutorProfileId: String(selectedClass?.tutorProfileId),
                startDate: start,
                endDate: end,
            }));
        }
    }, [dispatch, selectedClass]);
    const initialValues = {
        title: selectedClass?.title || "",
        description: selectedClass?.description || "",
        price: selectedClass?.price || 0,
        location: selectedClass?.location || "",
        mode: selectedClass?.mode || "Offline",
        studentLimit: selectedClass?.studentLimit || 0,
        onlineStudyLink: selectedClass?.onlineStudyLink || null,
    };
    const validationSchema = Yup.object().shape({
        description: Yup.string().required("Vui lòng nhập mô tả"),
        title: Yup.string().required("Vui lòng nhập tố mô tả"),
        price: Yup.number().required("Vui lòng nhập giá học"),
        studentLimit: Yup.number().required("Vui lòng nhập số lượng học sinh tối đa"),
        mode: Yup.string()
            .oneOf(["Online", "Offline"])
            .required("Chọn hình thức học"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (schema) => schema.required("Vui lòng nhập địa chỉ học"),
            otherwise: (schema) => schema.notRequired(),
        }),
        onlineStudyLink: Yup.string().when("mode", {
            is: "Online",
            then: (schema) => schema.required("Vui lòng nhập đường liên kết lớp học"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });
    return (_jsx(Modal, { isOpen: isOpen, setIsOpen: setIsOpen, children: _jsxs("section", { id: "update-booking-tutor-for-student-modal", children: [_jsx("h3", { children: "C\u1EADp nh\u1EADt l\u1ECBch \u0111\u1EB7t gia s\u01B0 " }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: (values) => {
                        Promise.all([
                            dispatch(updateInfoClassForTutorApiThunk({
                                classId: String(selectedClass?.id),
                                params: values,
                            })),
                            dispatch(updateScheduleClassForTutorApiThunk({
                                classId: String(selectedClass?.id),
                                params: {
                                    scheduleRules: selectedSchedule,
                                },
                            })),
                        ])
                            .then((res) => {
                            const message = get(res, "data.message", "Cập nhật thành công");
                            toast.success(message);
                        })
                            .catch((error) => {
                            const errorData = get(error, "data.message", "Có lỗi xảy ra");
                            toast.error(errorData);
                        })
                            .finally(() => {
                            setIsOpen(false);
                            dispatch(getDetailClassApiThunk(selectedClass?.id || "")).unwrap();
                        });
                    }, children: ({ values, setFieldValue, isSubmitting }) => (_jsxs(Form, { children: [_jsxs("div", { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ch\u1EE7 \u0111\u1EC1" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdTitle, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "title", className: "form-input", placeholder: "Nh\u1EADp ch\u1EE7 \u0111\u1EC1" })] }), _jsx(ErrorMessage, { name: "title", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4 t\u1EA3" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdDescription, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "description", className: "form-input", placeholder: "Nh\u1EADp m\u00F4 t\u1EA3" })] }), _jsx(ErrorMessage, { name: "description", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 l\u01B0\u1EE3ng h\u1ECDc sinh t\u1ED1i \u0111a" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdPersonAdd, { className: "form-input-icon" }), _jsx(Field, { type: "number", min: "1", name: "studentLimit", className: "form-input", placeholder: "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1ECDc sinh t\u1ED1i \u0111a" })] }), _jsx(ErrorMessage, { name: "studentLimit", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECDc ph\u00ED 1 th\u00E1ng" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdAttachMoney, { className: "form-input-icon" }), _jsx(Field, { type: "number", name: "price", className: "form-input", placeholder: "Nh\u1EADp gi\u00E1 h\u1ECDc ph\u00ED", onChange: (e) => {
                                                            const val = Number(e.target.value);
                                                            setFieldValue("price", val >= 0 ? val : 0);
                                                        } })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineCastForEducation, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "mode", className: "form-input", children: [_jsx("option", { value: "Offline", children: "H\u1ECDc t\u1EA1i nh\u00E0" }), _jsx("option", { value: "Online", children: "H\u1ECDc tr\u1EF1c tuy\u1EBFn" })] })] }), _jsx(ErrorMessage, { name: "mode", component: "div", className: "text-error" })] }), values.mode === "Offline" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdLocationOn, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "location", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "location", component: "div", className: "text-error" })] })), values.mode === "Online" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u01B0\u1EDDng li\u00EAn k\u1EBFt l\u1EDBp h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdLinkOff, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "onlineStudyLink", className: "form-input", placeholder: "Nh\u1EADp \u0111\u01B0\u1EDDng li\u00EAn k\u1EBFt l\u1EDBp h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "onlineStudyLink", component: "div", className: "text-error" })] })), " "] }), _jsx("div", { className: "schedule-container", children: _jsx(WeekCalendarUpdate, { busySchedules: busySchedules, onSelectedChange: setSelectedSchedule, initialEvents: selectedSchedule }) }), _jsxs("div", { className: "group-btn", children: [_jsx("button", { type: "submit", className: isSubmitting ? "disable-btn" : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Cập nhật") }), _jsx("button", { type: "button", className: "sc-btn", onClick: () => setIsOpen(false), children: "Hu\u1EF7" })] })] })) })] }) }));
};
export default UpdateClassModal;
