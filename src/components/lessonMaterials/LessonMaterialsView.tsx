import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
    getLessonMaterialsApiThunk,
    uploadLessonMaterialsApiThunk,
    deleteLessonMaterialApiThunk,
} from "../../services/lessonMaterials/lessonMaterialsThunk";
import { clearMaterials } from "../../services/lessonMaterials/lessonMaterialsSlice";
import type { MaterialItemDto } from "../../types/lesson-materials";
import LoadingSpinner from "../elements/LoadingSpinner";
import { routes } from "../../routes/routeName";
import { selectUserLogin } from "../../app/selector";
import { USER_TUTOR, USER_STUDENT, USER_PARENT } from "../../utils/helper";
import { StudentReportMaterialModal } from "../modal";
import { MdReport } from "react-icons/md";

interface LessonMaterialsViewProps {
    lessonId: string;
    isTutor?: boolean; // Nếu true, cho phép upload và xóa
}

const LessonMaterialsView: React.FC<LessonMaterialsViewProps> = ({
    lessonId,
    isTutor = false,
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserLogin);
    const lessonMaterialsState = useAppSelector(
        (state: any) => state.lessonMaterials,
    );
    const materials = lessonMaterialsState?.materials || [];
    const isLoading = lessonMaterialsState?.isLoading || false;
    const error = lessonMaterialsState?.error || null;

    // Hàm để lấy route video analysis dựa trên role
    const getVideoAnalysisRoute = (lessonId: string, mediaId: string) => {
        if (user?.role === USER_TUTOR) {
            return (
                routes.tutor.lesson_detail.replace(":id", lessonId) +
                `/video/${mediaId}`
            );
        } else if (user?.role === USER_STUDENT) {
            // Route cho student - dùng information page với query params
            return `/student/information?tab=schedule/lesson_detail/${lessonId}/video/${mediaId}`;
        } else if (user?.role === USER_PARENT) {
            // Route cho parent - dùng information page với query params
            return `/parent/information?tab=schedule/lesson_detail/${lessonId}/video/${mediaId}`;
        }
        // Fallback
        return (
            routes.tutor.lesson_detail.replace(":id", lessonId) +
            `/video/${mediaId}`
        );
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<{
        id: string;
        name: string;
    } | null>(null);

    useEffect(() => {
        if (lessonId) {
            console.log("🔄 Loading materials for lesson:", lessonId);
            dispatch(getLessonMaterialsApiThunk(lessonId));
        }
        return () => {
            dispatch(clearMaterials());
        };
    }, [lessonId, dispatch]);

    // Debug: Log materials khi state thay đổi
    useEffect(() => {
        console.log("📚 Full lessonMaterialsState:", lessonMaterialsState);
        console.log("📚 Materials state updated:", materials);
        console.log("📚 Materials count:", materials?.length || 0);
        if (materials && materials.length > 0) {
            console.log("📚 First material:", materials[0]);
        }
    }, [materials, lessonMaterialsState]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Validate file size (max 200MB)
        const maxSize = 200 * 1024 * 1024; // 200MB
        const invalidFiles = Array.from(files).filter(
            (file) => file.size > maxSize,
        );
        if (invalidFiles.length > 0) {
            alert(
                `Một số file vượt quá 200MB: ${invalidFiles
                    .map((f) => f.name)
                    .join(", ")}`,
            );
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setUploading(true);
        try {
            const result = await dispatch(
                uploadLessonMaterialsApiThunk({
                    lessonId,
                    files: Array.from(files),
                }),
            ).unwrap();


            // Nếu upload trả về data, không cần refresh lại ngay
            // Chỉ refresh nếu response rỗng
            if (!result || (Array.isArray(result) && result.length === 0)) {
                console.log("⚠️ Response rỗng, đang refresh lại sau 1.5s...");
                // Đợi server xử lý xong
                setTimeout(async () => {
                    await dispatch(getLessonMaterialsApiThunk(lessonId));
                }, 1500);
            } else {
                console.log(
                    "✅ Upload có data, không cần refresh. Materials sẽ được update từ Redux slice.",
                );
                // Không refresh ngay, để Redux slice tự update từ upload response
            }

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err: any) {
            console.error("❌ Upload error:", err);
            alert(err || "Lỗi khi upload tài liệu");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (mediaId: string) => {
        if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

        try {
            await dispatch(
                deleteLessonMaterialApiThunk({ lessonId, mediaId }),
            ).unwrap();
        } catch (err: any) {
            console.error("Delete error:", err);
            alert(err || "Lỗi khi xóa tài liệu");
        }
    };

    const isVideo = (mediaType: string) => {
        return mediaType?.startsWith("video/");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const [activeTab, setActiveTab] = useState<"materials" | "quiz">(
        "materials",
    );

    return (
        <div className="lesson-materials-view">

            {isTutor && (
                <div
                    className="upload-section"
                    style={{ marginBottom: "20px" }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading || isLoading}
                        style={{ display: "none" }}
                        accept="video/*,image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        aria-label="Upload lesson materials"
                    />
                    <button
                        className="pr-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || isLoading}
                        style={{
                            padding: "0.75rem 1.5rem",
                        }}
                    >
                        {uploading ? "Đang upload..." : "Upload tài liệu"}
                    </button>
                </div>
            )}

            {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {error}
                </div>
            )}

            {!isLoading && materials.length === 0 && !uploading && (
                <p>Chưa có tài liệu nào.</p>
            )}

            {uploading && (
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <LoadingSpinner />
                    <p>Đang upload video...</p>
                </div>
            )}

            <div
                className="materials-list"
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                }}
            >
                {materials.map((material: MaterialItemDto) => {
                    console.log(
                        "📦 Rendering material:",
                        material.id,
                        material.fileName,
                        material.mediaType,
                    );
                    return (
                        <div
                            key={material.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "white",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-4px)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {isVideo(material.mediaType) ? (
                                <div>
                                    {/* Video Thumbnail */}
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            paddingTop: "56.25%", // 16:9 aspect ratio
                                            backgroundColor: "#000",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            const url = getVideoAnalysisRoute(
                                                lessonId,
                                                material.id,
                                            );
                                            navigate(url);
                                        }}
                                    >
                                        <video
                                            src={material.url}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.play();
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                            muted
                                            preload="metadata"
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform:
                                                    "translate(-50%, -50%)",
                                                width: "60px",
                                                height: "60px",
                                                borderRadius: "50%",
                                                backgroundColor:
                                                    "rgba(0,0,0,0.7)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "white",
                                                    fontSize: "24px",
                                                    marginLeft: "2px",
                                                }}
                                            >
                                                ▶
                                            </span>
                                        </div>
                                    </div>

                                    {/* Video Info */}
                                    <div style={{ padding: "12px" }}>
                                        <h4
                                            style={{
                                                margin: "0 0 8px 0",
                                                fontSize: "16px",
                                                fontWeight: "500",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                lineHeight: "1.4",
                                                minHeight: "44px",
                                            }}
                                        >
                                            {material.fileName}
                                        </h4>
                                        <p
                                            style={{
                                                color: "#666",
                                                fontSize: "13px",
                                                margin: "0 0 12px 0",
                                            }}
                                        >
                                            {formatFileSize(material.fileSize)}{" "}
                                            •{" "}
                                            {new Date(
                                                material.createdAt,
                                            ).toLocaleDateString("vi-VN")}
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {!isTutor && (
                                                <>
                                                    <button
                                                        className="pr-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url =
                                                                getVideoAnalysisRoute(
                                                                    lessonId,
                                                                    material.id,
                                                                );
                                                            navigate(url);
                                                        }}
                                                        style={{
                                                            padding: "0.5rem 1rem",
                                                            fontSize: "0.875rem",
                                                            flex: 1,
                                                        }}
                                                    >
                                                        Phân tích
                                                    </button>
                                                    <button
                                                        className="sc-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMaterial({
                                                                id: material.id,
                                                                name: material.fileName,
                                                            });
                                                            setReportModalOpen(true);
                                                        }}
                                                        style={{
                                                            padding: "0.5rem 1rem",
                                                            fontSize: "0.875rem",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.5rem",
                                                        }}
                                                    >
                                                        <MdReport />
                                                        Báo cáo
                                                    </button>
                                                </>
                                            )}

                                            {isTutor && (
                                                <button
                                                    className="delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(
                                                            material.id,
                                                        );
                                                    }}
                                                    style={{
                                                        padding: "0.5rem 1rem",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <h4>{material.fileName}</h4>
                                            <p
                                                style={{
                                                    color: "#666",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {formatFileSize(
                                                    material.fileSize,
                                                )}{" "}
                                                •{" "}
                                                {new Date(
                                                    material.createdAt,
                                                ).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px",
                                            }}
                                        >
                                            <a
                                                href={material.url}
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
                                            {!isTutor && (
                                                <button
                                                    className="sc-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMaterial({
                                                            id: material.id,
                                                            name: material.fileName,
                                                        });
                                                        setReportModalOpen(true);
                                                    }}
                                                    style={{
                                                        padding: "0.5rem 1rem",
                                                        fontSize: "0.875rem",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem",
                                                    }}
                                                >
                                                    <MdReport />
                                                    Báo cáo
                                                </button>
                                            )}
                                            {isTutor && (
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            material.id,
                                                        )
                                                    }
                                                    style={{
                                                        padding: "0.5rem 1rem",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {material.mediaType?.startsWith(
                                        "image/",
                                    ) && (
                                            <img
                                                src={material.url}
                                                alt={material.fileName}
                                                style={{
                                                    maxWidth: "100%",
                                                    marginTop: "10px",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                        )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Report Material Modal */}
            {selectedMaterial && (
                <StudentReportMaterialModal
                    isOpen={reportModalOpen}
                    setIsOpen={setReportModalOpen}
                    lessonId={lessonId}
                    mediaId={selectedMaterial.id}
                    materialName={selectedMaterial.name}
                />
            )}
        </div>
    );
};

export default LessonMaterialsView;
