import request from "../../request";

export const getAllParentForAdminApi = async (page: number) => {
    const data = await request.get(`admin/parent?page=${page}`);
    return data.data;
};

export const getDetailParentForAdminApi = async (parentId: string) => {
    const data = await request.get(`admin/parent/detail/${parentId}`);
    return data.data;
};