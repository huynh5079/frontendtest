import type { FC } from "react"

const TutorScheduleCard: FC = () => {
    return (
        <div className="tutor-schedule-card">
            <div className="student-name">Phạm Công Lê Tuấn</div>
            <div className="subject">Toán Lớp 8</div>
            <div className="time">7:00 - 8:30</div>
            <div className="format">Học tại nhà học viên</div>
        </div>
    )
}

export default TutorScheduleCard