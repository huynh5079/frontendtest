import { useEffect, useState, type FC } from "react";
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
    addDays,
    parseISO,
} from "date-fns";
import { vi } from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectListScheduleForTutor,
    selectListTutorClass,
    selectProfileTutor,
} from "../../../app/selector";
import {
    getAllScheduleForTutorApiThunk,
    getAllStudyScheduleWithSpecificClassForTutorApiThunk,
    getAllStudyScheduleWithSpecificStudentForTutorApiThunk,
} from "../../../services/tutor/schedule/tutorScheduleThunk";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { CiTextAlignLeft } from "react-icons/ci";
import { TutorScheduleCard } from "../../../components/card";
import { getAllClassApiThunk } from "../../../services/tutor/class/classThunk";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";

// ------------------- Localizer -------------------
const locales = { vi: vi };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
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

const TutorStudySchedulePage: FC = () => {
    const dispatch = useAppDispatch();
    const tutorProfile = useAppSelector(selectProfileTutor);
    const schedules = useAppSelector(selectListScheduleForTutor) || [];
    const studySchedules = schedules.filter(
        (schedule) => schedule.entryType === "LESSON",
    );
    const classes = useAppSelector(selectListTutorClass)?.filter(
        (c) => c.status === "Ongoing",
    );
    const tutoringClasses = classes?.filter((c) => c.studentLimit === 1);
    const groupClasses = classes?.filter((c) => c.studentLimit > 1);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [tabActive, setTabActive] = useState("all");
    const [tabSubActive, setTabSubActive] = useState("schedule");
    const [classId, setClassId] = useState<string | null>(null);

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

    // Call API khi tuần thay đổi
    useEffect(() => {
        if (tabActive === "all") {
            dispatch(
                getAllScheduleForTutorApiThunk({
                    tutorProfileId: tutorProfile?.tutorProfileId!,
                    startDate: startStr,
                    endDate: endStr,
                }),
            );
        }

        if (tabActive === "class" || tabActive === "tutoring") {
            dispatch(getAllClassApiThunk());
        }
    }, [
        dispatch,
        tutorProfile?.tutorProfileId,
        startStr,
        endStr,
        currentDate,
        tabActive,
    ]);

    useEffect(() => {
        if (
            (tabActive === "group" && classId) ||
            (tabActive === "tutoring" && classId)
        ) {
            dispatch(
                getAllStudyScheduleWithSpecificClassForTutorApiThunk({
                    classId: classId,
                    params: {
                        startDate: startStr,
                        endDate: endStr,
                        tutorProfileId: tutorProfile?.tutorProfileId!,
                    },
                }),
            );
        }
    }, [
        tutorProfile?.tutorProfileId!,
        classId,
        currentDate,
        tabActive,
        startStr,
        endStr,
        dispatch,
    ]);

    // Chuyển schedule sang Event
    const events: RBCEvent[] = studySchedules.map((s) => ({
        id: s.id,
        lessonId: s.lessonId,
        title: "Buổi dạy",
        start: parseISO(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        resource: s,
    }));

    // Style cho event
    const eventStyleGetter = () => {
        let backgroundColor = "var(--main-color)";
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

    useDocumentTitle("Lịch dạy");

    const tabs = [
        {
            key: "all",
            label: "Tất cả",
            icon: <FaListUl className="tsscr2-item-icon" />,
        },
        {
            key: "tutoring",
            label: "Lớp dạy kèm",
            icon: <FaArrowCircleUp className="tsscr2-item-icon" />,
        },
        {
            key: "group",
            label: "Lớp dạy nhóm",
            icon: <FaArrowCircleDown className="tsscr2-item-icon" />,
        },
    ];

    const subTabs = [
        {
            key: "schedule",
            label: "Dạng lịch",
            icon: <FaListUl className="tsscr2-item-icon" />,
        },
        {
            key: "list",
            label: "Dạng danh sách",
            icon: <FaArrowCircleUp className="tsscr2-item-icon" />,
        },
    ];

    const goPrevWeek = () => {
        setCurrentDate((prev) => addDays(prev, -7));
    };

    const goNextWeek = () => {
        setCurrentDate((prev) => addDays(prev, 7));
    };

    const goThisWeek = () => {
        setCurrentDate(new Date());
    };

    const handleRangeChange = (range: any) => {
        let start = range.start || range[0];
        let end = range.end || range[range.length - 1];

        const startDate = formatDateReverse(format(start, "yyyy-MM-dd"));
        const endDate = formatDateReverse(format(end, "yyyy-MM-dd"));

        dispatch(
            getAllScheduleForTutorApiThunk({
                tutorProfileId: tutorProfile?.tutorProfileId!,
                startDate,
                endDate,
            }),
        );

        const midDate = new Date((start.getTime() + end.getTime()) / 2);
        setCurrentDate(midDate);
    };

    const handleRangeChangeClass = (range: any) => {
        if (!classId) return;

        let start = range.start || range[0];
        let end = range.end || range[range.length - 1];

        const startDate = formatDateReverse(format(start, "yyyy-MM-dd"));
        const endDate = formatDateReverse(format(end, "yyyy-MM-dd"));

        dispatch(
            getAllStudyScheduleWithSpecificClassForTutorApiThunk({
                classId: classId,
                params: {
                    startDate,
                    endDate,
                    tutorProfileId: tutorProfile?.tutorProfileId!,
                },
            }),
        );

        const mid = new Date((start.getTime() + end.getTime()) / 2);
        setCurrentDate(mid);
    };

    const handleSelectEvent = (event: any) => {
        const lessonId = event?.resource?.lessonId || event?.lessonId;
        if (!lessonId) return;

        const url = routes.tutor.lesson_detail.replace(":id", lessonId);
        navigateHook(url);
    };

    return (
        <section id="tutor-schedule-section">
            <div className="tss-container">
                <div className="tsscr1">
                    <h4>Lịch dạy</h4>
                    <p>
                        Trang tổng quát <span>Lịch dạy</span>
                    </p>
                </div>

                {/* Bộ lọc */}
                <div className="tsscr2">
                    {tabs.map((t) => (
                        <div
                            key={t.key}
                            className={`tsscr2-item ${
                                tabActive === t.key ? "active" : ""
                            }`}
                            onClick={() => {
                                setClassId("");
                                setTabSubActive("schedule");
                                setTabActive(t.key);
                            }}
                        >
                            {t.icon}
                            <div className="amount">
                                <h5>{t.label}</h5>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tsscr4">
                    {tabActive === "all" && (
                        <>
                            <div className="sub-tabs">
                                {subTabs.map((t) => (
                                    <div
                                        key={t.key}
                                        className={`sub-tab ${
                                            tabSubActive === t.key
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setTabSubActive(t.key);
                                        }}
                                    >
                                        {t.key === "schedule" && "Dạng lịch"}
                                        {t.key === "list" && "Dạng danh sách"}
                                    </div>
                                ))}
                            </div>

                            {tabSubActive === "schedule" && (
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView={Views.WEEK}
                                    views={[Views.WEEK, Views.DAY, Views.MONTH]}
                                    date={currentDate}
                                    onRangeChange={handleRangeChange}
                                    eventPropGetter={eventStyleGetter}
                                    culture="vi"
                                    onSelectEvent={handleSelectEvent}
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
                                        {groupSchedulesByWeekDays(
                                            studySchedules,
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
                                                            <TutorScheduleCard
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
                    {tabActive === "tutoring" && (
                        <>
                            <div className="form">
                                <div className="form-field">
                                    <label className="form-label">
                                        Chọn lớp học kèm đang dạy
                                    </label>
                                    <div className="form-input-container">
                                        <CiTextAlignLeft className="form-input-icon" />
                                        <select
                                            className="form-input"
                                            value={classId || ""}
                                            onChange={(e) =>
                                                setClassId(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                --- Chọn lớp ---
                                            </option>
                                            {tutoringClasses ? (
                                                <>
                                                    {tutoringClasses?.map(
                                                        (item) => (
                                                            <option
                                                                value={item.id}
                                                                key={item.id}
                                                            >
                                                                {item.title}
                                                            </option>
                                                        ),
                                                    )}
                                                </>
                                            ) : (
                                                <option value="">
                                                    --- Không có lớp ---
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {classId && (
                                <>
                                    <div className="sub-tabs">
                                        {subTabs.map((t) => (
                                            <div
                                                key={t.key}
                                                className={`sub-tab ${
                                                    tabSubActive === t.key
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setTabSubActive(t.key);
                                                }}
                                            >
                                                {t.key === "schedule" &&
                                                    "Dạng lịch"}
                                                {t.key === "list" &&
                                                    "Dạng danh sách"}
                                            </div>
                                        ))}
                                    </div>

                                    {tabSubActive === "schedule" && (
                                        <Calendar
                                            localizer={localizer}
                                            events={events}
                                            startAccessor="start"
                                            endAccessor="end"
                                            defaultView={Views.WEEK}
                                            onSelectEvent={handleSelectEvent}
                                            views={[
                                                Views.WEEK,
                                                Views.DAY,
                                                Views.MONTH,
                                            ]}
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
                                            onRangeChange={
                                                handleRangeChangeClass
                                            }
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
                                                {groupSchedulesByWeekDays(
                                                    studySchedules,
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
                                                            {d.sessions.length >
                                                            0 ? (
                                                                d.sessions.map(
                                                                    (s) => (
                                                                        <TutorScheduleCard
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            day={
                                                                                d
                                                                            }
                                                                            firstDay={
                                                                                firstDay
                                                                            }
                                                                            session={
                                                                                s
                                                                            } // 👈 truyền session vào
                                                                        />
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p className="no-session">
                                                                    Không có
                                                                    buổi học
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
                    {tabActive === "group" && (
                        <>
                            <div className="form">
                                <div className="form-field">
                                    <label className="form-label">
                                        Chọn lớp học nhóm đang dạy
                                    </label>
                                    <div className="form-input-container">
                                        <CiTextAlignLeft className="form-input-icon" />
                                        <select
                                            className="form-input"
                                            value={classId || ""}
                                            onChange={(e) =>
                                                setClassId(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                --- Chọn lớp ---
                                            </option>
                                            {groupClasses ? (
                                                <>
                                                    {groupClasses?.map(
                                                        (item) => (
                                                            <option
                                                                value={item.id}
                                                                key={item.id}
                                                            >
                                                                {item.title}
                                                            </option>
                                                        ),
                                                    )}
                                                </>
                                            ) : (
                                                <option value="">
                                                    --- Không có lớp ---
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {classId && (
                                <>
                                    <div className="sub-tabs">
                                        {subTabs.map((t) => (
                                            <div
                                                key={t.key}
                                                className={`sub-tab ${
                                                    tabSubActive === t.key
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setTabSubActive(t.key);
                                                }}
                                            >
                                                {t.key === "schedule" &&
                                                    "Dạng lịch"}
                                                {t.key === "list" &&
                                                    "Dạng danh sách"}
                                            </div>
                                        ))}
                                    </div>

                                    {tabSubActive === "schedule" && (
                                        <Calendar
                                            localizer={localizer}
                                            events={events}
                                            startAccessor="start"
                                            endAccessor="end"
                                            defaultView={Views.WEEK}
                                            onSelectEvent={handleSelectEvent}
                                            views={[
                                                Views.WEEK,
                                                Views.DAY,
                                                Views.MONTH,
                                            ]}
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
                                            onRangeChange={
                                                handleRangeChangeClass
                                            }
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
                                                {groupSchedulesByWeekDays(
                                                    studySchedules,
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
                                                            {d.sessions.length >
                                                            0 ? (
                                                                d.sessions.map(
                                                                    (s) => (
                                                                        <TutorScheduleCard
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            day={
                                                                                d
                                                                            }
                                                                            firstDay={
                                                                                firstDay
                                                                            }
                                                                            session={
                                                                                s
                                                                            } // 👈 truyền session vào
                                                                        />
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p className="no-session">
                                                                    Không có
                                                                    buổi học
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
            </div>
        </section>
    );
};

export default TutorStudySchedulePage;
