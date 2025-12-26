import request from "../../request";
import type { ResponseFromServer } from "../../../types/app";

export interface ReportItem {
    id: string;
    reporterId?: string;
    reporterEmail?: string;
    reporterUsername?: string;
    targetUserId?: string;
    targetLessonId?: string;
    targetMediaId?: string;
    description?: string;
    status: string; // "Pending" | "Resolved" | "Rejected" | "Escalated"
    createdAt: string;
}

export interface ReportDetail extends ReportItem {
    targetUserEmail?: string;
    lessonTitle?: string;
    mediaFileName?: string;
}

export interface ReportQuery {
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
}

export interface UpdateReportStatusParams {
    status: string;
    note?: string;
}

export interface ReportsResponse {
    total: number;
    items: ReportItem[];
}

export const getReportsForTutorApi = async (query?: ReportQuery): Promise<ReportsResponse> => {
    const params = new URLSearchParams();
    if (query?.status) params.append("status", query.status);
    if (query?.keyword) params.append("keyword", query.keyword);
    if (query?.page) params.append("page", query.page.toString());
    if (query?.pageSize) params.append("pageSize", query.pageSize.toString());

    const response = await request.get(`reports/tutor?${params.toString()}`);
    const apiResponse = response.data;
    const data = apiResponse?.data || apiResponse?.Data || apiResponse;
    
    if (data) {
        return {
            total: data.total || data.Total || 0,
            items: data.items || data.Items || []
        };
    }
    
    return { total: 0, items: [] };
};

export const getReportDetailForTutorApi = async (reportId: string): Promise<ReportDetail> => {
    const response = await request.get(`reports/tutor/${reportId}`);
    const apiResponse = response.data;
    return apiResponse?.data || apiResponse?.Data || apiResponse;
};

export const updateReportStatusForTutorApi = async (
    reportId: string,
    params: UpdateReportStatusParams
): Promise<ResponseFromServer<{}>> => {
    const data = await request.patch(`reports/tutor/${reportId}/status`, params);
    return data.data;
};

export const cancelReportForTutorApi = async (
    reportId: string
): Promise<ResponseFromServer<{}>> => {
    const data = await request.delete(`reports/tutor/${reportId}`);
    return data.data;
};

