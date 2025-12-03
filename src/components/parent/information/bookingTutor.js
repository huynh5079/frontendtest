import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectDetailClassRequestForStudent, selectListClassRequestForStudent, } from "../../../app/selector";
import { getAllClassRequestForStudentApiThunk, getDetailClassRequestForStudentApiThunk, } from "../../../services/student/bookingTutor/bookingTutorThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CancelBookingTutorForStudent, UpdateBookingTutorForStudentModal, } from "../../modal";
const ParentBookingTutor = () => {
    const dispatch = useAppDispatch();
    const bookingTutors = useAppSelector(selectListClassRequestForStudent)?.filter((bookingTutor) => bookingTutor.tutorName !== null);
    const bookingTutor = useAppSelector(selectDetailClassRequestForStudent);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [isUpdateBookingTutorModalOpen, setIsUpdateBookingTutorModalOpen] = useState(false);
    const [isCancelBookingTutorModalOpen, setIsCancelBookingTutorModalOpen] = useState(false);
    // Load danh sách
    useEffect(() => {
        dispatch(getAllClassRequestForStudentApiThunk());
    }, [dispatch]);
    // Load chi tiết khi có id
    useEffect(() => {
        if (id) {
            dispatch(getDetailClassRequestForStudentApiThunk(id));
        }
    }, [dispatch, id]);
    const handleViewDetail = (id) => {
        navigate(`/student/information?tab=booking_tutor&id=${id}`);
    };
    const handleBack = () => {
        navigate(`/student/information?tab=booking_tutor`);
    };
    // Bảng ngày trong tuần (0-6)
    const daysOfWeek = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
    ];
    const getStatusText = (status) => {
        switch (status) {
            case "Pending":
                return "Chờ xử lý";
            case "Approved":
                return "Đã chấp thuận";
            case "Rejected":
                return "Đã từ chối";
            default:
                return "Không có";
        }
    };
    useDocumentTitle("Danh sách lịch đặt gia sư");
    return (_jsxs("div", { className: "student-booking-tutor", children: [!id ? (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Danh s\u00E1ch l\u1ECBch \u0111\u1EB7t gia s\u01B0" }), _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "T\u00EAn gia s\u01B0" }), _jsx("th", { className: "table-head-cell", children: "M\u00F4n h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian \u0111\u1EB7t l\u1ECBch" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: bookingTutors?.map((bookingTutor) => (_jsxs("tr", { children: [_jsx("td", { className: "table-body-cell", children: bookingTutor.tutorName }), _jsx("td", { className: "table-body-cell", children: bookingTutor.subject }), _jsx("td", { className: "table-body-cell", children: bookingTutor.educationLevel }), _jsx("td", { className: "table-body-cell", children: formatDate(bookingTutor.createdAt) }), _jsxs("td", { className: "table-body-cell", children: [_jsx("button", { className: "pr-btn", onClick: () => handleViewDetail(bookingTutor.id), children: "Chi ti\u1EBFt" }), _jsx("button", { className: "delete-btn", onClick: () => setIsCancelBookingTutorModalOpen(true), children: "Hu\u1EF7 l\u1ECBch" })] })] }, bookingTutor.id))) })] })] })) : (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Chi ti\u1EBFt l\u1ECBch \u0111\u1EB7t gia s\u01B0" }), _jsxs("div", { className: "detail-booking-tutor", children: [_jsxs("div", { className: "dbtc1", children: [_jsx("h4", { children: "H\u1ECDc sinh" }), _jsx("p", { children: bookingTutor?.studentName }), _jsx("h4", { children: "Gia s\u01B0" }), _jsx("p", { children: bookingTutor?.tutorName }), _jsx("h4", { children: "M\u00F4 t\u1EA3" }), _jsx("p", { children: bookingTutor?.description }), _jsx("h4", { children: "\u0110\u1ECBa \u0111i\u1EC3m" }), _jsx("p", { children: bookingTutor?.location }), _jsx("h4", { children: "Y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" }), _jsx("p", { children: bookingTutor?.specialRequirements }), _jsx("h4", { children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsx("p", { children: formatDate(String(bookingTutor?.classStartDate)) }), _jsx("h4", { children: "Ng\u00E0y h\u1EBFt h\u1EA1n" }), _jsx("p", { children: formatDate(String(bookingTutor?.expiryDate)) }), _jsx("h4", { children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { children: formatDate(String(bookingTutor?.createdAt)) })] }), _jsxs("div", { className: "dbtc2", children: [_jsx("h4", { children: "M\u00F4n h\u1ECDc" }), _jsx("p", { children: bookingTutor?.subject }), _jsx("h4", { children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("p", { children: bookingTutor?.educationLevel }), _jsx("h4", { children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsx("p", { children: bookingTutor?.mode }), _jsx("h4", { children: "H\u1ECDc ph\u00ED" }), _jsxs("p", { children: [bookingTutor?.budget?.toLocaleString(), " VN\u0110"] }), _jsx("h4", { children: "Tr\u1EA1ng th\u00E1i" }), _jsx("p", { children: getStatusText(bookingTutor?.status) }), _jsx("h4", { children: "L\u1ECBch h\u1ECDc" }), bookingTutor?.schedules?.map((s, index) => (_jsxs("div", { children: [_jsx("h4", { children: daysOfWeek[s.dayOfWeek] }), _jsxs("p", { children: [s.startTime, " \u2192 ", s.endTime] })] }, index)))] })] }), _jsxs("div", { className: "group-btn mt-4", children: [_jsx("button", { className: "pr-btn", onClick: () => setIsUpdateBookingTutorModalOpen(true), children: "C\u1EADp nh\u1EADt" }), _jsx("button", { className: "sc-btn", onClick: handleBack, children: "Quay l\u1EA1i" }), _jsx("button", { className: "delete-btn", onClick: () => setIsCancelBookingTutorModalOpen(true), children: "Hu\u1EF7 l\u1ECBch" })] }), _jsx(UpdateBookingTutorForStudentModal, { isOpen: isUpdateBookingTutorModalOpen, setIsOpen: setIsUpdateBookingTutorModalOpen, selectedBooking: bookingTutor })] })), _jsx(CancelBookingTutorForStudent, { isOpen: isCancelBookingTutorModalOpen, setIsOpen: setIsCancelBookingTutorModalOpen, requestId: String(bookingTutor?.id) })] }));
};
export default ParentBookingTutor;
