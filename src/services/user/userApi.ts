import { TutorProfileUpdateParams } from "../../types/tutor";
import type {
    UpdateParentProfileParams,
    UpdateStudentProfileParams,
} from "../../types/user";
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
    params: UpdateStudentProfileParams,
) => {
    const data = await request.put(`/profile/update/student`, params);
    return data.data;
};

export const updateProfileParentApi = async (
    params: UpdateParentProfileParams,
) => {
    const data = await request.put(`/profile/update/parent`, params);
    return data.data;
};

export const updateProfileTutorApi = async (
    params: TutorProfileUpdateParams,
) => {
    const data = await request.put(`/profile/update/tutor`, params);
    return data.data;
};

export const updateAvatarApi = async (formData: FormData) => {
    const data = await request.put(`/profile/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data.data;
};
