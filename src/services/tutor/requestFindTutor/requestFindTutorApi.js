import request from "../../request";
export const getAllRequestFindTutorForTutorApi = async () => {
    const data = await request.get("/class-request/marketplace");
    return data.data;
};
export const getDetailRequestFindTutorForTutorApi = async (requestId) => {
    const data = await request.get(`/class-request/${requestId}`);
    return data.data;
};
export const applyRequestFindTutorForTutorApi = async (params) => {
    const data = await request.post(`/tutor-application`, params);
    return data.data;
};
export const getApplyRequestFindTutorForTutorApi = async () => {
    const data = await request.get(`/tutor-application/my-applications`);
    return data.data;
};
export const withdrawApplyRequestFindTutorForTutorApi = async (applyId) => {
    const data = await request.delete(`/tutor-application/${applyId}`);
    return data.data;
};
