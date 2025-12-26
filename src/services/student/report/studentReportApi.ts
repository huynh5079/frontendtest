import request from "../../request";
import type { ResponseFromServer } from "../../../types/app";

export interface ReportMaterialParams {
    lessonId: string;
    mediaId: string;
    reason: string;
}

export const reportMaterialToTutorApi = async (
    params: ReportMaterialParams
): Promise<ResponseFromServer<{ id: string }>> => {
    const data = await request.post(
        `reports/lessons/${params.lessonId}/materials/${params.mediaId}/report`,
        { reason: params.reason }
    );
    return data.data;
};

export const reportMaterialToAdminApi = async (
    params: ReportMaterialParams
): Promise<ResponseFromServer<{ id: string }>> => {
    const data = await request.post(
        `reports/lessons/${params.lessonId}/materials/${params.mediaId}/report-to-admin`,
        { reason: params.reason }
    );
    return data.data;
};

export interface ReportUserParams {
    targetUserId: string;
    reason: string;
}

export const reportUserApi = async (
    params: ReportUserParams
): Promise<ResponseFromServer<{ id: string }>> => {
    const data = await request.post(
        `reports/users/${params.targetUserId}/report`,
        { reason: params.reason }
    );
    return data.data;
};

export interface ReportLessonParams {
    lessonId: string;
    reason: string;
}

export const reportLessonApi = async (
    params: ReportLessonParams
): Promise<ResponseFromServer<{ id: string }>> => {
    const data = await request.post(
        `reports/lessons/${params.lessonId}/report`,
        { reason: params.reason }
    );
    return data.data;
};

