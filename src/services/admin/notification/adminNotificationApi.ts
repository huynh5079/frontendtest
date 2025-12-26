import request from "../../request";

export interface SendNotificationRequest {
    title: string;
    message: string;
    userId?: string;
    userEmail?: string;  // Email thay vì userId
    userIds?: string[];
    userEmails?: string[];  // Danh sách emails thay vì userIds
    role?: "Student" | "Tutor" | "Parent" | "Admin";
    relatedEntityId?: string;
}

export interface SendNotificationResponse {
    sentCount: number;
    totalRecipients: number;
}

export interface NotificationHistoryItem {
    id: string;
    title: string;
    content: string;
    recipientType: string;
    sentDate: string;
    recipientCount: number;
}

export interface NotificationHistoryResponse {
    items: NotificationHistoryItem[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export const adminGetNotificationsHistoryApi = async (page: number = 1, pageSize: number = 10): Promise<NotificationHistoryResponse> => {
    const response = await request.get(`admin/notifications?page=${page}&pageSize=${pageSize}`);
    const apiResponse = response.data;
    // API trả về ApiResponse<NotificationHistoryResponse> với structure: { success, message, data }
    // data chứa NotificationHistoryResponse
    const data = apiResponse?.data || apiResponse?.Data || apiResponse;
    return data || { items: [], page, pageSize, total: 0, totalPages: 0 };
};

export const adminSendNotificationApi = async (data: SendNotificationRequest): Promise<SendNotificationResponse> => {
    const response = await request.post("admin/notifications/send", data);
    const apiResponse = response.data;
    // API trả về ApiResponse<SendNotificationResponse> với structure: { success, message, data }
    // data chứa SendNotificationResponse
    const result = apiResponse?.data || apiResponse?.Data || apiResponse;
    return result || { sentCount: 0, totalRecipients: 0 };
};

