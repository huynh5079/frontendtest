import { useEffect, useState, type FC } from "react";
import { PieChartStat } from "../../elements";
import { sampleData, useDocumentTitle } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectListAssignedClassForStudent,
    selectListOneOnOneTutorForStudent,
} from "../../../app/selector";
import { getAllOneOnOneTutorForStudentApiThunk } from "../../../services/student/learningSchedule/learningScheduleThunk";
import { getAllAssignedClassForStudentApiThunk } from "../../../services/student/class/classThunk";
import { CiTextAlignLeft } from "react-icons/ci";

const StudentReportLearning: FC = () => {
    const dispatch = useAppDispatch();
    const tutors = useAppSelector(selectListOneOnOneTutorForStudent) || [];
    const classes =
        useAppSelector(selectListAssignedClassForStudent)?.filter(
            (c) => c.classStatus === "Ongoing",
        ) || [];

    const [tab, setTab] = useState<string>("tutor");
    const [tutorId, setTutorId] = useState<string>("");
    const [classId, setClassId] = useState<string>("");

    // ------------------- Load dữ liệu cơ bản theo TAB -------------------
    useEffect(() => {
        if (tab === "tutor") {
            dispatch(getAllOneOnOneTutorForStudentApiThunk());
        }

        if (tab === "class") {
            dispatch(getAllAssignedClassForStudentApiThunk());
        }
    }, [tab, dispatch]);

    useDocumentTitle("Tiến độ học tập");

    return (
        <div className="student-report-learning">
            <h4>Thống kê học tập của bạn của bạn</h4>
            
            <div className="tabs">
                <div
                    className={`tab ${tab === "all" ? "active" : ""}`}
                    onClick={() => setTab("all")}
                >
                    Tất cả
                </div>
                <div
                    className={`tab ${tab === "tutor" ? "active" : ""}`}
                    onClick={() => setTab("tutor")}
                >
                    Học kèm
                </div>
                <div
                    className={`tab ${tab === "class" ? "active" : ""}`}
                    onClick={() => setTab("class")}
                >
                    Lớp học
                </div>
            </div>
            {tab === "all" && (
                <>
                    <PieChartStat data={sampleData} />
                </>
            )}
            {tab === "tutor" && (
                <>
                    <div className="form">
                        <div className="form-field">
                            <label className="form-label">Gia sư</label>
                            <div className="form-input-container">
                                <CiTextAlignLeft className="form-input-icon" />
                                <select
                                    className="form-input"
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

                    <PieChartStat data={sampleData} />
                </>
            )}
            {tab === "class" && (
                <>
                    <div className="form">
                        <div className="form-field">
                            <label className="form-label">
                                Lớp học đang học
                            </label>
                            <div className="form-input-container">
                                <CiTextAlignLeft className="form-input-icon" />
                                <select
                                    className="form-input"
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
                    <PieChartStat data={sampleData} />
                </>
            )}
        </div>
    );
};

export default StudentReportLearning;
