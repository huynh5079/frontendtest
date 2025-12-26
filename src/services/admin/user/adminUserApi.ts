import request from "../../request";

export interface BanUserParams {
    Reason?: string;
    DurationDays?: number;
}

export interface UnbanUserParams {
    Reason?: string;
}

export const banUserApi = async (userId: string, params: BanUserParams) => {
    const data = await request.put(`admin/ban_account/${userId}`, params);
    return data.data;
};

export const unbanUserApi = async (userId: string, params: UnbanUserParams) => {
    const data = await request.put(`admin/unban_account/${userId}`, params);
    return data.data;
};

