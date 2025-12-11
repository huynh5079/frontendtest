import { useEffect, useState, type FC } from "react";
import {
    Calendar,
    dateFnsLocalizer,
    Views,
    type Event as RBCEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { vi } from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectListScheduleForTutor,
    selectProfileTutor,
} from "../../../app/selector";
import { getAllScheduleForTutorApiThunk } from "../../../services/tutor/schedule/tutorScheduleThunk";
import { formatDateReverse, useDocumentTitle } from "../../../utils/helper";
import {
    CreateAvailabilityBlockForTutorModal,
    DeleteAvailabilityBlockForTutorModal,
} from "../../../components/modal";
import type { ScheduleForTutor } from "../../../types/tutor";
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

// ------------------- Component -------------------
type FilterType = "ALL" | "BLOCK" | "LESSON";

const TutorSchedulePage: FC = () => {
    const dispatch = useAppDispatch();
    const tutorProfile = useAppSelector(selectProfileTutor);
    const schedules = useAppSelector(selectListScheduleForTutor) || [];

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] =
        useState<ScheduleForTutor | null>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState<FilterType>("ALL");

    // Tính ngày đầu/cuối tuần để call API
    const startOfWeekDate = formatDateReverse(
        format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    );
    const endOfWeekDate = formatDateReverse(
        format(
            startOfWeek(currentDate, { weekStartsOn: 1 }).setDate(
                startOfWeek(currentDate, { weekStartsOn: 1 }).getDate() + 6,
            ),
            "yyyy-MM-dd",
        ),
    );

    // Call API khi tuần thay đổi
    useEffect(() => {
        if (!tutorProfile?.tutorProfileId) return;

        dispatch(
            getAllScheduleForTutorApiThunk({
                tutorProfileId: tutorProfile.tutorProfileId,
                startDate: startOfWeekDate,
                endDate: endOfWeekDate,
            }),
        );
    }, [
        dispatch,
        tutorProfile?.tutorProfileId,
        startOfWeekDate,
        endOfWeekDate,
    ]);

    // Chuyển schedule sang Event
    const events: RBCEvent[] = schedules.map((s) => ({
        id: s.id,
        title: s.entryType === "BLOCK" ? "Lịch bận" : "Buổi dạy",
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        resource: s,
    }));

    // Lọc event theo filter
    const filteredEvents = events.filter((e) => {
        const entryType = (e.resource as ScheduleForTutor)?.entryType;
        if (filter === "ALL") return true;
        if (filter === "BLOCK") return entryType === "BLOCK";
        if (filter === "LESSON") return entryType !== "BLOCK";
        return true;
    });

    // Style cho event
    const eventStyleGetter = (event: RBCEvent) => {
        const entryType = (event.resource as ScheduleForTutor)?.entryType;
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
    const handleSelectEvent = (event: RBCEvent) => {
        const schedule = event.resource as ScheduleForTutor;
        if (schedule.entryType === "BLOCK") {
            setSelectedSchedule(schedule);
            setIsDeleteModalOpen(true);
        }
    };

    useDocumentTitle("Lịch Cá Nhân");

    return (
        <section id="tutor-schedule-section">
            <div className="tss-container">
                <div className="tsscr1">
                    <h4>Lịch Cá Nhân</h4>
                    <p>
                        Trang tổng quát <span>Lịch cá nhân</span>
                    </p>
                </div>

                {/* Bộ lọc */}
                <div className="tsscr2">
                    <div
                        className={`tsscr2-item ${
                            filter === "ALL" ? "active" : ""
                        }`}
                        onClick={() => setFilter("ALL")}
                    >
                        <FaListUl className="tsscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                        </div>
                    </div>
                    <div
                        className={`tsscr2-item ${
                            filter === "BLOCK" ? "active" : ""
                        }`}
                        onClick={() => setFilter("BLOCK")}
                    >
                        <FaArrowCircleUp className="tsscr2-item-icon" />
                        <div className="amount">
                            <h5>Lịch bận</h5>
                        </div>
                    </div>
                    <div
                        className={`tsscr2-item ${
                            filter === "LESSON" ? "active" : ""
                        }`}
                        onClick={() => setFilter("LESSON")}
                    >
                        <FaArrowCircleDown className="tsscr2-item-icon" />
                        <div className="amount">
                            <h5>Lịch dạy</h5>
                        </div>
                    </div>
                </div>

                <div className="tsscr3">
                    <button
                        className="pr-btn"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Tạo lịch bận
                    </button>
                </div>

                <div className="tsscr4">
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents} // ← filteredEvents
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%", borderRadius: "8px" }}
                        defaultView={Views.WEEK}
                        views={[Views.WEEK, Views.DAY, Views.MONTH]}
                        selectable
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        popup
                        messages={{
                            next: "Tuần sau",
                            previous: "Tuần trước",
                            today: "Hôm nay",
                            week: "Tuần",
                        }}
                        onRangeChange={(range: any) => {
                            // range là mảng ngày cho Week/Month, hoặc object cho Day
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

                            if (tutorProfile?.tutorProfileId) {
                                dispatch(
                                    getAllScheduleForTutorApiThunk({
                                        tutorProfileId:
                                            tutorProfile.tutorProfileId,
                                        startDate: startStr,
                                        endDate: endStr,
                                    }),
                                );
                            }
                        }}
                    />
                </div>
            </div>

            {/* Modal tạo lịch bận */}
            <CreateAvailabilityBlockForTutorModal
                isOpen={isCreateModalOpen}
                setIsOpen={setIsCreateModalOpen}
                startDateProps={startOfWeekDate}
                endDateProps={endOfWeekDate}
            />

            {/* Modal xóa lịch bận */}
            {selectedSchedule && (
                <DeleteAvailabilityBlockForTutorModal
                    isOpen={isDeleteModalOpen}
                    setIsOpen={setIsDeleteModalOpen}
                    startDateProps={startOfWeekDate}
                    endDateProps={endOfWeekDate}
                    selectedAvailabilityBlock={selectedSchedule}
                />
            )}
        </section>
    );
};

export default TutorSchedulePage;
