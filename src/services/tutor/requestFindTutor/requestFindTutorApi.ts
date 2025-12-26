import type { ApplyrequestFindTutorForTutorParams } from "../../../types/tutor";
import request from "../../request";

export const getAllRequestFindTutorForTutorApi = async () => {
    const response = await request.get("/class-request/marketplace-tutor");
    console.log("[Frontend API] Full response:", response);
    console.log("[Frontend API] response.data:", response.data);
    
    // Backend trả về ApiResponse<object> với structure:
    // { Status: "Success", Message: "...", Data: { totalCount, items, page, pageSize } }
    // Hoặc có thể là camelCase: { status, message, data: { totalCount, items, page, pageSize } }
    const apiResponse = response.data;
    
    // Lấy Data từ ApiResponse (handle cả PascalCase và camelCase)
    const data = apiResponse?.Data || apiResponse?.data;
    
    if (data) {
        console.log("[Frontend API] Extracted data:", data);
        // Return với structure mà frontend expect: { items, totalCount }
        return {
            items: data.items || data.Items || [],
            totalCount: data.totalCount || data.TotalCount || 0,
        };
    }
    
    console.warn("[Frontend API] No data found in response");
    return {
        items: [],
        totalCount: 0,
    };
};

export const getDetailRequestFindTutorForTutorApi = async (
    requestId: string,
) => {
    const data = await request.get(`/class-request/${requestId}`);
    return data.data;
};

export const applyRequestFindTutorForTutorApi = async (
    params: ApplyrequestFindTutorForTutorParams,
) => {
    const data = await request.post(`/tutor-application`, params);
    return data.data;
};

export const getApplyRequestFindTutorForTutorApi = async () => {
    const data = await request.get(`/tutor-application/my-applications`);
    return data.data;
};

export const withdrawApplyRequestFindTutorForTutorApi = async (
    applyId: string,
) => {
    const data = await request.delete(`/tutor-application/${applyId}`);
    return data.data;
};
