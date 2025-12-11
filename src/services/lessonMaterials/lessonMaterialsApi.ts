import request from "../request";
import type { MaterialItemDto, ApiResponse } from "../../types/lesson-materials";

// Lấy danh sách materials của lesson
export const getLessonMaterialsApi = async (
    lessonId: string
): Promise<ApiResponse<MaterialItemDto[]>> => {
    const res = await request.get(`/lessons/${lessonId}/materials`);
    return res.data;
};

// Upload materials (Tutor only)
export const uploadLessonMaterialsApi = async (
    lessonId: string,
    files: File[]
): Promise<ApiResponse<MaterialItemDto[]>> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("Files", file);
    });

    const config = {
        timeout: 300000, // 5 minutes timeout cho video lớn
        onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`📊 Upload progress: ${percentCompleted}%`);
            }
        },
    };

    const res = await request.post(
        `/lessons/${lessonId}/materials/upload`,
        formData,
        config
    );
    return res.data;
};

// Xóa material (Tutor only)
export const deleteLessonMaterialApi = async (
    lessonId: string,
    mediaId: string
): Promise<ApiResponse<boolean>> => {
    const res = await request.delete(
        `/lessons/${lessonId}/materials/${mediaId}`
    );
    return res.data;
};

