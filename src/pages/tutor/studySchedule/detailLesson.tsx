import { FC, Fragment, useEffect, useState } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { getDetailScheduleLessonForTutorApiThunk } from "../../../services/tutor/schedule/tutorScheduleThunk";
import { selectDetailScheduleForTutor } from "../../../app/selector";
import {
    formatTime,
    getAttendanceText,
    getModeText,
} from "../../../utils/helper";
import { markAttendanceManyStudentsForTutorApiThunk } from "../../../services/tutor/attendance/tutorAttendanceThunk";
import { toast } from "react-toastify";
import { Modal } from "../../../components/modal";
import { LoadingSpinner } from "../../../components/elements";
import LessonMaterialsView from "../../../components/lessonMaterials/LessonMaterialsView";
import TutorManageQuiz from "../../../components/tutor/manage/lesson/quiz";

interface TutorDetailLessonPageProps {}

const TutorDetailLessonPage: FC<TutorDetailLessonPageProps> = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const lesson = useAppSelector(selectDetailScheduleForTutor);

    const [tabSubActive, setTabSubActive] = useState("lesson");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = () => {
        const initial: any = {};
        lesson?.students.forEach((s) => {
            initial[s.studentId] = "Present"; // default
        });
        setAttendanceMap(initial);
        setShowModal(true);
    };

    const [showModal, setShowModal] = useState(false);

    const [attendanceMap, setAttendanceMap] = useState<{
        [studentId: string]: "Present" | "Absent";
    }>({});

    const canCheckAttendance = () => {
        if (!lesson?.startTime) return false;

        const now = new Date();

        const start = new Date(lesson.startTime);
        const fifteenMinutesBefore = new Date(start.getTime() - 15 * 60 * 1000);

        // 00:00 của ngày hôm đó
        const endOfDay = new Date(start);
        endOfDay.setHours(23, 59, 59, 999);

        return now >= fifteenMinutesBefore && now <= endOfDay;
    };

    const submitAttendanceMany = () => {
        setIsSubmitting(true);
        dispatch(
            markAttendanceManyStudentsForTutorApiThunk({
                lessonId: id!,
                params: {
                    notes: "",
                    studentStatusMap: attendanceMap,
                },
            }),
        )
            .unwrap()
            .then(() => {
                toast.success("Điểm danh thành công");
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra!");
            })
            .finally(() => {
                setIsSubmitting(false);
                setShowModal(false);
                dispatch(getDetailScheduleLessonForTutorApiThunk(id!));
            });
    };

    const setStatus = (studentId: string, status: "Present" | "Absent") => {
        setAttendanceMap((prev) => ({
            ...prev,
            [studentId]: status,
        }));
    };

    useEffect(() => {
        dispatch(getDetailScheduleLessonForTutorApiThunk(id!));
    }, [dispatch, id]);

    const handleViewClass = (classId: string) => {
        const url = routes.tutor.class.detail.replace(":id", classId);
        navigateHook(url);
    };

    const handleTeach = (onlineStudyLink: string) => {
        window.open(onlineStudyLink, "_blank");
    };

    return (
        <section id="tutor-lesson-detail-section">
            <div className="tlds-container">
                <div className="tldscr1">
                    <h4>Chi tiết</h4>
                    <p>
                        Trang tổng quát <span>Buổi học</span>
                    </p>
                </div>
                <div className="tldscr3">
                    <button
                        className="pr-btn"
                        onClick={() =>
                            navigateHook(routes.tutor.study_schedule)
                        }
                    >
                        Quay lại
                    </button>
                </div>
                <div className="tldscr4">
                    <div className="tldscr4r1">
                        <div className="sub-tabs">
                            {["lesson", "student", "material", "quiz"].map(
                                (t) => (
                                    <div
                                        key={t}
                                        className={`sub-tab ${
                                            tabSubActive === t ? "active" : ""
                                        }`}
                                        onClick={() => setTabSubActive(t)}
                                    >
                                        {t === "lesson" && "Buổi học"}
                                        {t === "student" && "Học sinh"}
                                        {t === "material" && "Tài liệu"}
                                        {t === "quiz" && "Bài tập"}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                    <div className="tldscr4r2">
                        {tabSubActive === "lesson" && (
                            <div className="detail-lesson">
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin buổi học
                                    </h3>
                                    <div className="group-content">
                                        <div className="detail-item">
                                            <h4>Chủ đề buổi học</h4>
                                            <p>{lesson?.title}</p>
                                        </div>
                                        <div className="detail-item">
                                            <h4>Giờ bắt đầu</h4>
                                            <p>
                                                {formatTime(lesson?.startTime!)}
                                            </p>
                                        </div>

                                        <div className="detail-item">
                                            <h4>Giờ kết thúc</h4>
                                            <p>
                                                {formatTime(lesson?.endTime!)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin lớp
                                    </h3>
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
                                        onClick={() =>
                                            handleViewClass(lesson?.classId!)
                                        }
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                                {lesson?.mode === "Online" && (
                                    <button
                                        className="pr-btn"
                                        onClick={() =>
                                            handleTeach(
                                                lesson?.onlineStudyLink!,
                                            )
                                        }
                                    >
                                        Vào dạy
                                    </button>
                                )}
                            </div>
                        )}
                        {tabSubActive === "student" && (
                            <div className="detail-lesson">
                                <div className="detail-group">
                                    <h3 className="group-title">
                                        Thông tin học sinh
                                    </h3>
                                    <div className="group-content">
                                        {lesson?.students.map((s) => (
                                            <div
                                                key={s.studentId}
                                                className="detail-item"
                                            >
                                                <h4>{s.fullName}</h4>
                                                <div className="schedule-item">
                                                    <h4 className="schedule-day">
                                                        Điểm danh
                                                    </h4>
                                                    <p className="schedule-time">
                                                        {getAttendanceText(
                                                            s.attendanceStatus,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className={!canCheckAttendance() ? "disable-btn" : "pr-btn"}
                                    onClick={openModal}
                                    disabled={!canCheckAttendance()}
                                >
                                    Điểm danh
                                </button>

                                <p
                                    style={{
                                        color: "red",
                                        fontSize: "20px",
                                        textAlign: "center",
                                    }}
                                >
                                    Chỉ được điểm danh từ 15 phút trước giờ học
                                    đến 00:00 cùng ngày.
                                </p>
                            </div>
                        )}
                        {tabSubActive === "material" && (
                            <div className="detail-group">
                                <h3 className="group-title">
                                    Tài liệu học tập
                                </h3>

                                <LessonMaterialsView
                                    lessonId={id!}
                                    isTutor={true}
                                />
                            </div>
                        )}
                        {tabSubActive === "quiz" && (
                            <div className="detail-group">
                                <h3 className="group-title">Bài tập</h3>
                                <TutorManageQuiz lessonId={id!} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                setIsOpen={setShowModal}
                title="Điểm danh học sinh"
            >
                <div className="modal-student-list">
                    {lesson?.students.map((s) => (
                        <div key={s.studentId} className="modal-student-item">
                            <div className="info">
                                <img src={s.avatarUrl} alt="" />
                                <p>{s.fullName}</p>
                            </div>
                            <div className="btn-group">
                                <button
                                    className={
                                        attendanceMap[s.studentId] === "Present"
                                            ? "btn-active"
                                            : "btn-normal"
                                    }
                                    onClick={() =>
                                        setStatus(s.studentId, "Present")
                                    }
                                >
                                    Có mặt
                                </button>

                                <button
                                    className={
                                        attendanceMap[s.studentId] === "Absent"
                                            ? "btn-active-absent"
                                            : "btn-normal"
                                    }
                                    onClick={() =>
                                        setStatus(s.studentId, "Absent")
                                    }
                                >
                                    Vắng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button
                        className={isSubmitting ? "disable-btn" : "pr-btn"}
                        onClick={submitAttendanceMany}
                    >
                        {isSubmitting ? <LoadingSpinner /> : "Xác nhận"}
                    </button>
                    <button
                        className="sc-btn"
                        onClick={() => setShowModal(false)}
                    >
                        Hủy
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default TutorDetailLessonPage;
