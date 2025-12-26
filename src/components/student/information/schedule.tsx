import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectListAssignedClassForStudent,
    selectListLearningScheduleForStudent,
    selectListOneOnOneTutorForStudent,
} from "../../../app/selector";
import { getAttendanceText, useDocumentTitle } from "../../../utils/helper";
import { format, startOfWeek, addDays, getDay, parseISO } from "date-fns";
import {
    getAllLearingScheduleForStudentApiThunk,
    getAllLearingScheduleWithOngoingClassForStudentApiThunk,
    getAllLearingScheduleWithSpecificTutorForStudentApiThunk,
    getAllOneOnOneTutorForStudentApiThunk,
} from "../../../services/student/learningSchedule/learningScheduleThunk";

import {
    Calendar,
    dateFnsLocalizer,
    Views,
    Event as RBCEvent,
} from "react-big-calendar";
import { vi } from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiTextAlignLeft } from "react-icons/ci";
import { getAllAssignedClassForStudentApiThunk } from "../../../services/student/class/classThunk";
import { StudentScheduleCard } from "../../card";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";

// ------------------- Localizer -------------------
const locales = { vi };
const localizer = dateFnsLocalizer({
    format,
    parse: (value: string) => new Date(value),
    startOfWeek,
    getDay: (date) => date.getDay(),
    locales,
});

// Weekday list (map đúng với getDay: 0=Sun..6=Sat)
export const weekDays = [
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
            {/* <p className="event-mode">
                {event.classMode === "Online"
                    ? "Online"
                    : "Offline"}{" "}
            </p> */}
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

const StudentSchedule: FC = () => {
    const dispatch = useAppDispatch();
    const schedules =
        useAppSelector(selectListLearningScheduleForStudent) || [];
    const tutors = useAppSelector(selectListOneOnOneTutorForStudent) || [];
    const classes =
        useAppSelector(selectListAssignedClassForStudent)?.filter(
            (c) => c.classStatus === "Ongoing",
        ) || [];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [tabActive, setTabActive] = useState("all");
    const [tabSubActive, setTabSubActive] = useState("schedule");
    const [tutorId, setTutorId] = useState<string>("");
    const [classId, setClassId] = useState<string>("");

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

    // Reset tuần khi đổi tab
    useEffect(() => {
        setCurrentDate(new Date());
    }, [tabActive]);

    useDocumentTitle("Lịch học");

    // ------------------- Load dữ liệu cơ bản theo TAB -------------------
    useEffect(() => {
        if (tabActive === "all") {
            dispatch(
                getAllLearingScheduleForStudentApiThunk({
                    startDate: startStr,
                    endDate: endStr,
                }),
            );
        }

        if (tabActive === "tutoring") {
            dispatch(getAllOneOnOneTutorForStudentApiThunk());
        }

        if (tabActive === "class") {
            dispatch(getAllAssignedClassForStudentApiThunk());
        }
    }, [tabActive, currentDate, startStr, endStr, dispatch]);

    // ------------------- Load lịch theo lựa chọn trong tab -------------------
    useEffect(() => {
        if (tabActive === "tutoring" && tutorId) {
            dispatch(
                getAllLearingScheduleWithSpecificTutorForStudentApiThunk({
                    tutorId,
                    params: { startDate: startStr, endDate: endStr },
                }),
            );
        }
    }, [tutorId, currentDate, tabActive, startStr, endStr, dispatch]);

    useEffect(() => {
        if (tabActive === "class" && classId) {
            dispatch(
                getAllLearingScheduleWithOngoingClassForStudentApiThunk({
                    classId,
                    params: { startDate: startStr, endDate: endStr },
                }),
            );
        }
    }, [classId, currentDate, tabActive, startStr, endStr, dispatch]);

    // ------------------- Convert schedule => Events -------------------
    const events: RBCEvent[] = schedules.map((s) => {
        // Dùng parseISO() cho cả start và end để đảm bảo timezone nhất quán
        const startDate = parseISO(s.startTime);
        const endDate = parseISO(s.endTime);

        return {
            id: s.id,
            lessonId: s.lessonId,
            title: `Buổi học`,
            attendanceStatus: s.attendanceStatus,
            classMode: s.classMode,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: s,
        };
    });

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
            getAllLearingScheduleForStudentApiThunk({
                startDate: format(start, "yyyy-MM-dd"),
                endDate: format(end, "yyyy-MM-dd"),
            }),
        );

        const midDate = new Date((start.getTime() + end.getTime()) / 2);
        setCurrentDate(midDate);
    };

    const handleRangeChangeTutoring = (range: any) => {
        if (!tutorId) return;

        let start = range.start || range[0];
        let end = range.end || range[range.length - 1];

        dispatch(
            getAllLearingScheduleWithSpecificTutorForStudentApiThunk({
                tutorId,
                params: {
                    startDate: format(start, "yyyy-MM-dd"),
                    endDate: format(end, "yyyy-MM-dd"),
                },
            }),
        );

        const mid = new Date((start.getTime() + end.getTime()) / 2);
        setCurrentDate(mid);
    };

    const handleRangeChangeClass = (range: any) => {
        if (!classId) return;

        let start = range.start || range[0];
        let end = range.end || range[range.length - 1];

        dispatch(
            getAllLearingScheduleWithOngoingClassForStudentApiThunk({
                classId,
                params: {
                    startDate: format(start, "yyyy-MM-dd"),
                    endDate: format(end, "yyyy-MM-dd"),
                },
            }),
        );

        const mid = new Date((start.getTime() + end.getTime()) / 2);
        setCurrentDate(mid);
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

    const handleViewDetail = (event: any) => {
        const lessonId = event?.resource?.lessonId || event?.lessonId;
        if (!lessonId) return;

        const url =
            routes.student.information +
            `?tab=schedule/lesson_detail/${lessonId}`;
        navigateHook(url);
    };

    return (
        <div className="student-schedule">
            <h4>Lịch học của bạn</h4>

            {/* ---------------- TAB ---------------- */}
            <div className="tabs">
                {["all", "tutoring", "class"].map((t) => (
                    <div
                        key={t}
                        className={`tab ${tabActive === t ? "active" : ""}`}
                        onClick={() => {
                            setTabActive(t);
                            setTutorId("");
                            setClassId("");
                            setTabSubActive("schedule");
                        }}
                    >
                        {t === "all" && "Tất cả"}
                        {t === "tutoring" && "Học kèm"}
                        {t === "class" && "Lớp học"}
                    </div>
                ))}
            </div>

            {/* ---------------- TAB ALL ---------------- */}
            {tabActive === "all" && (
                <>
                    <div className="sub-tabs">
                        {["schedule", "list"].map((t) => (
                            <div
                                key={t}
                                className={`sub-tab ${
                                    tabSubActive === t ? "active" : ""
                                }`}
                                onClick={() => {
                                    setTabSubActive(t);
                                    setTutorId("");
                                    setClassId("");
                                }}
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
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.WEEK}
                            views={[Views.WEEK, Views.DAY, Views.MONTH]}
                            date={currentDate}
                            eventPropGetter={eventStyleGetter}
                            culture="vi"
                            step={15}
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
                            onSelectEvent={handleViewDetail}
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
                                                        <StudentScheduleCard
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

            {/* ---------------- TAB TUTORING ---------------- */}
            {tabActive === "tutoring" && (
                <>
                    {/* ---- Form chọn gia sư ---- */}
                    <div className="form">
                        <div className="form-field">
                            <label className="form-label">Gia sư</label>
                            <div className="form-input-container">
                                <CiTextAlignLeft className="form-input-icon" />
                                <select
                                    className="form-input"
                                    aria-label="Chọn gia sư"
                                    value={tutorId}
                                    onChange={(e) => setTutorId(e.target.value)}
                                >
                                    <option value="">
                                        --- Chọn gia sư ---
                                    </option>
                                    {tutors.map((t) => (
                                        <option
                                            key={t.userId}
                                            value={t.profileId}
                                        >
                                            {t.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {tutorId && (
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

                            {/* ------------- DẠNG LỊCH ------------- */}
                            {tabSubActive === "schedule" && (
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    components={{
                                        event: EventComponent,
                                    }}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView={Views.WEEK}
                                    views={[Views.WEEK, Views.DAY, Views.MONTH]}
                                    date={currentDate}
                                    step={15}
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
                                    onRangeChange={handleRangeChangeTutoring}
                                    onSelectEvent={handleViewDetail}
                                />
                            )}

                            {/* ------------- DẠNG DANH SÁCH ------------- */}
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
                                        {groupSchedulesByWeekDays(
                                            schedules,
                                        ).map((d) => (
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
                                                            <StudentScheduleCard
                                                                key={s.id}
                                                                day={d}
                                                                firstDay={
                                                                    firstDay
                                                                }
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
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            {/* ---------------- TAB TUTORING ---------------- */}
            {tabActive === "class" && (
                <>
                    {/* ---- Form chọn gia sư ---- */}
                    <div className="form">
                        <div className="form-field">
                            <label className="form-label">
                                Lớp học đang học
                            </label>
                            <div className="form-input-container">
                                <CiTextAlignLeft className="form-input-icon" />
                                <select
                                    className="form-input"
                                    aria-label="Chọn gia sư"
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                >
                                    <option value="">
                                        --- Chọn lớp học ---
                                    </option>
                                    {classes.map((c) => (
                                        <option
                                            key={c.classId}
                                            value={c.classId}
                                        >
                                            "{c.classTitle}" - {c.tutorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {classId && (
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
                            {/* ------------- DẠNG LỊCH ------------- */}
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
                                    onRangeChange={handleRangeChangeClass}
                                    onSelectEvent={handleViewDetail}
                                />
                            )}

                            {/* ------------- DẠNG DANH SÁCH ------------- */}
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
                                        {groupSchedulesByWeekDays(
                                            schedules,
                                        ).map((d) => (
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
                                                            <StudentScheduleCard
                                                                key={s.id}
                                                                day={d}
                                                                firstDay={
                                                                    firstDay
                                                                }
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
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentSchedule;
