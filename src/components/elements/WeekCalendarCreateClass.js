import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, Views, } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isBefore, isAfter, addDays, } from "date-fns";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "react-toastify";
const locales = { vi };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
const DnDCalendar = withDragAndDrop(Calendar);
const WeekCalendarCreateClass = ({ busySchedules, onSelectedChange, sessionsPerWeek, }) => {
    const [events, setEvents] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    useEffect(() => {
        const formatted = selectedSlots.map((s) => ({
            dayOfWeek: new Date(s.startDate).getDay(),
            startTime: s.start,
            endTime: s.end,
        }));
        onSelectedChange?.(formatted);
    }, [selectedSlots]);
    // 🔹 Map thứ sang index trong tuần (0 = Chủ nhật, 1 = Thứ 2, ...)
    const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };
    // 🔹 Tạo danh sách event bận hiển thị trong tuần hiện tại
    const busyEvents = useMemo(() => {
        const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 }); // luôn lấy thứ 2 đầu tuần hiện tại
        const result = [];
        Object.entries(busySchedules).forEach(([day, slots]) => {
            const offset = dayMap[day]; // 0–6
            const dayDate = addDays(baseMonday, offset - 1 >= 0 ? offset - 1 : 6); // để Monday = 0
            slots.forEach(({ start, end }) => {
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);
                const startDate = new Date(dayDate);
                startDate.setHours(sh, sm, 0, 0);
                const endDate = new Date(dayDate);
                endDate.setHours(eh, em, 0, 0);
                result.push({
                    title: "Bận",
                    start: startDate,
                    end: endDate,
                    allDay: false,
                    resource: { isBusy: true },
                });
            });
        });
        return result;
    }, [busySchedules]);
    // 🔹 Kiểm tra trùng lịch
    const checkOverlap = (start, end, ignoreEvent) => {
        const allSlots = [
            ...selectedSlots.map((s) => ({
                start: s.startDate,
                end: s.endDate,
            })),
            ...busyEvents.map((b) => ({ start: b.start, end: b.end })),
        ];
        // Nếu đang kéo hoặc resize event, bỏ qua chính nó
        if (ignoreEvent) {
            const index = events.findIndex((e) => e === ignoreEvent);
            if (index !== -1)
                allSlots.splice(index, 1);
        }
        return allSlots.some((slot) => !(isBefore(end, slot.start) || isAfter(start, slot.end)));
    };
    // 🔹 Xử lý chọn khung giờ
    const handleSelectSlot = (slotInfo) => {
        // 🔹 Ngăn chọn quá số buổi
        if (sessionsPerWeek !== "" &&
            sessionsPerWeek &&
            selectedSlots.length >= sessionsPerWeek) {
            toast.error(`⚠ Bạn chỉ được chọn tối đa ${sessionsPerWeek} buổi trong tuần`);
            return;
        }
        const start = slotInfo.start;
        const end = slotInfo.end;
        const dayOfWeek = format(start, "EEEE", { locale: vi });
        const startTime = format(start, "HH:mm");
        const endTime = format(end, "HH:mm");
        if (checkOverlap(start, end)) {
            toast.error("⛔ Khung giờ bị trùng hoặc bận!");
            return;
        }
        const newSlot = {
            day: dayOfWeek,
            start: startTime,
            end: endTime,
            startDate: start,
            endDate: end,
        };
        const newEvent = { title: "", start, end, allDay: false };
        setSelectedSlots((prev) => [...prev, newSlot]);
        setEvents((prev) => [...prev, newEvent]);
    };
    const handleEventDrop = ({ event, start, end }) => {
        const dayOfWeek = format(start, "EEEE", { locale: vi });
        if (checkOverlap(start, end, event)) {
            toast.error("⛔ Khung giờ bị trùng hoặc bận!");
            return;
        }
        const updatedEvents = events.map((e) => e === event
            ? {
                ...e,
                start,
                end,
                title: ``,
            }
            : e);
        const updatedSlots = selectedSlots.map((slot) => slot.startDate.getTime() === event.start.getTime()
            ? {
                ...slot,
                day: dayOfWeek,
                start: format(start, "HH:mm"),
                end: format(end, "HH:mm"),
                startDate: start,
                endDate: end,
            }
            : slot);
        setEvents(updatedEvents);
        setSelectedSlots(updatedSlots);
    };
    // 🔹 Resize event
    const handleEventResize = ({ event, start, end }) => {
        handleEventDrop({ event, start, end });
    };
    // 🔹 Xoá từng slot
    const handleDeleteEvent = (index) => {
        const updatedEvents = events.filter((_, i) => i !== index);
        const updatedSlots = selectedSlots.filter((_, i) => i !== index);
        setEvents(updatedEvents);
        setSelectedSlots(updatedSlots);
    };
    // 🔹 Xoá tất cả
    const handleClearAll = () => {
        setEvents([]);
        setSelectedSlots([]);
    };
    return (_jsxs("div", { className: "week-calendar", children: [selectedSlots.length > 0 && (_jsxs(_Fragment, { children: [" ", _jsxs("button", { onClick: handleClearAll, className: "delete-btn delete-all", children: [" ", "Xo\u00E1 t\u1EA5t c\u1EA3", " "] }), " ", _jsxs("div", { className: "list-event", children: [" ", _jsx("h6", { children: "Danh s\u00E1ch khung gi\u1EDD" }), " ", selectedSlots.map((slot, index) => (_jsxs("div", { className: "event-item", children: [" ", _jsxs("span", { children: [" ", slot.day, ": ", slot.start, " - ", slot.end, " "] }), " ", _jsxs("button", { onClick: () => handleDeleteEvent(index), className: "delete-btn delete-item", children: [" ", "Xo\u00E1", " "] }), " "] }, index))), " "] }), " "] })), _jsx(DnDCalendar, { localizer: localizer, events: [...events, ...busyEvents], startAccessor: "start", endAccessor: "end", defaultView: Views.WEEK, views: ["week"], selectable: true, onSelectSlot: handleSelectSlot, onEventDrop: handleEventDrop, onEventResize: handleEventResize, step: 15, timeslots: 2, min: new Date(2025, 0, 1, 7, 0), max: new Date(2025, 0, 1, 22, 0), style: { height: 600 }, culture: "vi", toolbar: false, formats: {
                    dayFormat: (date, culture, localizer) => localizer.format(date, "EEEE", culture),
                }, eventPropGetter: (event) => {
                    if (event.resource?.isBusy) {
                        return {
                            style: {
                                backgroundColor: "#b0b0b0",
                                cursor: "not-allowed",
                                opacity: 0.6,
                            },
                        };
                    }
                    return {};
                } })] }));
};
export default WeekCalendarCreateClass;
