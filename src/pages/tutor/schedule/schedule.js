import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views, } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { vi } from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListScheduleForTutor, selectProfileTutor, } from "../../../app/selector";
import { getAllScheduleForTutorApiThunk } from "../../../services/tutor/schedule/tutorScheduleThunk";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import { CreateAvailabilityBlockForTutorModal, DeleteAvailabilityBlockForTutorModal, } from "../../../components/modal";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
// ------------------- Localizer -------------------
const locales = { vi: vi };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
const TutorSchedulePage = () => {
    const dispatch = useAppDispatch();
    const tutorProfile = useAppSelector(selectProfileTutor);
    const schedules = useAppSelector(selectListScheduleForTutor) || [];
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState("ALL");
    // Tính ngày đầu/cuối tuần để call API
    const startOfWeekDate = formatDateReverse(format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd"));
    const endOfWeekDate = formatDateReverse(format(startOfWeek(currentDate, { weekStartsOn: 1 }).setDate(startOfWeek(currentDate, { weekStartsOn: 1 }).getDate() + 6), "yyyy-MM-dd"));
    // Call API khi tuần thay đổi
    useEffect(() => {
        if (!tutorProfile?.tutorProfileId)
            return;
        dispatch(getAllScheduleForTutorApiThunk({
            tutorProfileId: tutorProfile.tutorProfileId,
            startDate: startOfWeekDate,
            endDate: endOfWeekDate,
        }));
    }, [
        dispatch,
        tutorProfile?.tutorProfileId,
        startOfWeekDate,
        endOfWeekDate,
    ]);
    // Chuyển schedule sang Event
    const events = schedules.map((s) => ({
        id: s.id,
        title: s.entryType === "BLOCK" ? "Lịch bận" : "Buổi dạy",
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        resource: s,
    }));
    // Lọc event theo filter
    const filteredEvents = events.filter((e) => {
        const entryType = e.resource?.entryType;
        if (filter === "ALL")
            return true;
        if (filter === "BLOCK")
            return entryType === "BLOCK";
        if (filter === "LESSON")
            return entryType !== "BLOCK";
        return true;
    });
    // Style cho event
    const eventStyleGetter = (event) => {
        const entryType = event.resource?.entryType;
        let backgroundColor = entryType === "BLOCK" ? "#ef5350" : "#5c6bc0";
        return {
            style: {
                backgroundColor,
                color: "white",
                borderRadius: "6px",
                padding: "4px 6px",
                border: "none",
            },
        };
    };
    // Khi click event
    const handleSelectEvent = (event) => {
        const schedule = event.resource;
        if (schedule.entryType === "BLOCK") {
            setSelectedSchedule(schedule);
            setIsDeleteModalOpen(true);
        }
    };
    useDocumentTitle("Lịch Cá Nhân");
    return (_jsxs("section", { id: "tutor-schedule-section", children: [_jsxs("div", { className: "tss-container", children: [_jsxs("div", { className: "tsscr1", children: [_jsx("h4", { children: "L\u1ECBch C\u00E1 Nh\u00E2n" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "L\u1ECBch c\u00E1 nh\u00E2n" })] })] }), _jsxs("div", { className: "tsscr2", children: [_jsxs("div", { className: `tsscr2-item ${filter === "ALL" ? "active" : ""}`, onClick: () => setFilter("ALL"), children: [_jsx(FaListUl, { className: "tsscr2-item-icon" }), _jsx("div", { className: "amount", children: _jsx("h5", { children: "T\u1EA5t c\u1EA3" }) })] }), _jsxs("div", { className: `tsscr2-item ${filter === "BLOCK" ? "active" : ""}`, onClick: () => setFilter("BLOCK"), children: [_jsx(FaArrowCircleUp, { className: "tsscr2-item-icon" }), _jsx("div", { className: "amount", children: _jsx("h5", { children: "L\u1ECBch b\u1EADn" }) })] }), _jsxs("div", { className: `tsscr2-item ${filter === "LESSON" ? "active" : ""}`, onClick: () => setFilter("LESSON"), children: [_jsx(FaArrowCircleDown, { className: "tsscr2-item-icon" }), _jsx("div", { className: "amount", children: _jsx("h5", { children: "L\u1ECBch d\u1EA1y" }) })] })] }), _jsx("div", { className: "tsscr3", children: _jsx("button", { className: "pr-btn", onClick: () => setIsCreateModalOpen(true), children: "T\u1EA1o l\u1ECBch b\u1EADn" }) }), _jsx("div", { className: "tsscr4", children: _jsx(Calendar, { localizer: localizer, events: filteredEvents, startAccessor: "start", endAccessor: "end", style: { height: "100%", borderRadius: "8px" }, defaultView: Views.WEEK, views: [Views.WEEK, Views.DAY, Views.MONTH], selectable: true, onSelectEvent: handleSelectEvent, onSelectSlot: () => { }, eventPropGetter: eventStyleGetter, popup: true, messages: {
                                next: "Tuần sau",
                                previous: "Tuần trước",
                                today: "Hôm nay",
                                week: "Tuần",
                            }, onRangeChange: (range) => {
                                // range là mảng ngày cho Week/Month, hoặc object cho Day
                                let newStart;
                                let newEnd;
                                if (Array.isArray(range)) {
                                    newStart = range[0];
                                    newEnd = range[range.length - 1];
                                }
                                else if (range.start && range.end) {
                                    newStart = range.start;
                                    newEnd = range.end;
                                }
                                else {
                                    return;
                                }
                                setCurrentDate(newStart);
                                const startStr = formatDateReverse(format(newStart, "yyyy-MM-dd"));
                                const endStr = formatDateReverse(format(newEnd, "yyyy-MM-dd"));
                                if (tutorProfile?.tutorProfileId) {
                                    dispatch(getAllScheduleForTutorApiThunk({
                                        tutorProfileId: tutorProfile.tutorProfileId,
                                        startDate: startStr,
                                        endDate: endStr,
                                    }));
                                }
                            } }) })] }), _jsx(CreateAvailabilityBlockForTutorModal, { isOpen: isCreateModalOpen, setIsOpen: setIsCreateModalOpen, startDateProps: startOfWeekDate, endDateProps: endOfWeekDate }), selectedSchedule && (_jsx(DeleteAvailabilityBlockForTutorModal, { isOpen: isDeleteModalOpen, setIsOpen: setIsDeleteModalOpen, startDateProps: startOfWeekDate, endDateProps: endOfWeekDate, selectedAvailabilityBlock: selectedSchedule }))] }));
};
export default TutorSchedulePage;
