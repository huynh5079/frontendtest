import request from "../request";
import type {
    VideoAnalysisDto,
    VideoQuestionRequestDto,
    VideoQuestionResponseDto,
    ApiResponse,
} from "../../types/video-analysis";

// Lấy kết quả phân tích video
export const getVideoAnalysisApi = async (
    lessonId: string,
    mediaId: string
): Promise<ApiResponse<VideoAnalysisDto>> => {
    const res = await request.get(
        `/lessons/${lessonId}/materials/${mediaId}/analysis`
    );
    return res.data;
};

// Trigger phân tích video (Tutor only)
export const analyzeVideoApi = async (
    lessonId: string,
    mediaId: string
): Promise<ApiResponse<VideoAnalysisDto>> => {
    const res = await request.post(
        `/lessons/${lessonId}/materials/${mediaId}/analysis`
    );
    return res.data;
};

// Hỏi câu hỏi về video
export const askVideoQuestionApi = async (
    lessonId: string,
    mediaId: string,
    dto: VideoQuestionRequestDto
): Promise<ApiResponse<VideoQuestionResponseDto>> => {
    const res = await request.post(
        `/lessons/${lessonId}/materials/${mediaId}/analysis/ask`,
        dto
    );
    return res.data;
};

