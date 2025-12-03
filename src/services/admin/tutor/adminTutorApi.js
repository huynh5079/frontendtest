import request from "../../request";
export const getAllTutorForAdminApi = async (page) => {
    const data = await request.get(`admin/tutor?page=${page}`);
    return data.data;
};
export const getDetailTutorForAdminApi = async (tutorId) => {
    const data = await request.get(`admin/tutor/detail/${tutorId}`);
    return data.data;
};
export const acceptTutorApi = async (tutorId) => {
    const data = await request.put(`admin/tutor/accept/${tutorId}`);
    return data.data;
};
export const rejectTutorApi = async (tutorId, params) => {
    const data = await request.put(`admin/tutor/reject/${tutorId}`, params);
    return data.data;
};
export const providetutorApi = async (tutorId, params) => {
    const data = await request.put(`admin/tutor/provide/${tutorId}`, params);
    return data.data;
};
