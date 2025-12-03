import request from "../request";
export const createFeedbackInTutorProfileApi = async (tutorUserId, params) => {
    const data = await request.post(`/feedbacks/tutors/${tutorUserId}`, params);
    return data.data;
};
export const createFeedbackInClassApi = async (params) => {
    const data = await request.post(`/feedbacks`, params);
    return data.data;
};
export const getAllFeedbackInTutorProfileApi = async (tutorUserId, page, pageSize) => {
    const data = await request.get(`/feedbacks/tutors/${tutorUserId}?page=${page}&pageSize=${pageSize}`);
    return data.data;
};
