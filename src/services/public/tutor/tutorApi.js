import request from "../../request";
export const publicGetAllTutorsApi = async (page) => {
    const data = await request.get(`/tutor?page=${page}`);
    return data.data;
};
export const publicGetDetailTutorApi = async (tutorId) => {
    const data = await request.get(`/tutor/detail/${tutorId}`);
    return data.data;
};
