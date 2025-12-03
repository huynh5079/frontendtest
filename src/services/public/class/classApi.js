import request from "../../request";
export const publicGetAllClassesApi = async () => {
    const data = await request.get(`/classes/available`);
    return data.data;
};
export const publicGetDetailClassApi = async (classId) => {
    const data = await request.get(`/classes/${classId}`);
    return data.data;
};
