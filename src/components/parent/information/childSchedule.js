import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useDocumentTitle } from "../../../utils/helper";
// mảng tên ngày tiếng Việt
const dayNames = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
];
const shifts = [
    { name: "Sáng", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Chiều", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Tối", slots: ["Slot 1", "Slot 2", "Slot 3"] },
];
// dữ liệu mẫu
const subjects = {
    "2025-09-08-Sáng-Slot 1": {
        subject: "Toán",
        teacher: "Thầy A",
        time: "7:00 - 8:30",
        id: "math101",
        attendance: "có mặt",
    },
    "2025-09-10-Chiều-Slot 2": {
        subject: "Văn",
        teacher: "Cô B",
        time: "14:00 - 15:30",
        id: "lit202",
        attendance: "vắng",
    },
    "2025-09-09-Tối-Slot 3": {
        subject: "Anh Văn",
        teacher: "Thầy C",
        time: "19:00 - 20:30",
        id: "eng303",
        attendance: "có mặt",
    },
    "2025-09-15-Sáng-Slot 1": {
        subject: "Toán",
        teacher: "Thầy A",
        time: "7:00 - 8:30",
        id: "math101",
    },
    "2025-09-16-Chiều-Slot 2": {
        subject: "Văn",
        teacher: "Cô B",
        time: "14:00 - 15:30",
        id: "lit202",
    },
    "2025-09-18-Tối-Slot 3": {
        subject: "Anh Văn",
        teacher: "Thầy C",
        time: "19:00 - 20:30",
        id: "eng303",
    },
};
// lấy range từ thứ 2 đến CN
const getWeekRange = (offset = 0) => {
    const startOfWeek = dayjs()
        .startOf("week")
        .add(1, "day")
        .add(offset, "week"); // Thứ 2
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
};
const ParentChildScheduleSchedule = () => {
    const navigate = useNavigate();
    const [weekOffset, setWeekOffset] = useState(0);
    const weekDays = getWeekRange(weekOffset);
    const today = dayjs();
    const goToDetail = (id) => {
        navigate(`/subject/${id}`);
    };
    useDocumentTitle("Lịch học của con");
    return (_jsxs("div", { className: "parent-child-schedule", children: [_jsx("div", { className: "form", children: _jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "L\u1EDBp" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsxs("select", { className: "form-input", children: [_jsx("option", { value: "", children: "Ph\u1EA1m C\u00F4ng L\u00EA Tu\u1EA5n" }), _jsx("option", { value: "", children: "Nguy\u1EC5n Th\u1ECB Y\u1EBFn Vy" })] })] })] }) }), _jsxs("div", { className: "week-filter", children: [_jsx("button", { className: "pr-btn", onClick: () => setWeekOffset(weekOffset - 1), children: "Tu\u1EA7n tr\u01B0\u1EDBc" }), _jsx("button", { className: "sc-btn", onClick: () => setWeekOffset(0), children: "Tu\u1EA7n n\u00E0y" }), _jsx("button", { className: "pr-btn", onClick: () => setWeekOffset(weekOffset + 1), children: "Tu\u1EA7n sau" })] }), _jsxs("div", { className: "today", children: [_jsx("span", { children: "H\u00F4m nay" }), ": ", today.format("DD/MM/YYYY")] }), _jsxs("table", { className: "schedule-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Ca" }), _jsx("th", { children: "Slot" }), weekDays.map((day) => {
                                    const dayName = dayNames[day.day()];
                                    return (_jsxs("th", { children: [dayName, " ", _jsx("br", {}), " ", day.format("DD/MM")] }, day.format("YYYY-MM-DD")));
                                })] }) }), _jsx("tbody", { children: shifts.map((shift) => shift.slots.map((slot, i) => (_jsxs("tr", { children: [i === 0 && (_jsx("td", { rowSpan: shift.slots.length, children: shift.name })), _jsx("td", { children: slot }), weekDays.map((day) => {
                                    const key = `${day.format("YYYY-MM-DD")}-${shift.name}-${slot}`;
                                    const data = subjects[key];
                                    const isFuture = day.isAfter(today, "day");
                                    return (_jsx("td", { className: `slot-cell ${data ? "has-subject" : ""}`, onClick: () => data && goToDetail(data.id), children: data ? (_jsxs("div", { children: [_jsx("div", { className: "subject", children: data.subject }), _jsx("div", { className: "teacher", children: data.teacher }), _jsx("div", { className: "time", children: data.time }), _jsx("div", { className: `attendance ${isFuture
                                                        ? "not-yet"
                                                        : data.attendance ===
                                                            "có mặt"
                                                            ? "present"
                                                            : "absent"}`, children: isFuture
                                                        ? "chưa học"
                                                        : data.attendance ??
                                                            "-" })] })) : ("-") }, key));
                                })] }, `${shift.name}-${slot}`)))) })] })] }));
};
export default ParentChildScheduleSchedule;
