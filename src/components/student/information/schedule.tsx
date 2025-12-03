import { type FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListLearningScheduleForStudent } from "../../../app/selector";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import { format, startOfWeek, addDays } from "date-fns";
import { getAllLearingScheduleForStudentApiThunk } from "../../../services/student/learningSchedule/learningScheduleThunk";
import {
    Calendar,
    dateFnsLocalizer,
    Views,
    type Event as RBCEvent,
} from "react-big-calendar";
import { vi } from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";

// ------------------- Localizer -------------------
const locales = { vi };
const localizer = dateFnsLocalizer({
    format,
    parse: (value: string, _: string) => {
        return new Date(value); // luôn trả về Date
    },
    startOfWeek,
    getDay: (date) => date.getDay(),
    locales,
});

const StudentSchedule: FC = () => {
    const dispatch = useAppDispatch();
    const learningSchedules =
        useAppSelector(selectListLearningScheduleForStudent) || [];

    const [currentDate, setCurrentDate] = useState(new Date());

    // ------------------- Tính tuần từ Thứ 2 → Chủ nhật -------------------
    const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Thứ 2
    const lastDayOfWeek = addDays(firstDayOfWeek, 6); // Chủ nhật

    const startOfWeekStr = formatDateReverse(
        format(firstDayOfWeek, "yyyy-MM-dd"),
    );
    const endOfWeekStr = formatDateReverse(format(lastDayOfWeek, "yyyy-MM-dd"));

    // ------------------- Gọi API lấy lịch học tuần -------------------
    useEffect(() => {
        dispatch(
            getAllLearingScheduleForStudentApiThunk({
                startDate: startOfWeekStr,
                endDate: endOfWeekStr,
            }),
        );
    }, [dispatch, startOfWeekStr, endOfWeekStr]);
    
    useDocumentTitle("Lịch học");

    // ------------------- Chuyển lịch học sang events -------------------
    const events: RBCEvent[] = learningSchedules.map((s) => ({
        id: s.id,
        title: "Buổi học",
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        resource: s,
    }));

    // ------------------- Style từng event -------------------
    const eventStyleGetter = () => ({
        style: {
            backgroundColor: "var(--main-color)",
            color: "white",
            borderRadius: "6px",
            padding: "4px 6px",
            border: "none",
        },
    });

    return (
        <div className="student-schedule h-[600px]">
            <Calendar
                localizer={localizer}
                culture="vi"
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", borderRadius: "8px" }}
                defaultView={Views.WEEK}
                views={[Views.WEEK, Views.DAY, Views.MONTH]}
                selectable
                popup
                eventPropGetter={eventStyleGetter}
                date={currentDate}
                messages={{
                    next: "Tuần sau",
                    previous: "Tuần trước",
                    today: "Hôm nay",
                    week: "Tuần",
                }}
                onRangeChange={(range: any) => {
                    let newStart: Date;
                    let newEnd: Date;

                    if (Array.isArray(range)) {
                        newStart = range[0];
                        newEnd = range[range.length - 1];
                    } else if (range.start && range.end) {
                        newStart = range.start;
                        newEnd = range.end;
                    } else {
                        return;
                    }

                    setCurrentDate(newStart);

                    const startStr = formatDateReverse(
                        format(newStart, "yyyy-MM-dd"),
                    );
                    const endStr = formatDateReverse(
                        format(newEnd, "yyyy-MM-dd"),
                    );

                    dispatch(
                        getAllLearingScheduleForStudentApiThunk({
                            startDate: startStr,
                            endDate: endStr,
                        }),
                    );
                }}
            />
        </div>
    );
};

export default StudentSchedule;
