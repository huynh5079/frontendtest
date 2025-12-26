import { type FC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    StudentRequestFindTutor,
    StudentChangePassword,
    StudentInformtionSidebar,
    StudentReportLearning,
    StudentSchedule,
    StudentWallet,
    StudentBookingTutor,
    StudentProfile,
    StudentAssignedClass,
    StudentNotifilcation,
    StudentLessonDetail,
    StudentListReschedule,
    StudentFavoriteTutor,
} from "../../../components/student/information";
import VideoPlayerWithAnalysis from "../../../components/videoAnalysis/VideoPlayerWithAnalysis";
import { useAppSelector, useAppDispatch } from "../../../app/store";
import { getLessonMaterialsApiThunk } from "../../../services/lessonMaterials/lessonMaterialsThunk";
import { LoadingSpinner } from "../../../components/elements";
import { navigateHook } from "../../../routes/routeApp";
import { ChatPage } from "../../system/chat";

const StudentInformationPage: FC = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "profile";
    const dispatch = useAppDispatch();
    const lessonMaterialsState = useAppSelector(
        (state: any) => state.lessonMaterials
    );
    const materials = lessonMaterialsState?.materials || [];
    const isLoadingMaterials = lessonMaterialsState?.isLoading || false;
    const materialsError = lessonMaterialsState?.error || null;

    // Load materials khi có video route
    useEffect(() => {
        const videoMatch = tab.match(
            /schedule\/lesson_detail\/([^/]+)\/video\/([^/]+)/
        );
        if (videoMatch) {
            const [, lessonId] = videoMatch;
            if (lessonId) {
                dispatch(getLessonMaterialsApiThunk(lessonId));
            }
        }
    }, [tab, dispatch]);

    const renderContent = () => {
        // Xử lý route video analysis: schedule/lesson_detail/{lessonId}/video/{videoId}
        const videoMatch = tab.match(
            /schedule\/lesson_detail\/([^/]+)\/video\/([^/]+)/
        );
        if (videoMatch) {
            const [, lessonId, videoId] = videoMatch;

            // Nếu đang load materials, hiển thị loading
            if (isLoadingMaterials) {
                return (
                    <div>
                        <div
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                            }}
                        >
                            <button
                                onClick={() => {
                                    navigateHook(
                                        `/student/information?tab=schedule/lesson_detail/${lessonId}`
                                    );
                                }}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                ← Quay lại
                            </button>
                            <h2>Phân tích video bài giảng</h2>
                        </div>
                        <div style={{ padding: "20px", textAlign: "center" }}>
                            <LoadingSpinner />
                            <p>Đang tải thông tin video...</p>
                        </div>
                    </div>
                );
            }

            const video = materials?.find((m: any) => m.id === videoId);
            if (video && video.url) {
                return (
                    <div>
                        <div
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                            }}
                        >
                            <button
                                onClick={() => {
                                    navigateHook(
                                        `/student/information?tab=schedule/lesson_detail/${lessonId}`
                                    );
                                }}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                ← Quay lại
                            </button>
                            <h2>Phân tích video bài giảng</h2>
                        </div>
                        <VideoPlayerWithAnalysis
                            lessonId={lessonId}
                            mediaId={videoId}
                            videoUrl={video.url}
                            fileName={video.fileName}
                            isTutor={false}
                        />
                    </div>
                );
            }

            // Nếu có lỗi khi load materials
            if (materialsError) {
                return (
                    <div>
                        <div
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                            }}
                        >
                            <button
                                onClick={() => {
                                    navigateHook(
                                        `/student/information?tab=schedule/lesson_detail/${lessonId}`
                                    );
                                }}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                ← Quay lại
                            </button>
                            <h2>Phân tích video bài giảng</h2>
                        </div>
                        <div style={{ padding: "20px", textAlign: "center" }}>
                            <p style={{ color: "red" }}>
                                Lỗi khi tải tài liệu: {materialsError}
                            </p>
                            <button
                                className="pr-btn"
                                onClick={() => {
                                    const videoMatch = tab.match(
                                        /schedule\/lesson_detail\/([^/]+)\/video\/([^/]+)/
                                    );
                                    if (videoMatch) {
                                        const [, lessonId] = videoMatch;
                                        if (lessonId) {
                                            dispatch(
                                                getLessonMaterialsApiThunk(
                                                    lessonId
                                                )
                                            );
                                        }
                                    }
                                }}
                                style={{
                                    marginTop: "10px",
                                    padding: "0.5rem 1rem",
                                }}
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                );
            }

            // Nếu không tìm thấy video hoặc không có URL
            return (
                <div>
                    <div
                        style={{
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                        }}
                    >
                        <button
                            onClick={() => {
                                navigateHook(
                                    `/student/information?tab=schedule/lesson_detail/${lessonId}`
                                );
                            }}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            ← Quay lại
                        </button>
                        <h2>Phân tích video bài giảng</h2>
                    </div>
                    <div style={{ padding: "20px", textAlign: "center" }}>
                        <p style={{ color: "#666" }}>
                            Không tìm thấy video hoặc video chưa được tải lên.
                        </p>
                        <p
                            style={{
                                color: "#999",
                                fontSize: "14px",
                                marginTop: "10px",
                            }}
                        >
                            Vui lòng đảm bảo bạn đã tham gia lớp học này và
                            video đã được gia sư tải lên.
                        </p>
                    </div>
                </div>
            );
        }

        if (tab.startsWith("schedule/lesson_detail/")) {
            return <StudentLessonDetail />;
        }

        switch (tab) {
            case "change-password":
                return <StudentChangePassword />;
            case "wallet":
                return <StudentWallet />;
            case "schedule":
                return <StudentSchedule />;
            case "booking_tutor":
                return <StudentBookingTutor />;
            case "request":
                return <StudentRequestFindTutor />;
            case "report":
                return <StudentReportLearning />;
            case "assigned_class":
                return <StudentAssignedClass />;
            case "notification":
                return <StudentNotifilcation />;
            case "reschedule":
                return <StudentListReschedule />;
            case "favorite":
                return <StudentFavoriteTutor />;
            case "chat":
                return <ChatPage />;
            case "profile":
            default:
                return <StudentProfile />;
        }
    };

    return (
        <section id="student-information-section">
            <div className="sis-container">
                <div className="siscc1">
                    <StudentInformtionSidebar activeTab={tab} />
                </div>
                <div className="siscc2">{renderContent()}</div>
            </div>
        </section>
    );
};

export default StudentInformationPage;
