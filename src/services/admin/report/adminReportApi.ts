import request from "../../request";

export interface ReportItem {
    id: string;
    reporterId?: string;
    reporterEmail?: string;  // Email của người gửi
    reporterUsername?: string;  // Username của người gửi
    targetUserId?: string;
    targetLessonId?: string;
    targetMediaId?: string;
    description?: string;
    status: string; // "Pending" | "Resolved" | "Rejected" | "Escalated"
    createdAt: string;
}

export interface ReportDetail extends ReportItem {
    // ReportDetail extends ReportItem, nên đã có reporterEmail và reporterUsername từ ReportItem
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

export const getReportsForAdminApi = async (query?: ReportQuery) => {
    const params = new URLSearchParams();
    if (query?.status) params.append("status", query.status);
    if (query?.keyword) params.append("keyword", query.keyword);
    if (query?.page) params.append("page", query.page.toString());
    if (query?.pageSize) params.append("pageSize", query.pageSize.toString());

    const response = await request.get(`reports/admin?${params.toString()}`);
    const apiResponse = response.data;
    // Handle both camelCase and PascalCase
    const data = apiResponse?.data || apiResponse?.Data || apiResponse;

    // Ensure items and total are properly mapped
    if (data) {
        return {
            total: data.total || data.Total || 0,
            items: data.items || data.Items || []
        };
    }

    return { total: 0, items: [] };
};

export const getReportDetailForAdminApi = async (reportId: string) => {
    const response = await request.get(`reports/admin/${reportId}`);
    const apiResponse = response.data;
    return apiResponse?.data || apiResponse?.Data || apiResponse;
};

export const updateReportStatusApi = async (reportId: string, params: UpdateReportStatusParams) => {
    const data = await request.patch(`reports/admin/${reportId}/status`, params);
    return data.data;
};

export interface AutoReportItem {
    id: string;
    reporterId: string;
    reporterName: string;
    classId: string;
    className: string;
    absentCount: number;
    totalLessons: number;
    absenceRate: number;
    status: string;
    studentResponse?: string;
    studentRespondedAt?: string;
    createdAt: string;
}

export interface AutoReportQuery {
    page?: number;
    pageSize?: number;
    classId?: string;
    studentId?: string;
    fromDate?: string; // ISO date string
    toDate?: string; // ISO date string
    responseStatus?: string; // "responded", "pending", "all"
    sortBy?: string; // Default: "CreatedAt"
    sortOrder?: string; // "asc" or "desc", Default: "desc"
}

export interface AutoReportPagedResponse {
    total: number;
    items: AutoReportItem[];
    page: number;
    pageSize: number;
}

export const getAutoReportsApi = async (query?: AutoReportQuery): Promise<AutoReportPagedResponse> => {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.pageSize) params.append("pageSize", query.pageSize.toString());
    if (query?.studentId) params.append("studentId", query.studentId);
    if (query?.classId) params.append("classId", query.classId);
    if (query?.fromDate) params.append("fromDate", query.fromDate);
    if (query?.toDate) params.append("toDate", query.toDate);
    if (query?.responseStatus) params.append("responseStatus", query.responseStatus);
    if (query?.sortBy) params.append("sortBy", query.sortBy);
    if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

    const response = await request.get(`reports/auto-reports?${params.toString()}`);
    const apiResponse = response.data;
    const data = apiResponse?.data || apiResponse?.Data || apiResponse;

    // Handle both camelCase and PascalCase
    if (data) {
        return {
            total: data.total || data.TotalCount || 0,
            items: data.items || data.Items || [],
            page: data.page || data.Page || 1,
            pageSize: data.pageSize || data.PageSize || 10,
        };
    }

    return { total: 0, items: [], page: 1, pageSize: 10 };
};

