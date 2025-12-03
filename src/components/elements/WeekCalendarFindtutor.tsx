import React, { useEffect, useState } from "react";
import {
    Calendar,
    dateFnsLocalizer,
    Views,
    type Event as RBCEvent,
} from "react-big-calendar";
import {
    format,
    parse,
    startOfWeek,
    getDay,
    isBefore,
    isAfter,
} from "date-fns";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "react-toastify";
import type { Schedule } from "../../types/student";

interface EventType extends RBCEvent {
    title: string;
    start: Date;
    end: Date;
}

interface Slot {
    day: string;
    start: string;
    end: string;
    startDate: Date;
    endDate: Date;
}

const locales = { vi };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

interface WeekCalendarFindTutorProps {
    onSelectedChange?: (schedules: Schedule[]) => void;
    sessionsPerWeek?: number | ""; // 🔹 Thêm prop
}

const WeekCalendarFindTutor: React.FC<WeekCalendarFindTutorProps> = ({
    onSelectedChange,
    sessionsPerWeek,
}) => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);

    useEffect(() => {
        const formatted: Schedule[] = selectedSlots.map((s) => ({
            dayOfWeek: new Date(s.startDate).getDay(),
            startTime: s.start,
            endTime: s.end,
        }));
        onSelectedChange?.(formatted);
    }, [selectedSlots]);

    // 🔹 Kiểm tra trùng lịch
    const checkOverlap = (start: Date, end: Date, ignoreEvent?: EventType) => {
        const allSlots = [
            ...selectedSlots.map((s) => ({
                start: s.startDate,
                end: s.endDate,
            })),
        ];

        // Nếu đang kéo hoặc resize event, bỏ qua chính nó
        if (ignoreEvent) {
            const index = events.findIndex((e) => e === ignoreEvent);
            if (index !== -1) allSlots.splice(index, 1);
        }

        return allSlots.some(
            (slot) => !(isBefore(end, slot.start) || isAfter(start, slot.end))
        );
    };

    // 🔹 Xử lý chọn khung giờ
    const handleSelectSlot = (slotInfo: any) => {
        // 🔹 Ngăn chọn quá số buổi
        if (
            sessionsPerWeek !== "" &&
            sessionsPerWeek &&
            selectedSlots.length >= sessionsPerWeek
        ) {
            toast.error(
                `⚠ Bạn chỉ được chọn tối đa ${sessionsPerWeek} buổi trong tuần`
            );
            return;
        }

        const start = slotInfo.start as Date;
        const end = slotInfo.end as Date;
        const dayOfWeek = format(start, "EEEE", { locale: vi });
        const startTime = format(start, "HH:mm");
        const endTime = format(end, "HH:mm");

        if (checkOverlap(start, end)) {
            toast.error("⛔ Khung giờ bị trùng!");
            return;
        }

        const newSlot: Slot = {
            day: dayOfWeek,
            start: startTime,
            end: endTime,
            startDate: start,
            endDate: end,
        };
        const newEvent: EventType = { title: "", start, end, allDay: false };

        setSelectedSlots((prev) => [...prev, newSlot]);
        setEvents((prev) => [...prev, newEvent]);
    };

    const handleEventDrop = ({ event, start, end }: any) => {
        const dayOfWeek = format(start, "EEEE", { locale: vi });

        if (checkOverlap(start, end, event)) {
            toast.error("⛔ Khung giờ bị trùng!");
            return;
        }

        const updatedEvents = events.map((e) =>
            e === event
                ? {
                      ...e,
                      start,
                      end,
                      title: ``,
                  }
                : e
        );

        const updatedSlots = selectedSlots.map((slot) =>
            slot.startDate.getTime() === event.start.getTime()
                ? {
                      ...slot,
                      day: dayOfWeek,
                      start: format(start, "HH:mm"),
                      end: format(end, "HH:mm"),
                      startDate: start,
                      endDate: end,
                  }
                : slot
        );

        setEvents(updatedEvents);
        setSelectedSlots(updatedSlots);
    };

    // 🔹 Resize event
    const handleEventResize = ({ event, start, end }: any) => {
        handleEventDrop({ event, start, end });
    };

    // 🔹 Xoá từng slot
    const handleDeleteEvent = (index: number) => {
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

    return (
        <div className="week-calendar">
            {selectedSlots.length > 0 && (
                <>
                    {" "}
                    <button
                        onClick={handleClearAll}
                        className="delete-btn delete-all"
                    >
                        {" "}
                        Xoá tất cả{" "}
                    </button>{" "}
                    <div className="list-event">
                        {" "}
                        <h6>Danh sách khung giờ</h6>{" "}
                        {selectedSlots.map((slot, index) => (
                            <div key={index} className="event-item">
                                {" "}
                                <span>
                                    {" "}
                                    {slot.day}: {slot.start} - {slot.end}{" "}
                                </span>{" "}
                                <button
                                    onClick={() => handleDeleteEvent(index)}
                                    className="delete-btn delete-item"
                                >
                                    {" "}
                                    Xoá{" "}
                                </button>{" "}
                            </div>
                        ))}{" "}
                    </div>{" "}
                </>
            )}

            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={Views.WEEK}
                views={["week"]}
                selectable
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                step={15}
                timeslots={2}
                min={new Date(2025, 0, 1, 7, 0)}
                max={new Date(2025, 0, 1, 22, 0)}
                style={{ height: 600 }}
                culture="vi"
                toolbar={false}
                formats={{
                    dayFormat: (
                        date: Date,
                        culture: string | undefined,
                        localizer: any
                    ) => localizer.format(date, "EEEE", culture),
                }}
                eventPropGetter={(event: any) => {
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
                }}
            />
        </div>
    );
};

export default WeekCalendarFindTutor;
