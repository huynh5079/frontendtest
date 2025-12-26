import type { RejectTutor, ProvideTutor } from "../../../types/admin";
import request from "../../request";

export const getAllTutorForAdminApi = async (page: number) => {
    console.log("[Frontend API] Calling getAllTutorForAdminApi with page:", page);
    const response = await request.get(`admin/tutor?page=${page}`);
    console.log("[Frontend API] Full response:", response);
    console.log("[Frontend API] response.data:", response.data);
    
    // Backend trả về ApiResponse<object> với structure:
    // { Status: "Success", Message: "...", Data: { items: [...], page, size, total, totalPages } }
    const apiResponse = response.data;
    const data = apiResponse?.Data || apiResponse?.data;
    
    if (data) {
        console.log("[Frontend API] Extracted data:", data);
        // Trả về toàn bộ object data (bao gồm items, page, size, total, totalPages)
        // để slice có thể truy cập data.items
        return {
            status: apiResponse?.Status || apiResponse?.status || "Success",
            message: apiResponse?.Message || apiResponse?.message || "",
            data: {
                items: data.items || data.Items || [],
                page: data.page || data.Page || page,
                size: data.size || data.Size || 5,
                total: data.total || data.Total || 0,
                totalPages: data.totalPages || data.TotalPages || 0,
            },
        };
    }
    
    console.warn("[Frontend API] No data found in response");
    return {
        status: "Fail",
        message: "Không tìm thấy dữ liệu",
        data: {
            items: [],
            page: page,
            size: 5,
            total: 0,
            totalPages: 0,
        },
    };
};

export const getDetailTutorForAdminApi = async (tutorId: string) => {
    const data = await request.get(`admin/tutor/detail/${tutorId}`);
    return data.data;
}

export const acceptTutorApi = async (tutorId: string) => {
    const data = await request.put(`admin/tutor/accept/${tutorId}`);
    return data.data;
}

export const rejectTutorApi = async (tutorId: string, params: RejectTutor) => {
    const data = await request.put(`admin/tutor/reject/${tutorId}`, params);
    return data.data;
}

export const providetutorApi = async (tutorId: string, params: ProvideTutor) => {
    const data = await request.put(`admin/tutor/provide/${tutorId}`, params);
    return data.data;
}