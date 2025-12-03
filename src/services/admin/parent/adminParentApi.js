import request from "../../request";
export const getAllParentForAdminApi = async (page) => {
    const data = await request.get(`admin/parent?page=${page}`);
    return data.data;
};
export const getDetailParentForAdminApi = async (parentId) => {
    const data = await request.get(`admin/parent/detail/${parentId}`);
    return data.data;
};
