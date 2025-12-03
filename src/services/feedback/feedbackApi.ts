import type {
    CreateFeedbackInClass,
    CreateFeedbackInTutorProfile,
} from "../../types/feedback";
import request from "../request";

export const createFeedbackInTutorProfileApi = async (
    tutorUserId: string,
    params: CreateFeedbackInTutorProfile
) => {
    const data = await request.post(`/feedbacks/tutors/${tutorUserId}`, params);
    return data.data;
};

export const createFeedbackInClassApi = async (
    params: CreateFeedbackInClass
) => {
    const data = await request.post(`/feedbacks`, params);
    return data.data;
};

export const getAllFeedbackInTutorProfileApi = async (
    tutorUserId: string,
    page: number,
    pageSize: number
) => {
    const data = await request.get(
        `/feedbacks/tutors/${tutorUserId}?page=${page}&pageSize=${pageSize}`
    );
    return data.data;
};
