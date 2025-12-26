import request from "../../request";

export const getAllParentForAdminApi = async (page: number) => {
    console.log("[Frontend API] Calling getAllParentForAdminApi with page:", page);
    const response = await request.get(`admin/parent?page=${page}`);
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

export const getDetailParentForAdminApi = async (parentId: string) => {
    const data = await request.get(`admin/parent/detail/${parentId}`);
    return data.data;
};