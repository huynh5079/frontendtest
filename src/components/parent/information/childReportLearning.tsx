import { useEffect, useMemo, useState, type FC } from "react";
import { PieChartStat } from "../../elements";
import {
    formatDate,
    formatTime,
    getAttendanceText,
    useDocumentTitle,
} from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectAttendanceForParent,
    selectListAssignedClassForParent,
    selectListChildAccount,
} from "../../../app/selector";
import { getAllChildAccountApiThunk } from "../../../services/parent/childAccount/childAccountThunk";
import { CiTextAlignLeft } from "react-icons/ci";
import { getAllAssignedClassForParentApiThunk } from "../../../services/parent/class/parentClassThunk";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";
import { getAttendanceForParentApiThunk } from "../../../services/attendance/attendanceThunk";

const ParentChildReportLearning: FC = () => {
    const dispatch = useAppDispatch();
    const childAccounts = useAppSelector(selectListChildAccount);
    const childClasses =
        useAppSelector(selectListAssignedClassForParent)?.filter(
            (c) => c.classStatus === "Ongoing",
        ) || [];
    const childAttendance = useAppSelector(selectAttendanceForParent);

    const attendanceChartData = useMemo(() => {
        if (!childAttendance) return [];

        return [
            { name: "Có mặt", value: childAttendance.presentCount },
            {
                name: "Chưa học",
                value:
                    childAttendance.totalLessons -
                    (childAttendance.presentCount +
                        childAttendance.absentCount +
                        childAttendance.excusedCount +
                        childAttendance.lateCount),
            },
            { name: "Vắng", value: childAttendance.absentCount },
        ];
    }, [childAttendance]);

    const [tabSubActive, setTabSubActive] = useState("list");
    const [childProfileId, setChildProfileId] = useState<string>("");
    const [classId, setClassId] = useState("");

    useEffect(() => {
        dispatch(getAllChildAccountApiThunk());
    }, [dispatch]);

    useEffect(() => {
        if (childProfileId) {
            dispatch(getAllAssignedClassForParentApiThunk(childProfileId!));
        }
    }, [childProfileId, dispatch]);

    useEffect(() => {
        if (classId && childProfileId) {
            dispatch(
                getAttendanceForParentApiThunk({
                    classId: classId!,
                    studentId: childProfileId!,
                }),
            );
        }
    }, [dispatch, classId]);

    const handleViewDetail = (lessonId: string) => {
        const url =
            routes.parent.information +
            `?tab=schedule/lesson_detail/${lessonId}`;
        navigateHook(url);
    };

    useDocumentTitle("Báo cáo tiến độ học tập của con");

    return (
        <div className="parent-child-report-learning">
            <h4>Thống kê học tập của con</h4>

            <div className="form">
                <div className="form-field">
                    <label className="form-label">Chọn tài khoản của con</label>
                    <div className="form-input-container">
                        <CiTextAlignLeft className="form-input-icon" />
                        <select
                            className="form-input"
                            value={childProfileId}
                            onChange={(e) => {
                                setChildProfileId(e.target.value);
                                setClassId("");
                            }}
                        >
                            <option value="">--- Chọn tài khoản ---</option>
                            {childAccounts?.map((t) => (
                                <option key={t.studentId} value={t.studentId}>
                                    {t.username}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {childProfileId && (
                <div className="pcrlr2">
                    <div className="pcrlr2c1">
                        <h5>Danh sách lớp đăng học</h5>
                        <ul>
                            {childClasses.map((c) => (
                                <li
                                    key={c.classId}
                                    onClick={() => setClassId(c.classId)}
                                    className={
                                        classId === c.classId ? "actived" : ""
                                    }
                                >
                                    <p>
                                        {c.subject} {c.educationLevel} - Thầy{" "}
                                        {c.tutorName}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {classId ? (
                        <>
                            <div className="pcrlr2c2">
                                <div className="sub-tabs">
                                    {["list", "stat"].map((t) => (
                                        <div
                                            key={t}
                                            className={`sub-tab ${
                                                tabSubActive === t
                                                    ? "active"
                                                    : ""
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
                                                {childAttendance?.lessons
                                                    .length === 0 ? (
                                                    <tr className="table-body-row">
                                                        <td colSpan={5}>
                                                            Không có buổi học
                                                            nào
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    childAttendance?.lessons?.map(
                                                        (l, index) => (
                                                            <tr key={index}>
                                                                <td className="table-body-cell">
                                                                    Buổi{" "}
                                                                    {
                                                                        l.lessonNumber
                                                                    }
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
                        <div className="pcrlr2c2">
                            <h6>Vui lòng chọn lớp để xem thống kê</h6>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParentChildReportLearning;
