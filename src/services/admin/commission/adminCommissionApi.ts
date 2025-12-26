import request from "../../request";

export interface CommissionData {
    id?: string;
    oneToOneOnline: number;
    oneToOneOffline: number;
    groupClassOnline: number;
    groupClassOffline: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateCommissionParams {
    oneToOneOnline?: number;
    oneToOneOffline?: number;
    groupClassOnline?: number;
    groupClassOffline?: number;
}

export const getCommissionApi = async () => {
    const data = await request.get(`admin/commission`);
    // Backend trả về trực tiếp CommissionDto, không có ApiResponse wrapper
    return data.data || data;
};

export const updateCommissionApi = async (params: UpdateCommissionParams) => {
    const data = await request.put(`admin/commission`, params);
    // Backend trả về trực tiếp CommissionDto, không có ApiResponse wrapper
    return data.data || data;
};

