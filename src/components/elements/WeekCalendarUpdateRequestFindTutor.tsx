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
    addDays,
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

interface WeekCalendarUpdateRequestFindTutorProps {
    onSelectedChange?: (schedules: Schedule[]) => void;
    initialEvents?: Schedule[]; // thêm prop này
}

const WeekCalendarUpdateRequestFindTutor: React.FC<
    WeekCalendarUpdateRequestFindTutorProps
> = ({
    onSelectedChange,
    initialEvents = [], // default []
}) => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);

    useEffect(() => {
        // Nếu có initialEvents, convert sang Slot và EventType
        if (initialEvents.length > 0) {
            const newSlots: Slot[] = initialEvents.map((s) => {
                const today = startOfWeek(new Date(), { weekStartsOn: 1 });
                const dayOffset = s.dayOfWeek === 0 ? 6 : s.dayOfWeek - 1; // Sunday=0, Monday=1
                const dayDate = addDays(today, dayOffset);

                const [sh, sm] = s.startTime.split(":").map(Number);
                const [eh, em] = s.endTime.split(":").map(Number);

                const startDate = new Date(dayDate);
                startDate.setHours(sh, sm, 0, 0);

                const endDate = new Date(dayDate);
                endDate.setHours(eh, em, 0, 0);

                return {
                    day: format(startDate, "EEEE", { locale: vi }),
                    start: s.startTime,
                    end: s.endTime,
                    startDate,
                    endDate,
                };
            });

            const newEvents: EventType[] = newSlots.map((s) => ({
                title: "",
                start: s.startDate,
                end: s.endDate,
                allDay: false,
            }));

            setSelectedSlots(newSlots);
            setEvents(newEvents);
        }
    }, []);

    // 🔹 rest code giữ nguyên như cũ
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
        const start = slotInfo.start as Date;
        const end = slotInfo.end as Date;
        const dayOfWeek = format(start, "EEEE", { locale: vi });
        const startTime = format(start, "HH:mm");
        const endTime = format(end, "HH:mm");

        if (checkOverlap(start, end)) {
            toast.error("⛔ Khung giờ bị trùng hoặc bận!");
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
            toast.error("⛔ Khung giờ bị trùng hoặc bận!");
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

    return (
        <div className="week-calendar">
            {/* danh sách selectedSlots + button xóa tất cả */}
            {selectedSlots.length > 0 && (
                <>
                    <div className="list-event">
                        <h6>Danh sách lịch học</h6>
                        {selectedSlots.map((slot, index) => (
                            <div key={index} className="event-item">
                                <span>
                                    {slot.day}: {slot.start} - {slot.end}
                                </span>
                                <div
                                    onClick={() => {
                                        const updatedEvents = events.filter(
                                            (_, i) => i !== index
                                        );
                                        const updatedSlots =
                                            selectedSlots.filter(
                                                (_, i) => i !== index
                                            );
                                        setEvents(updatedEvents);
                                        setSelectedSlots(updatedSlots);
                                    }}
                                    className="delete-btn delete-item"
                                >
                                    Xoá
                                </div>
                            </div>
                        ))}
                    </div>
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

export default WeekCalendarUpdateRequestFindTutor;
