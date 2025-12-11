export interface VideoAnalysisDto {
    id: string;
    mediaId: string;
    lessonId: string;
    transcription?: string;
    transcriptionLanguage?: string;
    summary?: string;
    summaryType?: string;
    keyPoints?: string[];
    status: string; // "Pending" | "Processing" | "Completed" | "Failed"
    errorMessage?: string;
    videoDurationSeconds?: number;
    analyzedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VideoQuestionRequestDto {
    question: string;
    language?: string;
}

export interface VideoQuestionResponseDto {
    question: string;
    answer: string;
    language: string;
}

export interface ApiResponse<T> {
    status: "success" | "fail";
    message?: string;
    data: T;
}

