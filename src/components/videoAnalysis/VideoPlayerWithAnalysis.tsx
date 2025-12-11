import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
    getVideoAnalysisApiThunk,
    analyzeVideoApiThunk,
    askVideoQuestionApiThunk,
} from "../../services/videoAnalysis/videoAnalysisThunk";
import { clearAnalysis, clearAnswers } from "../../services/videoAnalysis/videoAnalysisSlice";
import {
    selectVideoAnalysis,
    selectVideoAnalysisLoading,
    selectVideoAnalysisError,
    selectVideoQuestionAnswers,
    selectVideoAnalysisAsking,
} from "../../app/selector";
import type { VideoQuestionRequestDto } from "../../types/video-analysis";
import LoadingSpinner from "../elements/LoadingSpinner";

interface VideoPlayerWithAnalysisProps {
    lessonId: string;
    mediaId: string;
    videoUrl: string;
    fileName: string;
    isTutor?: boolean;
}

const VideoPlayerWithAnalysis: React.FC<VideoPlayerWithAnalysisProps> = ({
    lessonId,
    mediaId,
    videoUrl,
    fileName,
    isTutor = false,
}) => {
    const dispatch = useAppDispatch();
    const analysis = useAppSelector(selectVideoAnalysis);
    const isLoading = useAppSelector(selectVideoAnalysisLoading);
    const error = useAppSelector(selectVideoAnalysisError);
    const questionAnswers = useAppSelector(selectVideoQuestionAnswers);
    const isAsking = useAppSelector(selectVideoAnalysisAsking);

    const [question, setQuestion] = useState("");
    const [tabActive, setTabActive] = useState<"video" | "transcription" | "summary" | "qna">("video");

    useEffect(() => {
        // Load analysis khi component mount
        dispatch(getVideoAnalysisApiThunk({ lessonId, mediaId }));
        return () => {
            dispatch(clearAnalysis());
            dispatch(clearAnswers());
        };
    }, [lessonId, mediaId, dispatch]);

    // Tự động refresh khi analysis đang processing
    useEffect(() => {
        if (analysis?.status?.toLowerCase() === "processing") {
            let refreshCount = 0;
            const maxRefreshes = 300; // Tối đa 10 phút
            let timeoutIds: NodeJS.Timeout[] = [];
            let isCancelled = false;

            // Refresh ngay lập tức lần đầu
            dispatch(getVideoAnalysisApiThunk({ lessonId, mediaId }));

            // Dùng exponential backoff: 1s, 2s, 3s, 5s, 5s, 5s...
            const getNextDelay = (count: number) => {
                if (count <= 1) return 1000; // 1 giây đầu
                if (count <= 2) return 2000; // 2 giây tiếp
                if (count <= 3) return 3000; // 3 giây tiếp
                return 5000; // Sau đó mỗi 5 giây
            };

            const scheduleNext = () => {
                if (isCancelled || refreshCount >= maxRefreshes) return;

                const delay = getNextDelay(refreshCount);
                const timeoutId = setTimeout(() => {
                    if (isCancelled) return;
                    refreshCount++;
                    dispatch(getVideoAnalysisApiThunk({ lessonId, mediaId }));
                    scheduleNext();
                }, delay);

                timeoutIds.push(timeoutId);
            };

            scheduleNext();

            // Cleanup function
            return () => {
                isCancelled = true;
                timeoutIds.forEach(id => clearTimeout(id));
                timeoutIds = [];
            };
        }
    }, [analysis?.status, lessonId, mediaId, dispatch]);

    // Tự động chuyển sang tab transcription khi có kết quả phân tích
    useEffect(() => {
        if (analysis && (analysis.transcription || analysis.summary)) {
            setTabActive("transcription");
        }
    }, [analysis]);

    const handleAnalyze = async () => {
        try {
            await dispatch(analyzeVideoApiThunk({ lessonId, mediaId })).unwrap();
            // Sau khi trigger phân tích, GET ngay lập tức để lấy status Processing và bắt đầu auto-refresh
            dispatch(getVideoAnalysisApiThunk({ lessonId, mediaId }));
        } catch (err: any) {
            console.error("Analyze error:", err);
            alert(err || "Lỗi khi phân tích video");
        }
    };

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        const dto: VideoQuestionRequestDto = {
            question: question.trim(),
            language: "vi",
        };

        try {
            await dispatch(
                askVideoQuestionApiThunk({ lessonId, mediaId, dto })
            ).unwrap();
            setQuestion("");
        } catch (err: any) {
            console.error("Ask question error:", err);
            alert(err || "Lỗi khi trả lời câu hỏi");
        }
    };

    const analysisStatus = analysis?.status?.toLowerCase();

    return (
        <div className="video-player-with-analysis">
            <div style={{ marginBottom: "15px" }}>
                <div style={{ position: "relative", width: "100%" }}>
                    {videoUrl && videoUrl.trim() !== "" ? (
                        <video
                            controls
                            src={videoUrl}
                            preload="metadata"
                            style={{
                                width: "100%",
                                maxHeight: "500px",
                                borderRadius: "8px",
                                backgroundColor: "#000",
                            }}
                            onLoadedMetadata={(e) => {
                                // Tạo thumbnail từ video frame đầu tiên
                                const video = e.currentTarget;
                                const canvas = document.createElement('canvas');
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                    // Thumbnail sẽ được hiển thị tự động bởi browser
                                }
                            }}
                        >
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    ) : (
                        <div style={{
                            width: "100%",
                            height: "300px",
                            borderRadius: "8px",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#666"
                        }}>
                            <p>Đang tải video...</p>
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <p style={{ color: "#666", margin: 0 }}>{fileName || "Đang tải..."}</p>
                    {videoUrl && videoUrl.trim() !== "" && (
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pr-btn"
                            style={{
                                padding: "0.5rem 1rem",
                                fontSize: "0.875rem",
                                textDecoration: "none",
                            }}
                        >
                            Tải xuống
                        </a>
                    )}
                </div>
            </div>

            {/* Nút phân tích (cho Tutor, Student, Parent) */}
            {analysisStatus !== "completed" && !isLoading && (
                <div style={{ marginBottom: "20px" }}>
                    <button
                        className="pr-btn"
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        style={{
                            padding: "0.75rem 1.5rem",
                        }}
                    >
                        {isLoading ? "Đang phân tích..." : "Phân tích video bằng AI"}
                    </button>
                </div>
            )}

            {error && (
                <div style={{ color: "red", marginBottom: "10px", padding: "10px", backgroundColor: "#ffe6e6", borderRadius: "5px" }}>
                    {error}
                </div>
            )}

            {analysisStatus === "pending" || analysisStatus === "processing" ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <LoadingSpinner />
                    <p style={{ marginTop: "10px", fontSize: "16px" }}>Đang phân tích video, vui lòng đợi...</p>
                    <p style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
                        Quá trình này có thể mất vài phút. Trang sẽ tự động cập nhật khi hoàn thành.
                    </p>
                    {analysis?.updatedAt && (
                        <p style={{ marginTop: "10px", fontSize: "12px", color: "#999" }}>
                            Cập nhật lần cuối: {new Date(analysis.updatedAt).toLocaleString("vi-VN")}
                        </p>
                    )}
                    <button
                        className="sc-btn"
                        onClick={handleAnalyze}
                        style={{
                            marginTop: "15px",
                            padding: "0.75rem 1.5rem",
                        }}
                    >
                        Phân tích lại (nếu đã quá lâu)
                    </button>
                </div>
            ) : analysisStatus === "failed" ? (
                <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
                    <p style={{ marginBottom: "15px" }}>Lỗi phân tích video: {analysis?.errorMessage || "Không xác định"}</p>
                    <button
                        className="pr-btn"
                        onClick={handleAnalyze}
                        style={{
                            marginTop: "10px",
                            padding: "0.75rem 1.5rem",
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            ) : (analysisStatus === "completed" || (analysis && (analysis.transcription || analysis.summary))) && analysis ? (
                <div className="analysis-results">
                    <div className="tabs" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                        {["video", "transcription", "summary", "qna"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setTabActive(tab as any)}
                                className={tabActive === tab ? "pr-btn" : "sc-btn"}
                                style={{
                                    padding: "0.5rem 1rem",
                                    fontSize: "0.875rem",
                                }}
                            >
                                {tab === "video" && "Video"}
                                {tab === "transcription" && "Transcription"}
                                {tab === "summary" && "Summary"}
                                {tab === "qna" && "Q&A"}
                            </button>
                        ))}
                    </div>

                    {tabActive === "video" && (
                        <div className="tab-content">
                            {videoUrl && videoUrl.trim() !== "" ? (
                                <video
                                    controls
                                    src={videoUrl}
                                    style={{
                                        width: "100%",
                                        maxHeight: "500px",
                                        borderRadius: "8px",
                                    }}
                                    preload="metadata"
                                >
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "300px",
                                    borderRadius: "8px",
                                    backgroundColor: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#666"
                                }}>
                                    <p>Đang tải video...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {tabActive === "transcription" && (
                        <div className="tab-content">
                            <h4>Transcription</h4>
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "15px",
                                    borderRadius: "5px",
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    border: "1px solid #ddd",
                                }}
                            >
                                <p style={{ whiteSpace: "pre-wrap" }}>
                                    {analysis.transcription || "Không có transcription."}
                                </p>
                            </div>
                        </div>
                    )}

                    {tabActive === "summary" && (
                        <div className="tab-content">
                            <h4>Summary</h4>
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "15px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            >
                                <p>{analysis.summary || "Không có summary."}</p>
                            </div>
                            {analysis.keyPoints && analysis.keyPoints.length > 0 && (
                                <div style={{ marginTop: "20px" }}>
                                    <h4>Key Points:</h4>
                                    <ul
                                        style={{
                                            backgroundColor: "white",
                                            padding: "15px 15px 15px 35px",
                                            borderRadius: "5px",
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        {analysis.keyPoints.map((point: string, index: number) => (
                                            <li key={index} style={{ marginBottom: "8px" }}>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {tabActive === "qna" && (
                        <div className="tab-content">
                            <h4>Q&A</h4>
                            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && !isAsking) {
                                            handleAskQuestion();
                                        }
                                    }}
                                    placeholder="Ask a question about the video..."
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                    }}
                                />
                                <button
                                    className="pr-btn"
                                    onClick={handleAskQuestion}
                                    disabled={isAsking || !question.trim()}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                    }}
                                >
                                    {isAsking ? "Đang hỏi..." : "Hỏi"}
                                </button>
                            </div>
                            <div className="question-answers">
                                {questionAnswers.length === 0 && !isAsking && (
                                    <p>Chưa có câu hỏi nào được trả lời.</p>
                                )}
                                {questionAnswers.map((qa: any, index: number) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginBottom: "10px",
                                            padding: "15px",
                                            border: "1px solid #eee",
                                            borderRadius: "5px",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                                            Q: {qa.question}
                                        </p>
                                        <div
                                            style={{
                                                color: "#333",
                                                whiteSpace: "pre-wrap",
                                                lineHeight: "1.6",
                                                wordBreak: "break-word"
                                            }}
                                        >
                                            A: {qa.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : !analysis ? (
                <p>Chưa có kết quả phân tích nào.</p>
            ) : null}
        </div>
    );
};

export default VideoPlayerWithAnalysis;

