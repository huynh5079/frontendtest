import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useDocumentTitle } from "../../../utils/helper";

// mảng tên ngày tiếng Việt
const dayNames = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
];

const shifts = [
    { name: "Sáng", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Chiều", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Tối", slots: ["Slot 1", "Slot 2", "Slot 3"] },
];

// dữ liệu mẫu
const subjects: Record<
    string,
    {
        subject: string;
        teacher: string;
        time: string;
        id: string;
        attendance?: "có mặt" | "vắng";
    }
> = {
    "2025-09-08-Sáng-Slot 1": {
        subject: "Toán",
        teacher: "Thầy A",
        time: "7:00 - 8:30",
        id: "math101",
        attendance: "có mặt",
    },
    "2025-09-10-Chiều-Slot 2": {
        subject: "Văn",
        teacher: "Cô B",
        time: "14:00 - 15:30",
        id: "lit202",
        attendance: "vắng",
    },
    "2025-09-09-Tối-Slot 3": {
        subject: "Anh Văn",
        teacher: "Thầy C",
        time: "19:00 - 20:30",
        id: "eng303",
        attendance: "có mặt",
    },
    "2025-09-15-Sáng-Slot 1": {
        subject: "Toán",
        teacher: "Thầy A",
        time: "7:00 - 8:30",
        id: "math101",
    },
    "2025-09-16-Chiều-Slot 2": {
        subject: "Văn",
        teacher: "Cô B",
        time: "14:00 - 15:30",
        id: "lit202",
    },
    "2025-09-18-Tối-Slot 3": {
        subject: "Anh Văn",
        teacher: "Thầy C",
        time: "19:00 - 20:30",
        id: "eng303",
    },
};

// lấy range từ thứ 2 đến CN
const getWeekRange = (offset = 0) => {
    const startOfWeek = dayjs()
        .startOf("week")
        .add(1, "day")
        .add(offset, "week"); // Thứ 2
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
};

const ParentChildScheduleSchedule: FC = () => {
    const navigate = useNavigate();
    const [weekOffset, setWeekOffset] = useState(0);

    const weekDays = getWeekRange(weekOffset);
    const today = dayjs();

    const goToDetail = (id: string) => {
        navigate(`/subject/${id}`);
    };
    
    useDocumentTitle("Lịch học của con")

    return (
        <div className="parent-child-schedule">
            <div className="form">
                <div className="form-field">
                    <label className="form-label">Lớp</label>
                    <div className="form-input-container">
                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                        <select className="form-input">
                            <option value="">Phạm Công Lê Tuấn</option>
                            <option value="">Nguyễn Thị Yến Vy</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Bộ lọc tuần */}
            <div className="week-filter">
                <button
                    className="pr-btn"
                    onClick={() => setWeekOffset(weekOffset - 1)}
                >
                    Tuần trước
                </button>
                <button className="sc-btn" onClick={() => setWeekOffset(0)}>
                    Tuần này
                </button>
                <button
                    className="pr-btn"
                    onClick={() => setWeekOffset(weekOffset + 1)}
                >
                    Tuần sau
                </button>
            </div>

            {/* Ngày hiện tại */}
            <div className="today">
                <span>Hôm nay</span>: {today.format("DD/MM/YYYY")}
            </div>

            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Ca</th>
                        <th>Slot</th>
                        {weekDays.map((day) => {
                            const dayName = dayNames[day.day()];
                            return (
                                <th key={day.format("YYYY-MM-DD")}>
                                    {dayName} <br /> {day.format("DD/MM")}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {shifts.map((shift) =>
                        shift.slots.map((slot, i) => (
                            <tr key={`${shift.name}-${slot}`}>
                                {i === 0 && (
                                    <td rowSpan={shift.slots.length}>
                                        {shift.name}
                                    </td>
                                )}
                                <td>{slot}</td>
                                {weekDays.map((day) => {
                                    const key = `${day.format("YYYY-MM-DD")}-${
                                        shift.name
                                    }-${slot}`;
                                    const data = subjects[key];
                                    const isFuture = day.isAfter(today, "day");

                                    return (
                                        <td
                                            key={key}
                                            className={`slot-cell ${
                                                data ? "has-subject" : ""
                                            }`}
                                            onClick={() =>
                                                data && goToDetail(data.id)
                                            }
                                        >
                                            {data ? (
                                                <div>
                                                    <div className="subject">
                                                        {data.subject}
                                                    </div>
                                                    <div className="teacher">
                                                        {data.teacher}
                                                    </div>
                                                    <div className="time">
                                                        {data.time}
                                                    </div>
                                                    <div
                                                        className={`attendance ${
                                                            isFuture
                                                                ? "not-yet"
                                                                : data.attendance ===
                                                                  "có mặt"
                                                                ? "present"
                                                                : "absent"
                                                        }`}
                                                    >
                                                        {isFuture
                                                            ? "chưa học"
                                                            : data.attendance ??
                                                              "-"}
                                                    </div>
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        )),
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ParentChildScheduleSchedule;
