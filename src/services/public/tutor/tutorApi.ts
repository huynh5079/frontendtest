import request from "../../request";

export const publicGetAllTutorsApi = async (page: number) => {
    const data = await request.get(`/tutor?page=${page}`);
    return data.data;
};

export const publicGetDetailTutorApi = async (tutorId: string) => {
    const data = await request.get(`/tutor/detail/${tutorId}`);
    return data.data;
};
