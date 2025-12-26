import type { AssignClassParamsForStudent } from "../../../types/student";
import request from "../../request";

export const assignClassForStudentApi = async (
    params: AssignClassParamsForStudent,
) => {
    const data = await request.post("/assigns", params);
    return data.data;
};

export const withdrawClassForStudentApi = async (
    classId: string,
    studentId: string,
) => {
    const data = await request.delete(
        `/assigns/${classId}?studentId=${studentId}`,
    );
    return data.data;
};

export const checkAssignClassForStudentApi = async (
    classId: string,
    studentId: string,
) => {
    const data = await request.get(
        `/assigns/check-enrollment/${classId}?studentId=${studentId}`,
    );
    return data.data;
};

export const getAllAssignedClassForStudentApi = async () => {
    const data = await request.get("/assigns/my-classes");
    return data.data;
};

export const getEnrollmentDetailApi = async (classId: string) => {
    const data = await request.get(`/assigns/${classId}/detail`);
    return data.data;
};