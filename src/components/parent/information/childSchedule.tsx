import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectListChildAccount,
    selectListChildSchedule,
} from "../../../app/selector";
import { getAttendanceText, useDocumentTitle } from "../../../utils/helper";
import { format, startOfWeek, addDays, parseISO, getDay } from "date-fns";

import {
    Calendar,
    dateFnsLocalizer,
    Views,
    Event as RBCEvent,
} from "react-big-calendar";
import { vi } from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiTextAlignLeft } from "react-icons/ci";
import { ParentChildScheduleCard } from "../../card";
import { getAllChildAccountApiThunk } from "../../../services/parent/childAccount/childAccountThunk";
import { getScheduleSpecificChildForParentApiThunk } from "../../../services/parent/childSchedule/childScheduleThunk";

// ------------------- Localizer -------------------
const locales = { vi };
const localizer = dateFnsLocalizer({
    format,
    parse: (value: string) => new Date(value),
    startOfWeek,
    getDay: (date) => date.getDay(),
    locales,
});

const weekDays = [
    { key: 1, label: "Thứ Hai" },
    { key: 2, label: "Thứ Ba" },
    { key: 3, label: "Thứ Tư" },
    { key: 4, label: "Thứ Năm" },
    { key: 5, label: "Thứ Sáu" },
    { key: 6, label: "Thứ Bảy" },
    { key: 0, label: "Chủ Nhật" },
];

// Trả về đúng ngày của 1 thứ trong tuần, với firstDay = Monday
export const getDateOfSpecificWeekday = (
    monday: Date,
    weekday: number, // weekday: 0=CN,1=T2,...6=T7
) => {
    // Map weekday sang offset tính theo Monday
    const offset = weekday === 0 ? 6 : weekday - 1;
    return addDays(monday, offset);
};

// Ví dụ scheduleByDay
export const scheduleByDay = (schedules: any[], dayKey: number) => {
    return schedules.filter((s) => {
        const d = getDay(parseISO(s.startTime)); // vẫn giữ local timezone
        return d === dayKey;
    });
};

const EventComponent = ({ event }: any) => {
    return (
        <div className="event-component">
            <div className="event-title">Buổi học</div>
            <div
                className={`event-attendance ${
                    event.attendanceStatus === null
                        ? "not-marked"
                        : event.attendanceStatus === "Present"
                        ? "present"
                        : "absent"
                }`}
            >
                {getAttendanceText(event.attendanceStatus)}
            </div>
        </div>
    );
};

const ParentChildScheduleSchedule: FC = () => {
    const dispatch = useAppDispatch();
    const schedules = useAppSelector(selectListChildSchedule) || [];
    const childAccounts = useAppSelector(selectListChildAccount) || [];

    const [childProfileId, setChildProfileId] = useState<string>("");
    const [tabSubActive, setTabSubActive] = useState("schedule");
    const [currentDate, setCurrentDate] = useState(new Date());

    const firstDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    const lastDay = addDays(firstDay, 6);

    const startStr = format(firstDay, "yyyy-MM-dd");
    const endStr = format(lastDay, "yyyy-MM-dd");

    // Gom lịch theo từng ngày trong tuần
    const groupSchedulesByWeekDays = (studySchedules: any[]) => {
        return weekDays.map((d) => {
            const sessions = studySchedules.filter((s) => {
                const day = getDay(parseISO(s.startTime)); // 0..6
                return day === d.key;
            });

            return {
                ...d,
                sessions,
            };
        });
    };

    useEffect(() => {
        dispatch(
            getScheduleSpecificChildForParentApiThunk({
                childProfileId: childProfileId,
                startDate: startStr,
                endDate: endStr,
            }),
        );
    }, [childProfileId, currentDate, startStr, endStr, dispatch]);

    // === EFFECTS ===
    // Load danh sách tài khoản con & chi tiết gia sư
    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);

    useDocumentTitle("Lịch học của con");

    // ------------------- Convert schedule => Events -------------------
    const events: RBCEvent[] = schedules.map((s) => ({
        id: s.id,
        lessonId: s.lessonId,
        title: `Buổi học`,
        attendanceStatus: s.attendanceStatus,
        // mode: s.mode,
        start: parseISO(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        resource: s,
    }));

    const eventStyleGetter = () => ({
        style: {
            backgroundColor: "#fff",
            border: "1px solid var(--main-color)",
            color: "var(--main-color)",
            borderRadius: "6px",
            padding: "4px 6px",
        },
    });

    const handleRangeChange = (range: any) => {
        let start = range.start || range[0];
        let end = range.end || range[range.length - 1];

        dispatch(
            getScheduleSpecificChildForParentApiThunk({
                childProfileId: childProfileId,
                startDate: startStr,
                endDate: endStr,
            }),
        );

        const midDate = new Date((start.getTime() + end.getTime()) / 2);
        setCurrentDate(midDate);
    };

    const goPrevWeek = () => {
        setCurrentDate((prev) => addDays(prev, -7));
    };

    const goNextWeek = () => {
        setCurrentDate((prev) => addDays(prev, 7));
    };

    const goThisWeek = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="parent-child-schedule">
            <h4>Lịch học của con</h4>

            <div className="form">
                <div className="form-field">
                    <label className="form-label">Chọn tài khoản của con</label>
                    <div className="form-input-container">
                        <CiTextAlignLeft className="form-input-icon" />
                        <select
                            className="form-input"
                            value={childProfileId}
                            onChange={(e) => setChildProfileId(e.target.value)}
                        >
                            <option value="">--- Chọn tài khoản ---</option>
                            {childAccounts.map((t) => (
                                <option key={t.studentId} value={t.studentId}>
                                    {t.username}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {childProfileId && (
                <>
                    <div className="sub-tabs">
                        {["schedule", "list"].map((t) => (
                            <div
                                key={t}
                                className={`sub-tab ${
                                    tabSubActive === t ? "active" : ""
                                }`}
                                onClick={() => setTabSubActive(t)}
                            >
                                {t === "schedule" && "Dạng lịch"}
                                {t === "list" && "Dạng danh sách"}
                            </div>
                        ))}
                    </div>

                    {tabSubActive === "schedule" && (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            components={{
                                event: EventComponent,
                            }}
                            step={15}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.WEEK}
                            views={[Views.WEEK, Views.DAY, Views.MONTH]}
                            date={currentDate}
                            eventPropGetter={eventStyleGetter}
                            culture="vi"
                            style={{
                                height: "100%",
                                borderRadius: "8px",
                            }}
                            messages={{
                                next: "Tuần sau",
                                previous: "Tuần trước",
                                today: "Hôm nay",
                                week: "Tuần",
                            }}
                            onRangeChange={handleRangeChange}
                        />
                    )}

                    {tabSubActive === "list" && (
                        <>
                            <div className="week-header">
                                <div className="week-actions">
                                    <button
                                        className="sc-btn"
                                        onClick={goPrevWeek}
                                    >
                                        ← Tuần trước
                                    </button>
                                    <button
                                        className="pr-btn"
                                        onClick={goThisWeek}
                                    >
                                        Tuần này
                                    </button>
                                    <button
                                        className="sc-btn"
                                        onClick={goNextWeek}
                                    >
                                        Tuần sau →
                                    </button>
                                </div>
                            </div>

                            <div className="schedule-week-list">
                                {groupSchedulesByWeekDays(schedules).map(
                                    (d) => (
                                        <div
                                            key={d.key}
                                            className="schedule-group"
                                        >
                                            <h5 className="group-title">
                                                {d.label} –{" "}
                                                {format(
                                                    getDateOfSpecificWeekday(
                                                        firstDay,
                                                        d.key,
                                                    ),
                                                    "dd/MM/yyyy",
                                                )}
                                            </h5>

                                            <div className="group-content">
                                                {d.sessions.length > 0 ? (
                                                    d.sessions.map((s) => (
                                                        <ParentChildScheduleCard
                                                            key={s.id}
                                                            day={d}
                                                            firstDay={firstDay}
                                                            session={s} // 👈 truyền session vào
                                                        />
                                                    ))
                                                ) : (
                                                    <p className="no-session">
                                                        Không có buổi học
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ParentChildScheduleSchedule;
