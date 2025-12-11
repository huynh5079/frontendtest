import type { FC } from "react";
import { format, addDays } from "date-fns";
import { routes } from "../../routes/routeName";
import { navigateHook } from "../../routes/routeApp";

interface TutorScheduleCardProps {
    day: any;
    firstDay: Date;
    session: any; // 👈 thêm vào
}

const TutorScheduleCard: FC<TutorScheduleCardProps> = ({
    day,
    firstDay,
    session,
}) => {
    // Trả về đúng ngày của 1 thứ trong tuần, với firstDay = Monday
    const getDateOfSpecificWeekday = (
        monday: Date,
        weekday: number // weekday: 0=CN,1=T2,...6=T7
    ) => {
        // Map weekday sang offset tính theo Monday
        const offset = weekday === 0 ? 6 : weekday - 1;
        return addDays(monday, offset);
    };

    const handleViewDetail = (lessonId: string) => {
        const url = routes.tutor.lesson_detail.replace(":id", lessonId);
        navigateHook(url);
    };

    return (
        <div className="tutor-schedule-card">
            <h4>
                Buổi học ngày –{" "}
                {format(
                    getDateOfSpecificWeekday(firstDay, day.key),
                    "dd/MM/yyyy"
                )}
            </h4>

            <div className="schedule-item">
                <p className="schedule-day">Giờ bắt đầu</p>
                <p className="schedule-time">
                    {format(new Date(session.startTime), "HH:mm")}
                </p>
            </div>

            <div className="schedule-item">
                <p className="schedule-day">Giờ kết thúc</p>
                <p className="schedule-time">
                    {format(new Date(session.endTime), "HH:mm")}
                </p>
            </div>

            <button
                className="pr-btn"
                onClick={() => handleViewDetail(session.lessonId)}
            >
                Xem chi tiết
            </button>
        </div>
    );
};

export default TutorScheduleCard;
