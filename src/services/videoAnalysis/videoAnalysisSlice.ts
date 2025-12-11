import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    getVideoAnalysisApiThunk,
    analyzeVideoApiThunk,
    askVideoQuestionApiThunk,
} from "./videoAnalysisThunk";
import type {
    VideoAnalysisDto,
    VideoQuestionResponseDto,
} from "../../types/video-analysis";

interface VideoAnalysisState {
    currentAnalysis: VideoAnalysisDto | null;
    isLoading: boolean;
    error: string | null;
    questionAnswers: VideoQuestionResponseDto[];
    isAsking: boolean;
}

const initialState: VideoAnalysisState = {
    currentAnalysis: null,
    isLoading: false,
    error: null,
    questionAnswers: [],
    isAsking: false,
};

export const videoAnalysisSlice = createSlice({
    name: "videoAnalysis",
    initialState,
    reducers: {
        clearAnalysis: (state) => {
            state.currentAnalysis = null;
            state.questionAnswers = [];
            state.error = null;
        },
        clearAnswers: (state) => {
            state.questionAnswers = [];
        },
    },
    extraReducers: (builder) => {
        // Get Analysis
        builder
            .addCase(getVideoAnalysisApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getVideoAnalysisApiThunk.fulfilled,
                (state, action: PayloadAction<VideoAnalysisDto | null>) => {
                    state.isLoading = false;
                    state.error = null;
                    state.currentAnalysis = action.payload;
                }
            )
            .addCase(getVideoAnalysisApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                // Nếu là 404 (chưa có analysis), không set error
                if (action.payload?.includes("404") || action.payload?.includes("Chưa có")) {
                    state.currentAnalysis = null;
                    state.error = null;
                } else {
                    state.error = action.error.message || "Lỗi khi lấy kết quả phân tích";
                }
            });

        // Analyze Video
        builder
            .addCase(analyzeVideoApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                analyzeVideoApiThunk.fulfilled,
                (state, action: PayloadAction<VideoAnalysisDto>) => {
                    state.isLoading = false;
                    state.error = null;
                    state.currentAnalysis = action.payload;
                }
            )
            .addCase(analyzeVideoApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Lỗi khi phân tích video";
            });

        // Ask Question
        builder
            .addCase(askVideoQuestionApiThunk.pending, (state) => {
                state.isAsking = true;
                state.error = null;
            })
            .addCase(
                askVideoQuestionApiThunk.fulfilled,
                (state, action: PayloadAction<VideoQuestionResponseDto>) => {
                    state.isAsking = false;
                    state.error = null;
                    state.questionAnswers.push(action.payload);
                }
            )
            .addCase(askVideoQuestionApiThunk.rejected, (state, action) => {
                state.isAsking = false;
                state.error = action.error.message || "Lỗi khi trả lời câu hỏi";
            });
    },
});

export const { clearAnalysis, clearAnswers } = videoAnalysisSlice.actions;
export default videoAnalysisSlice.reducer;

