import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getVideoAnalysisApi,
    analyzeVideoApi,
    askVideoQuestionApi,
} from "./videoAnalysisApi";
import type {
    VideoAnalysisDto,
    VideoQuestionRequestDto,
    VideoQuestionResponseDto,
} from "../../types/video-analysis";

// Get Analysis
export const getVideoAnalysisApiThunk = createAsyncThunk<
    VideoAnalysisDto | null,
    { lessonId: string; mediaId: string },
    { rejectValue: string }
>(
    "videoAnalysis/get",
    async ({ lessonId, mediaId }, { rejectWithValue }) => {
        try {
            const response = await getVideoAnalysisApi(lessonId, mediaId);
            if (response.status?.toLowerCase() === "success") {
                return response.data;
            }
            // Nếu không có analysis, trả về null thay vì reject
            if (response.status?.toLowerCase() === "fail" && response.message?.includes("Chưa có kết quả")) {
                return null;
            }
            return rejectWithValue(response.message || "Lỗi không xác định");
        } catch (error: any) {
            // Nếu 404, có thể là chưa có analysis - không phải lỗi
            if (error.response?.status === 404) {
                return null;
            }
            const errorMessage = error.response?.data?.message || error?.message || "Lỗi khi lấy kết quả phân tích";
            return rejectWithValue(errorMessage);
        }
    }
);

// Analyze Video
export const analyzeVideoApiThunk = createAsyncThunk<
    VideoAnalysisDto,
    { lessonId: string; mediaId: string },
    { rejectValue: string }
>(
    "videoAnalysis/analyze",
    async ({ lessonId, mediaId }, { rejectWithValue }) => {
        try {
            const response = await analyzeVideoApi(lessonId, mediaId);
            if (response.status?.toLowerCase() === "success") {
                return response.data;
            }
            return rejectWithValue(response.message || "Lỗi không xác định");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error?.message || "Lỗi khi phân tích video";
            return rejectWithValue(errorMessage);
        }
    }
);

// Ask Question
export const askVideoQuestionApiThunk = createAsyncThunk<
    VideoQuestionResponseDto,
    { lessonId: string; mediaId: string; dto: VideoQuestionRequestDto },
    { rejectValue: string }
>(
    "videoAnalysis/ask",
    async ({ lessonId, mediaId, dto }, { rejectWithValue }) => {
        try {
            const response = await askVideoQuestionApi(lessonId, mediaId, dto);
            if (response.status?.toLowerCase() === "success") {
                return response.data;
            }
            return rejectWithValue(response.message || "Lỗi không xác định");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error?.message || "Lỗi khi trả lời câu hỏi"
            );
        }
    }
);

