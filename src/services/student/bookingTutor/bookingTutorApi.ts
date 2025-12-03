import type {
    CreateClassRequestParams,
    Schedule,
    UpdateInfoClassRequestParams,
} from "../../../types/student";
import request from "../../request";

export const createClassRequestForStudentApi = async (
    params: CreateClassRequestParams,
) => {
    const data = await request.post("/class-request", params);
    return data.data;
};

export const getAllClassRequestForStudentApi = async () => {
    const data = await request.get("/class-request/my-requests");
    return data.data;
};

export const getDetailClassRequestForStudentApi = async (requestId: string) => {
    const data = await request.get(`/class-request/${requestId}`);
    return data.data;
};

export const updateInfoClassRequestForStudentApi = async (
    requestId: string,
    params: UpdateInfoClassRequestParams,
) => {
    const data = await request.put(`/class-request/${requestId}`, params);
    return data.data;
};

export const UpdateScheduleClassRequestForStudentApi = async (
    requestId: string,
    params: Schedule[],
) => {
    const data = await request.put(`/class-request/${requestId}/schedules`, params);
    return data.data;
};

export const cancelClassRequestForStudentApi = async (requestId: string) => {
    const data = await request.patch(`/class-request/${requestId}/cancel`);
    return data.data;
};
