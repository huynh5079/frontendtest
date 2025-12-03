import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "lodash";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { selectDetailClassRequestForStudent, selectListApplyRequestFindTutorForStudent, selectListClassRequestForStudent, } from "../../../app/selector";
import { createClassRequestForStudentApiThunk, getAllClassRequestForStudentApiThunk, getDetailClassRequestForStudentApiThunk, } from "../../../services/student/bookingTutor/bookingTutorThunk";
import { acceptApplyRequestFindTutorForStudentApiThunk, getAllApplyRequestFindTutorForStudentApiThunk, rejectApplyRequestFindTutorForStudentApiThunk, } from "../../../services/student/requestFindTutor/requestFindTutorThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { DatePickerElement, LoadingSpinner, WeekCalendarFindTutor, } from "../../elements";
import { CancelBookingTutorForStudent, UpdateRequestFindTutorForStudentModal, } from "../../modal";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
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
const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
];
const StudentRequestFindTutor = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const bookingTutors = useAppSelector(selectListClassRequestForStudent)?.filter((b) => !b.tutorName);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);
    const applyRequests = useAppSelector(selectListApplyRequestFindTutorForStudent);
    const [isStep, setIsStep] = useState(1);
    const [level, setLevel] = useState("");
    const [_, setSubject] = useState("");
    const [classOptions, setClassOptions] = useState([]);
    const [sessionsPerWeek, setSessionsPerWeek] = useState("");
    const [tuitionFee, setTuitionFee] = useState(0);
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] = useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] = useState(false);
    // === EFFECTS ===
    useEffect(() => {
        dispatch(getAllClassRequestForStudentApiThunk());
    }, [dispatch]);
    useEffect(() => {
        if (id)
            dispatch(getDetailClassRequestForStudentApiThunk(id));
    }, [dispatch, id]);
    useEffect(() => {
        if (id && bookingTutor?.status === "Pending")
            dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id));
    }, [dispatch, id, bookingTutor]);
    useDocumentTitle("Danh sách đơn tìm gia sư");
    // === HANDLERS ===
    const handleNextStep = () => setIsStep((prev) => prev + 1);
    const handlePrevStep = () => setIsStep((prev) => prev - 1);
    const handleBack = () => navigate(`/student/information?tab=request`);
    const handleViewDetail = (id) => navigate(`/student/information?tab=request&id=${id}`);
    const handleLevelChange = (value) => {
        setLevel(value);
        setSubject("");
        setClassOptions(value === "Tiểu học"
            ? Array.from({ length: 5 }, (_, i) => `Lớp ${i + 1}`)
            : value === "Trung học cơ sở"
                ? Array.from({ length: 4 }, (_, i) => `Lớp ${i + 6}`)
                : value === "Trung học phổ thông"
                    ? Array.from({ length: 3 }, (_, i) => `Lớp ${i + 10}`)
                    : []);
    };
    const handleSubjectChange = (value) => setSubject(value);
    const handleSessionsChange = (e, setFieldValue) => {
        const value = e.target.value;
        const numberValue = parseInt(value, 10);
        setSessionsPerWeek(value === "" ? "" : numberValue);
        const fee = numberValue === 2
            ? 800000
            : numberValue === 3
                ? 1000000
                : numberValue === 4
                    ? 1200000
                    : 0;
        setTuitionFee(fee);
        // cập nhật trực tiếp budget trong Formik
        setFieldValue("budget", fee);
    };
    const handleAcceptApply = async (applyId) => {
        await dispatch(acceptApplyRequestFindTutorForStudentApiThunk(applyId))
            .unwrap()
            .then((res) => toast.success(get(res, "data.message", "Xử lí thành công")))
            .catch((err) => toast.error(get(err, "data.message", "Có lỗi xảy ra")))
            .finally(() => dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id)));
    };
    const handleRejectApply = async (applyId) => {
        await dispatch(rejectApplyRequestFindTutorForStudentApiThunk(applyId))
            .unwrap()
            .then((res) => toast.success(get(res, "data.message", "Xử lí thành công")))
            .catch((err) => toast.error(get(err, "data.message", "Có lỗi xảy ra")))
            .finally(() => dispatch(getAllApplyRequestFindTutorForStudentApiThunk(id)));
    };
    const getStatusText = (status) => {
        switch (status) {
            case "Pending":
                return "Chờ xử lý";
            case "Approved":
            case "Accepted":
                return "Đã chấp thuận";
            case "Rejected":
                return "Đã từ chối";
            case "Ongoing":
                return "Đang học";
            default:
                return "Không có";
        }
    };
    // === FORM INITIAL & VALIDATION ===
    const initialValues = {
        studentUserId: null,
        tutorId: null,
        subject: "",
        educationLevel: "",
        description: "",
        location: "",
        budget: tuitionFee,
        mode: "Offline",
        classStartDate: "",
        specialRequirements: "",
        schedules: [],
    };
    const validationSchema = Yup.object({
        subject: Yup.string().required("Vui lòng chọn môn học"),
        educationLevel: Yup.string().required("Vui lòng chọn lớp"),
        description: Yup.string().required("Vui lòng nhập mô tả"),
        location: Yup.string().when("mode", {
            is: "Offline",
            then: (s) => s.required("Vui lòng nhập địa chỉ học"),
        }),
        mode: Yup.string()
            .oneOf(["Offline", "Online"])
            .required("Vui lòng chọn hình thức học"),
        classStartDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
        budget: Yup.number().min(0, "Học phí phải >= 0"),
        schedules: Yup.array()
            .of(Yup.object().shape({
            dayOfWeek: Yup.number().required(),
            startTime: Yup.string().required(),
            endTime: Yup.string().required(),
        }))
            .min(1, "Vui lòng chọn lịch đúng số buổi"),
    });
    return (_jsxs("div", { className: "student-request-find-tutor", children: [isStep === 1 && (_jsx("div", { className: `srft-step-1 step ${isStep === 1 ? "step-active" : "step-hidden"}`, children: !id ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "srfts1r1", children: [_jsx("h3", { children: "Danh s\u00E1ch \u0111\u01A1n t\u00ECm gia s\u01B0" }), _jsx("button", { className: "pr-btn", onClick: handleNextStep, children: "T\u1EA1o \u0111\u01A1n" })] }), _jsx("div", { className: "srfts1r2", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "M\u00F4n h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian \u0111\u1EB7t l\u1ECBch" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: bookingTutors?.map((bookingTutor) => (_jsxs("tr", { children: [_jsx("td", { className: "table-body-cell", children: bookingTutor.subject }), _jsx("td", { className: "table-body-cell", children: bookingTutor.educationLevel }), _jsx("td", { className: "table-body-cell", children: formatDate(bookingTutor.createdAt) }), _jsxs("td", { className: "table-body-cell", children: [_jsx("button", { className: "pr-btn", onClick: () => handleViewDetail(bookingTutor.id), children: "Chi ti\u1EBFt" }), _jsx("button", { className: "delete-btn", onClick: () => setIsCancelBookingTutorModalOpen(true), children: "Hu\u1EF7 l\u1ECBch" })] })] }, bookingTutor.id))) })] }) })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "srfts1r1", children: [_jsx("h3", { children: "Chi ti\u1EBFt l\u1ECBch \u0111\u1EB7t gia s\u01B0" }), _jsx("button", { className: "pr-btn", onClick: handleBack, children: "Quay l\u1EA1i" })] }), _jsxs("div", { className: "detail-request-find-tutor", children: [_jsxs("div", { className: "drftc1", children: [_jsx("h4", { children: "H\u1ECDc sinh" }), _jsx("p", { children: bookingTutor?.studentName }), _jsx("h4", { children: "M\u00F4 t\u1EA3" }), _jsx("p", { children: bookingTutor?.description }), bookingTutor?.mode === "Offline" && (_jsxs(_Fragment, { children: [_jsx("h4", { children: "\u0110\u1ECBa \u0111i\u1EC3m" }), _jsx("p", { children: bookingTutor?.location })] })), _jsx("h4", { children: "Y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" }), _jsx("p", { children: bookingTutor?.specialRequirements }), _jsx("h4", { children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsx("p", { children: formatDate(String(bookingTutor?.classStartDate)) }), _jsx("h4", { children: "Ng\u00E0y h\u1EBFt h\u1EA1n" }), _jsx("p", { children: formatDate(String(bookingTutor?.expiryDate)) }), _jsx("h4", { children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { children: formatDate(String(bookingTutor?.createdAt)) })] }), _jsxs("div", { className: "drftc2", children: [_jsx("h4", { children: "M\u00F4n h\u1ECDc" }), _jsx("p", { children: bookingTutor?.subject }), _jsx("h4", { children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("p", { children: bookingTutor?.educationLevel }), _jsx("h4", { children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsx("p", { children: bookingTutor?.mode }), _jsx("h4", { children: "H\u1ECDc ph\u00ED" }), _jsxs("p", { children: [bookingTutor?.budget?.toLocaleString(), " ", "VN\u0110"] }), _jsx("h4", { children: "Tr\u1EA1ng th\u00E1i" }), _jsx("p", { children: getStatusText(bookingTutor?.status) }), _jsx("h4", { children: "L\u1ECBch h\u1ECDc" }), bookingTutor?.schedules?.map((s, index) => (_jsxs("div", { children: [_jsx("h4", { children: daysOfWeek[s.dayOfWeek] }), _jsxs("p", { children: [s.startTime, " \u2192 ", s.endTime] })] }, index)))] })] }), _jsxs("div", { className: "srfts1r2", children: [_jsx("h3", { children: "Danh s\u00E1ch \u1EE9ng tuy\u1EC3n" }), _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "T\u00EAn gia s\u01B0" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian \u1EE9ng tuy\u1EC3n" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: applyRequests?.map((applyRequest) => (_jsxs("tr", { children: [_jsx("td", { className: "table-body-cell", children: applyRequest.tutorName }), _jsx("td", { className: "table-body-cell", children: getStatusText(applyRequest.status) }), _jsx("td", { className: "table-body-cell", children: formatDate(applyRequest.createdAt) }), _jsxs("td", { className: "table-body-cell", children: [applyRequest.status ===
                                                                "Pending" && (_jsxs(_Fragment, { children: [_jsx("button", { className: "pr-btn", onClick: () => {
                                                                            handleAcceptApply(applyRequest.id);
                                                                        }, children: "Ch\u1EA5p thu\u1EADn" }), _jsx("button", { className: "delete-btn", onClick: () => {
                                                                            handleRejectApply(applyRequest.id);
                                                                        }, children: "T\u1EEB ch\u1ED1i" })] })), _jsx("button", { className: "sc-btn", onClick: () => { }, children: "Chi ti\u1EBFt gia s\u01B0" })] })] }, applyRequest.id))) })] })] }), _jsxs("div", { className: "group-btn", children: [_jsx("button", { className: "pr-btn", onClick: () => setIsUpdateBookingTutorModalOpen(true), children: "C\u1EADp nh\u1EADt" }), _jsx("button", { className: "sc-btn", onClick: handleBack, children: "Quay l\u1EA1i" }), _jsx("button", { className: "delete-btn", onClick: () => setIsCancelBookingTutorModalOpen(true), children: "Hu\u1EF7 l\u1ECBch" })] }), _jsx(UpdateRequestFindTutorForStudentModal, { isOpen: isUpdateBookingTutorModalOpen, setIsOpen: setIsUpdateBookingTutorModalOpen, selectedBooking: bookingTutor }), _jsx(CancelBookingTutorForStudent, { isOpen: isCancelBookingTutorModalOpen, setIsOpen: setIsCancelBookingTutorModalOpen, requestId: String(bookingTutor?.id) })] })) })), isStep === 2 && (_jsxs("div", { className: `srft-step-2 step ${isStep === 2 ? "step-active" : "step-hidden"}`, children: [_jsx("div", { className: "sc-btn", onClick: handlePrevStep, children: "Quay l\u1EA1i" }), _jsx(Formik, { initialValues: initialValues, validationSchema: validationSchema, onSubmit: (values, { setSubmitting }) => {
                            setSubmitting(true);
                            dispatch(createClassRequestForStudentApiThunk(values))
                                .unwrap()
                                .then((res) => toast.success(get(res, "data.message", "Gửi thành công")))
                                .catch((err) => toast.error(get(err, "data.message", "Có lỗi xảy ra")))
                                .finally(() => {
                                setSubmitting(false);
                                navigateHook(routes.student.home);
                            });
                        }, children: ({ values, setFieldValue, isSubmitting }) => {
                            const isSlotValid = values.schedules.length === sessionsPerWeek &&
                                sessionsPerWeek > 0;
                            return (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs("select", { className: "form-input", value: level, onChange: (e) => handleLevelChange(e.target
                                                            .value), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn c\u1EA5p b\u1EADc --" }), _jsx("option", { value: "Ti\u1EC3u h\u1ECDc", children: "Ti\u1EC3u h\u1ECDc" }), _jsx("option", { value: "Trung h\u1ECDc c\u01A1 s\u1EDF", children: "Trung h\u1ECDc c\u01A1 s\u1EDF" }), _jsx("option", { value: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng", children: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng" })] })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4n h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "subject", className: "form-input", onChange: (e) => {
                                                            handleSubjectChange(e.target.value);
                                                            setFieldValue("subject", e.target.value);
                                                        }, children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn m\u00F4n h\u1ECDc --" }), level &&
                                                                subjectsByLevel[level].map((subj) => (_jsx("option", { value: subj, children: subj }, subj)))] })] }), _jsx(ErrorMessage, { name: "subject", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "L\u1EDBp" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "educationLevel", className: "form-input", children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn l\u1EDBp --" }), classOptions.map((cls) => (_jsx("option", { value: cls, children: cls }, cls)))] })] }), _jsx(ErrorMessage, { name: "educationLevel", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "S\u1ED1 bu\u1ED5i trong m\u1ED9t tu\u1EA7n" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx("input", { type: "number", className: "form-input", min: 1, max: 7, value: sessionsPerWeek, onChange: (e) => handleSessionsChange(e, setFieldValue), placeholder: "Nh\u1EADp s\u1ED1 bu\u1ED5i trong m\u1ED9t tu\u1EA7n (2\u20134)" })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u1ECDc ph\u00ED 1 th\u00E1ng" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { type: "text", className: "form-input", value: tuitionFee
                                                            ? tuitionFee.toLocaleString("vi-VN") + " VND"
                                                            : "", readOnly: true, placeholder: "H\u1ECDc ph\u00ED s\u1EBD t\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt" })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "M\u00F4 t\u1EA3" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "description", className: "form-input", placeholder: "Nh\u1EADp m\u00F4 t\u1EA3" })] }), _jsx(ErrorMessage, { name: "description", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "specialRequirements", className: "form-input", placeholder: "Nh\u1EADp y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" })] }), _jsx(ErrorMessage, { name: "specialRequirements", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(DatePickerElement, { placeholder: "Ch\u1ECDn ng\u00E0y b\u1EAFt \u0111\u1EA7u h\u1ECDc", value: values.classStartDate
                                                            ? new Date(values.classStartDate)
                                                            : null, onChange: (date) => setFieldValue("classStartDate", date?.toISOString() ||
                                                            "") })] }), _jsx(ErrorMessage, { name: "classStartDate", component: "div", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs(Field, { as: "select", name: "mode", className: "form-input", children: [_jsx("option", { value: "Offline", children: "H\u1ECDc t\u1EA1i nh\u00E0" }), _jsx("option", { value: "Online", children: "H\u1ECDc tr\u1EF1c tuy\u1EBFn" })] })] }), _jsx(ErrorMessage, { name: "mode", component: "div", className: "text-error" })] }), values.mode === "Offline" && (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Field, { type: "text", name: "location", className: "form-input", placeholder: "Nh\u1EADp \u0111\u1ECBa ch\u1EC9 h\u1ECDc" })] }), _jsx(ErrorMessage, { name: "location", component: "div", className: "text-error" })] })), _jsxs("div", { className: "calendar-container", children: [_jsx(WeekCalendarFindTutor, { onSelectedChange: (schedules) => setFieldValue("schedules", schedules), sessionsPerWeek: sessionsPerWeek }), sessionsPerWeek !== "" &&
                                                !isSlotValid && (_jsxs("div", { className: "text-error", children: ["\u26A0 Vui l\u00F2ng ch\u1ECDn \u0111\u00FAng", " ", sessionsPerWeek, " bu\u1ED5i trong tu\u1EA7n"] }))] }), _jsx("div", { className: "form-submit", children: _jsx("button", { type: "submit", className: isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn payment-btn", disabled: isSubmitting, children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đặt lịch") }) })] }));
                        } })] }))] }));
};
export default StudentRequestFindTutor;
