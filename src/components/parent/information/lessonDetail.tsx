import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDetailChildScheduleForParent,
    selectPublicTutor,
} from "../../../app/selector";
import { useSearchParams } from "react-router-dom";
import { formatTime, getModeText } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { publicGetDetailTutorApiThunk } from "../../../services/public/tutor/tutorThunk";
import { getDetailChildScheduleLessonForParentApiThunk } from "../../../services/parent/childSchedule/childScheduleThunk";

const ParentLessonDetail: FC = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "";

    const lessonId = tab.replace("schedule/lesson_detail/", "");

    const dispatch = useAppDispatch();
    const lesson = useAppSelector(selectDetailChildScheduleForParent);
    const tutorDetail = useAppSelector(selectPublicTutor);

    useEffect(() => {
        dispatch(getDetailChildScheduleLessonForParentApiThunk(lessonId!));
    }, [dispatch, lessonId]);

    useEffect(() => {
        if (!lesson) return;
        dispatch(publicGetDetailTutorApiThunk(String(lesson.tutorUserId)));
    }, [lesson, dispatch]);

    const handleTeach = (onlineStudyLink: string) => {
        window.open(onlineStudyLink, "_blank");
    };

    const handleViewClass = (id: string) => {
        navigateHook(`/parent/information?tab=assigned_class&id=${id}`);
    };

    const handleViewTutor = (id: string) => {
        const url = routes.parent.tutor.detail.replace(":id", id);
        navigateHook(url);
    };

    return (
        <div className="parent-lesson-detail">
            <h4 className="detail-title">Thông tin buổi học</h4>

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
                        onClick={() => handleViewTutor(lesson?.tutorUserId!)}
                    >
                        Xem chi tiết
                    </button>
                </div>

                {lesson?.mode === "Online" && (
                    <button
                        className="pr-btn"
                        onClick={() => handleTeach(lesson?.onlineStudyLink!)}
                    >
                        Vào lớp
                    </button>
                )}
            </div>
        </div>
    );
};

export default ParentLessonDetail;
