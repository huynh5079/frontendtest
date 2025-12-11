import type { AdminCancelClassParams, AdminCancelStudentEnrollmentParams } from "../../../types/class";
import request from "../../request";

export const adminGetAllClassesApi = async () => {
    const data = await request.get("/classes/available");
    return data.data;
};

export const adminCancelClassApi = async (
    classId: string,
    params: AdminCancelClassParams
) => {
    const data = await request.post(`admin/classes/${classId}/cancel`, params);
    return data.data;
};

export const adminCancelStudentEnrollmentApi = async (
    classId: string,
    studentId: string,
    params: AdminCancelStudentEnrollmentParams
) => {
    const data = await request.post(
        `admin/classes/${classId}/students/${studentId}/cancel`,
        params
    );
    return data.data;
};

