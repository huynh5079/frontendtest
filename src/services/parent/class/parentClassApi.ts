import { AssignClassParamsForParent } from "../../../types/parent";
import request from "../../request";

export const assignClassForParentApi = async (
    params: AssignClassParamsForParent,
) => {
    const data = await request.post("/assigns", params);
    return data.data;
};

export const withdrawClassForParentApi = async (
    classId: string,
    studentId: string,
) => {
    const data = await request.delete(
        `/assigns/${classId}?studentId=${studentId}`,
    );
    return data.data;
};

export const checkAssignClassForParentApi = async (
    classId: string,
    studentId: string,
) => {
    const data = await request.get(
        `/assigns/check-enrollment/${classId}?studentId=${studentId}`,
    );
    return data.data;
};

export const getAllAssignedClassForParentApi = async (childId: string) => {
    const data = await request.get(`/assigns/my-classes?childId=${childId}`);
    return data.data;
};
