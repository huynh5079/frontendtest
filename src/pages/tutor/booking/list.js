import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListBookingForTutor } from "../../../app/selector";
import { getAllBookingForTutorApiThunk } from "../../../services/tutor/booking/bookingThunk";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const ListTutorBookingPage = () => {
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectListBookingForTutor);
    useEffect(() => {
        dispatch(getAllBookingForTutorApiThunk());
    }, [dispatch]);
    const handleViewDetail = (id) => {
        const url = routes.tutor.booking.detail.replace(":id", id);
        navigateHook(url);
    };
    useDocumentTitle("Danh sách lịch đặt");
    return (_jsx("section", { id: "list-tutor-booking-section", children: _jsxs("div", { className: "ltbs-container", children: [_jsxs("div", { className: "ltbscr1", children: [_jsx("h4", { children: "Danh s\u00E1nh" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "L\u1ECBch \u0111\u1EB7t" })] })] }), _jsxs("div", { className: "ltbscr2", children: [_jsxs("div", { className: "ltbscr2-item active", children: [_jsx(FaListUl, { className: "ltbscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 \u0111\u01A1n" })] })] }), _jsxs("div", { className: "ltbscr2-item", children: [_jsx(FaArrowCircleUp, { className: "ltbscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u1EE3i x\u1EEF l\u00ED" }), _jsx("p", { children: "2 \u0111\u01A1n" })] })] }), _jsxs("div", { className: "ltbscr2-item", children: [_jsx(FaArrowCircleUp, { className: "ltbscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u00E3 ch\u1EA5p thu\u1EADn" }), _jsx("p", { children: "2 \u0111\u01A1n" })] })] }), _jsxs("div", { className: "ltbscr2-item", children: [_jsx(FaArrowCircleDown, { className: "ltbscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u00E3 t\u1EEB ch\u1ED1i" }), _jsx("p", { children: "1 giao d\u1ECBch" })] })] })] }), _jsx("div", { className: "ltbscr4", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "T\u00EAn ng\u01B0\u1EDDi \u0111\u1EB7t" }), _jsx("th", { className: "table-head-cell", children: "M\u00F4n h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian g\u1EEDi" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: bookings?.map((booking) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: booking.studentName }), _jsx("td", { className: "table-body-cell", children: booking.subject }), _jsx("td", { className: "table-body-cell", children: booking.educationLevel }), _jsx("td", { className: "table-body-cell", children: formatDate(booking.createdAt) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => handleViewDetail(booking.id), children: "Xem chi ti\u1EBFt" }) })] }, booking.id))) })] }) })] }) }));
};
export default ListTutorBookingPage;
