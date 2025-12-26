import { useEffect, useState, type FC } from "react";
import { PieChartStat } from "../../elements";
import {
    formatDate,
    formatTime,
    getAttendanceText,
    useDocumentTitle,
} from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectAttendanceForStudent,
    selectListAssignedClassForStudent,
} from "../../../app/selector";
import { getAllAssignedClassForStudentApiThunk } from "../../../services/student/class/classThunk";
import { getAttendanceForStudentApiThunk } from "../../../services/attendance/attendanceThunk";
import { useMemo } from "react";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";

const StudentReportLearning: FC = () => {
    const dispatch = useAppDispatch();
    const classes =
        useAppSelector(selectListAssignedClassForStudent)?.filter(
            (c) => c.classStatus === "Ongoing",
        ) || [];
    const attendance = useAppSelector(selectAttendanceForStudent);

    const attendanceChartData = useMemo(() => {
        if (!attendance) return [];

        return [
            { name: "Có mặt", value: attendance.presentCount },
            {
                name: "Chưa học",
                value:
                    attendance.totalLessons -
                    (attendance.presentCount +
                        attendance.absentCount +
                        attendance.excusedCount +
                        attendance.lateCount),
            },
            { name: "Vắng", value: attendance.absentCount },
        ];
    }, [attendance]);

    const [classId, setClassId] = useState("");
    const [tabSubActive, setTabSubActive] = useState("list");

    // ------------------- Load dữ liệu cơ bản theo TAB -------------------
    useEffect(() => {
        dispatch(getAllAssignedClassForStudentApiThunk());
    }, [dispatch]);

    useEffect(() => {
        if (classId) {
            dispatch(getAttendanceForStudentApiThunk(classId));
        }
    }, [dispatch, classId]);

    useDocumentTitle("Tiến độ học tập");

    const handleViewDetail = (lessonId: string) => {
        const url =
            routes.student.information +
            `?tab=schedule/lesson_detail/${lessonId}`;
        navigateHook(url);
    };

    return (
        <div className="student-report-learning">
            <h4>Thống kê học tập của bạn</h4>

            <div className="srlr2">
                <div className="srlr2c1">
                    <h5>Danh sách lớp đang học</h5>
                    <ul>
                        {classes && classes.length > 0 ? (
                            classes.map((c) => (
                                <li
                                    key={c.classId}
                                    onClick={() => setClassId(c.classId)}
                                    className={
                                        classId === c.classId ? "actived" : ""
                                    }
                                >
                                    <p>
                                        {c.subject} {c.educationLevel} – Thầy{" "}
                                        {c.tutorName}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p className="" style={{ fontSize: "1.5rem" }}>
                                Chưa có lớp học nào
                            </p>
                        )}
                    </ul>
                </div>
                {classId ? (
                    <>
                        <div className="srlr2c2">
                            <div className="sub-tabs">
                                {["list", "stat"].map((t) => (
                                    <div
                                        key={t}
                                        className={`sub-tab ${
                                            tabSubActive === t ? "active" : ""
                                        }`}
                                        onClick={() => {
                                            setTabSubActive(t);
                                        }}
                                    >
                                        {t === "list" && "Danh sách"}
                                        {t === "stat" && "Thống kê"}
                                    </div>
                                ))}
                            </div>
                            {tabSubActive === "list" && (
                                <>
                                    <h5>Danh sách điểm danh</h5>
                                    <table className="table">
                                        <thead className="table-head">
                                            <tr className="table-head-row">
                                                <th className="table-head-cell">
                                                    Buổi học
                                                </th>
                                                <th className="table-head-cell">
                                                    Ngày
                                                </th>
                                                <th className="table-head-cell">
                                                    Thời gian
                                                </th>
                                                <th className="table-head-cell">
                                                    Trạng thái
                                                </th>
                                                <th className="table-head-cell">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="table-body">
                                            {attendance?.lessons.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="no-data"
                                                    >
                                                        Không có buổi học nào
                                                    </td>
                                                </tr>
                                            ) : (
                                                attendance?.lessons?.map(
                                                    (l, index) => (
                                                        <tr key={index}>
                                                            <td className="table-body-cell">
                                                                Buổi{" "}
                                                                {l.lessonNumber}
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {formatDate(
                                                                    l.lessonDate,
                                                                )}
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {formatTime(
                                                                    l.startTime,
                                                                )}{" "}
                                                                -{" "}
                                                                {formatTime(
                                                                    l.endTime,
                                                                )}
                                                            </td>
                                                            <td className="table-body-cell">
                                                                {getAttendanceText(
                                                                    l.status,
                                                                )}
                                                            </td>
                                                            <td className="table-body-cell">
                                                                <button
                                                                    className="pr-btn"
                                                                    onClick={() =>
                                                                        handleViewDetail(
                                                                            l.lessonId,
                                                                        )
                                                                    }
                                                                >
                                                                    Xem
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                            {tabSubActive === "stat" && (
                                <>
                                    <h5>Thống kê điểm danh</h5>
                                    {attendanceChartData.length > 0 ? (
                                        <PieChartStat
                                            data={attendanceChartData}
                                        />
                                    ) : (
                                        <p>Chưa có dữ liệu điểm danh</p>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="srlr2c2">
                        <h6>Vui lòng chọn lớp để xem thống kê</h6>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentReportLearning;
