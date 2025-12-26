import { CreateRescheduleParams } from "../../types/reschedule";
import request from "../request";

export const createRescheduleForStudentApi = async (
    lessonId: string,
    params: CreateRescheduleParams
) => {
    const data = await request.post(
        `/lessons/reschedule/${lessonId}/student-request`,
        params
    );
    return data.data;
};

export const createRescheduleForTutorApi = async (
    lessonId: string,
    params: CreateRescheduleParams
) => {
    const data = await request.post(
        `/lessons/reschedule/${lessonId}/request`,
        params
    );
    return data.data;
};

export const getAllRescheduleApi = async () => {
    const data = await request.get("/lessons/reschedule/pending-requests");
    return data.data;
};

export const acceptRescheduleApi = async (id: string) => {
    const data = await request.patch(`/lessons/reschedule/${id}/accept`);
    return data.data;
};

export const rejectRescheduleApi = async (id: string) => {
    const data = await request.patch(`/lessons/reschedule/${id}/deny`);
    return data.data;
};
