import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailLearningScheduleForStudent,
    selectPublicTutor,
} from "../../../app/selector";
import { useSearchParams } from "react-router-dom";
import { getDetailScheduleLessonForStudentApiThunk } from "../../../services/student/learningSchedule/learningScheduleThunk";
import { formatTime, getModeText } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { publicGetDetailTutorApiThunk } from "../../../services/public/tutor/tutorThunk";
import LessonMaterialsView from "../../lessonMaterials/LessonMaterialsView";
import StudentManageQuiz from "./studentQuiz";

const StudentLessonDetail: FC = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "";

    const lessonId = tab.replace("schedule/lesson_detail/", "");

    const dispatch = useAppDispatch();
    const lesson = useAppSelector(selectDetailLearningScheduleForStudent);
    const tutorDetail = useAppSelector(selectPublicTutor);

    const [tabSubActive, setTabSubActive] = useState("lesson");

    useEffect(() => {
        dispatch(getDetailScheduleLessonForStudentApiThunk(lessonId!));
    }, [dispatch, lessonId]);

    useEffect(() => {
        if (!lesson) return;
        dispatch(publicGetDetailTutorApiThunk(String(lesson.tutorUserId)));
    }, [lesson, dispatch]);

    const handleTeach = (onlineStudyLink: string) => {
        window.open(onlineStudyLink, "_blank");
    };

    const handleViewClass = (id: string) => {
        navigateHook(`/student/information?tab=assigned_class&id=${id}`);
    };

    const handleViewTutor = (id: string) => {
        const url = routes.student.tutor.detail.replace(":id", id);
        navigateHook(url);
    };

    return (
        <div className="student-lesson-detail">
            <div className="detail-header">
                <h4 className="detail-title">Thông tin buổi học</h4>

                <button
                    className="sc-btn"
                    onClick={() =>
                        navigateHook(
                            routes.student.information + `?tab=schedule`,
                        )
                    }
                >
                    Quay lại
                </button>
            </div>

            <div className="sub-tabs">
                {["lesson", "material", "quiz"].map((t) => (
                    <div
                        key={t}
                        className={`sub-tab ${
                            tabSubActive === t ? "active" : ""
                        }`}
                        onClick={() => setTabSubActive(t)}
                    >
                        {t === "lesson" && "Buổi học"}
                        {t === "material" && "Tài liệu"}
                        {t === "quiz" && "Bài tập"}
                    </div>
                ))}
            </div>

            {tabSubActive === "lesson" && (
                <div className="detail-lesson">
                    <div className="detail-group">
                        <h3 className="group-title">Thông tin buổi học</h3>
                        <div className="group-content">
                            <div className="detail-item">
                                <h4>Chủ đề buổi học</h4>
                                <p>{lesson?.lessonTitle}</p>
                            </div>
                            <div className="detail-item">
                                <h4>Giờ bắt đầu</h4>
                                <p>{formatTime(lesson?.startTime!)}</p>
                            </div>

                            <div className="detail-item">
                                <h4>Giờ kết thúc</h4>
                                <p>{formatTime(lesson?.endTime!)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="detail-group">
                        <h3 className="group-title">Thông tin lớp</h3>
                        <div className="group-content">
                            <div className="detail-item">
                                <h4>Môn học</h4>
                                <p>{lesson?.subject}</p>
                            </div>
                            <div className="detail-item">
                                <h4>Cấp bậc lớp</h4>
                                <p>{lesson?.educationLevel}</p>
                            </div>
                            <div className="detail-item">
                                <h4>Hình thức lớp</h4>
                                <p>{getModeText(lesson?.mode)}</p>
                            </div>
                            {lesson?.mode === "Online" ? (
                                <div className="detail-item">
                                    <h4>Link học trực tuyến</h4>
                                    <p>{lesson?.onlineStudyLink}</p>
                                </div>
                            ) : (
                                <div className="detail-item">
                                    <h4>Địa chỉ lớp</h4>
                                    <p>{lesson?.location}</p>
                                </div>
                            )}
                        </div>
                        <button
                            className="pr-btn"
                            onClick={() => handleViewClass(lesson?.classId!)}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                    <div className="detail-group">
                        <h3 className="group-title">Thông tin gia sư</h3>
                        <div className="group-content">
                            <div className="detail-item">
                                <h4>Họ và tên</h4>
                                <p>{tutorDetail?.username}</p>
                            </div>
                            <div className="detail-item">
                                <h4>Môn dạy</h4>
                                <p>{tutorDetail?.teachingSubjects}</p>
                            </div>
                            <div className="detail-item">
                                <h4>Cấp bậc dạy học</h4>
                                <p>{tutorDetail?.educationLevel}</p>
                            </div>
                        </div>
                        <button
                            className="pr-btn"
                            onClick={() =>
                                handleViewTutor(lesson?.tutorUserId!)
                            }
                        >
                            Xem chi tiết
                        </button>
                    </div>

                    {lesson?.mode === "Online" && (
                        <button
                            className="pr-btn"
                            onClick={() =>
                                handleTeach(lesson?.onlineStudyLink!)
                            }
                        >
                            Vào lớp
                        </button>
                    )}
                </div>
            )}

            {tabSubActive === "material" && (
                <div className="detail-group">
                    <h3 className="group-title">Tài liệu học tập</h3>
                    <LessonMaterialsView lessonId={lessonId} isTutor={false} />
                </div>
            )}

            {tabSubActive === "quiz" && (
                <div className="detail-group">
                    <h3 className="group-title">Bài tập</h3>
                    <StudentManageQuiz lessonId={lessonId} />
                </div>
            )}
        </div>
    );
};

export default StudentLessonDetail;
