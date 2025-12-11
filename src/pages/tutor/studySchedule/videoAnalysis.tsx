import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/store";
import { getVideoAnalysisApiThunk } from "../../../services/videoAnalysis/videoAnalysisThunk";
import { clearAnalysis, clearAnswers } from "../../../services/videoAnalysis/videoAnalysisSlice";
import { getLessonMaterialsApiThunk } from "../../../services/lessonMaterials/lessonMaterialsThunk";
import { useAppSelector } from "../../../app/store";
import VideoPlayerWithAnalysis from "../../../components/videoAnalysis/VideoPlayerWithAnalysis";
import { LoadingSpinner } from "../../../components/elements";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const TutorVideoAnalysisPage: FC = () => {
    const { id: lessonId, videoId: mediaId } = useParams<{ id: string; videoId: string }>();
    const dispatch = useAppDispatch();
    const materials = useAppSelector((state: any) => state.lessonMaterials?.materials || []);
    const [videoData, setVideoData] = useState<{ url: string; fileName: string } | null>(null);

    useEffect(() => {
        if (lessonId) {
            dispatch(getLessonMaterialsApiThunk(lessonId));
        }
    }, [lessonId, dispatch]);

    useEffect(() => {
        if (mediaId && materials.length > 0) {
            const video = materials.find((m: any) => m.id === mediaId);
            if (video) {
                setVideoData({ url: video.url, fileName: video.fileName });
            }
        }
    }, [mediaId, materials]);

    useEffect(() => {
        if (lessonId && mediaId) {
            dispatch(getVideoAnalysisApiThunk({ lessonId, mediaId }));
        }
        return () => {
            dispatch(clearAnalysis());
            dispatch(clearAnswers());
        };
    }, [lessonId, mediaId, dispatch]);

    if (!lessonId || !mediaId) {
        return <div>Invalid lesson or video ID</div>;
    }

    if (!videoData) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <LoadingSpinner />
                <p>Đang tải thông tin video...</p>
            </div>
        );
    }

    return (
        <section id="tutor-video-analysis-section">
            <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                        onClick={() => {
                            const url = routes.tutor.lesson_detail.replace(":id", lessonId);
                            navigateHook(url);
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
                    mediaId={mediaId}
                    videoUrl={videoData.url}
                    fileName={videoData.fileName}
                    isTutor={true}
                />
            </div>
        </section>
    );
};

export default TutorVideoAnalysisPage;

