import type { UpdateStudentProfileParams } from "../../types/user";
import request from "../request";

export const getProfileTutorApi = async () => {
    const data = await request.get(`/profile/tutor`);
    return data.data;
};

export const getProfileParentApi = async () => {
    const data = await request.get(`/profile/parent`);
    return data.data;
};

export const getProfileStudentApi = async () => {
    const data = await request.get(`/profile/student`);
    return data.data;
};

export const updateProfileStudentApi = async (
    params: UpdateStudentProfileParams
) => {
    const data = await request.put(`/profile/update/student`, params);
    return data.data;
};
