import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectDetailBookingForTutor } from "../../../app/selector";
import { acceptBookingForTutorApiThunk, getDetailBookingForTutorApiThunk, rejectBookingForTutorApiThunk, } from "../../../services/tutor/booking/bookingThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { toast } from "react-toastify";
import { get } from "lodash";
import { LoadingSpinner } from "../../../components/elements";
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
const DetailTutorBookingPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const booking = useAppSelector(selectDetailBookingForTutor);
    const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);
    useEffect(() => {
        if (id) {
            dispatch(getDetailBookingForTutorApiThunk(id));
        }
    }, [dispatch, id]);
    // Hàm hiển thị "Không có" nếu giá trị rỗng
    const show = (value) => {
        if (value === null || value === undefined || value === "")
            return "Không có";
        return String(value);
    };
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
    const handleAcceptBooking = async (bookingId) => {
        setIsSubmittingAccept(true);
        await dispatch(acceptBookingForTutorApiThunk(bookingId))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.message", "Xử lí thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            setIsSubmittingAccept(false);
            dispatch(getDetailBookingForTutorApiThunk(id));
        });
    };
    const handleRejectBooking = async (bookingId) => {
        setIsSubmittingReject(true);
        await dispatch(rejectBookingForTutorApiThunk(bookingId))
            .unwrap()
            .then((res) => {
            const message = get(res, "data.message", "Xử lí thành công");
            toast.success(message);
        })
            .catch((error) => {
            const errorData = get(error, "data.message", "Có lỗi xảy ra");
            toast.error(errorData);
        })
            .finally(() => {
            setIsSubmittingReject(false);
            dispatch(getDetailBookingForTutorApiThunk(id));
        });
    };
    useDocumentTitle("Chi tiết lịch đặt");
    return (_jsx("section", { id: "detail-tutor-booking-section", children: _jsxs("div", { className: "dtbs-container", children: [_jsxs("div", { className: "dtbscr1", children: [_jsx("h4", { children: "Chi ti\u1EBFt" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "L\u1ECBch \u0111\u1EB7t" })] })] }), _jsx("div", { className: "dtbscr3", children: _jsx("button", { className: "pr-btn", onClick: () => navigateHook(routes.tutor.booking.list), children: "Quay l\u1EA1i" }) }), _jsxs("div", { className: "dtbscr4", children: [_jsxs("div", { className: "dtbscr4r1", children: [_jsxs("div", { className: "dtbscr4r1c1", children: [_jsx("h4", { children: "H\u1ECDc sinh" }), _jsx("p", { children: show(booking?.studentName) }), _jsx("h4", { children: "Gia s\u01B0" }), _jsx("p", { children: show(booking?.tutorName) }), _jsx("h4", { children: "M\u00F4 t\u1EA3" }), _jsx("p", { children: show(booking?.description) }), _jsx("h4", { children: "\u0110\u1ECBa \u0111i\u1EC3m" }), _jsx("p", { children: show(booking?.location) }), _jsx("h4", { children: "Y\u00EAu c\u1EA7u \u0111\u1EB7c bi\u1EC7t" }), _jsx("p", { children: show(booking?.specialRequirements) }), _jsx("h4", { children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u" }), _jsx("p", { children: booking?.classStartDate
                                                ? formatDate(String(booking.classStartDate))
                                                : "Không có" }), _jsx("h4", { children: "Ng\u00E0y h\u1EBFt h\u1EA1n" }), _jsx("p", { children: booking?.expiryDate
                                                ? formatDate(String(booking.expiryDate))
                                                : "Không có" }), _jsx("h4", { children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { children: booking?.createdAt
                                                ? formatDate(String(booking.createdAt))
                                                : "Không có" })] }), _jsxs("div", { className: "dtbscr4r1c2", children: [_jsx("h4", { children: "M\u00F4n h\u1ECDc" }), _jsx("p", { children: show(booking?.subject) }), _jsx("h4", { children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("p", { children: show(booking?.educationLevel) }), _jsx("h4", { children: "H\u00ECnh th\u1EE9c h\u1ECDc" }), _jsx("p", { children: show(booking?.mode) }), _jsx("h4", { children: "H\u1ECDc ph\u00ED" }), _jsx("p", { children: booking?.budget
                                                ? `${booking.budget.toLocaleString()} VNĐ`
                                                : "Không có" }), _jsx("h4", { children: "Tr\u1EA1ng th\u00E1i" }), _jsx("p", { children: getStatusText(booking?.status) }), _jsx("h4", { children: "L\u1ECBch h\u1ECDc" }), booking?.schedules &&
                                            booking.schedules.length > 0 ? ([...booking.schedules]
                                            .sort((a, b) => {
                                            const order = [1, 2, 3, 4, 5, 6, 0];
                                            return (order.indexOf(a.dayOfWeek) -
                                                order.indexOf(b.dayOfWeek));
                                        })
                                            .map((s, index) => (_jsxs("div", { children: [_jsx("h4", { children: daysOfWeek[s.dayOfWeek] }), _jsxs("p", { children: [show(s.startTime), " \u2192", " ", show(s.endTime)] })] }, index)))) : (_jsx("p", { children: "Kh\u00F4ng c\u00F3" }))] })] }), _jsxs("div", { className: "dtbscr4r2", children: [_jsx("button", { className: isSubmittingAccept ? "disable-btn" : "pr-btn", onClick: () => handleAcceptBooking(String(booking?.id)), children: isSubmittingAccept ? (_jsx(LoadingSpinner, {})) : ("Chấp thuận") }), _jsx("button", { className: isSubmittingReject
                                        ? "disable-btn"
                                        : "delete-btn", onClick: () => handleRejectBooking(String(booking?.id)), children: isSubmittingReject ? (_jsx(LoadingSpinner, {})) : ("Từ chối") })] })] })] }) }));
};
export default DetailTutorBookingPage;
