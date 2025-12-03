import request from "../../request";
export const createChildAccountApi = async (params) => {
    const data = await request.post("/parent/manage-children/create-account", params);
    return data.data;
};
export const getAllChildAccountApi = async () => {
    const data = await request.get("/parent/manage-children");
    return data.data;
};
export const getDetailChildAccountApi = async (childId) => {
    const data = await request.get(`/parent/manage-children/detail/${childId}`);
    return data.data;
};
