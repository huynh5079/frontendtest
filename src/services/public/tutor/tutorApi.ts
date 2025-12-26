import request from "../../request";

export const publicGetAllTutorsApi = async (page: number) => {
    const data = await request.get(`/tutor?page=${page}`);
    return data.data;
};

export const publicGet3TutorsApi = async () => {
    const data = await request.get(`/tutor/top-rated?count=3`);
    return data.data;
};

export const publicGetDetailTutorApi = async (tutorId: string) => {
    const data = await request.get(`/tutor/detail/${tutorId}`);
    return data.data;
};

export const publicGetTutorClassesApi = async (
    tutorId: string,
) => {
    const data = await request.get(
        `/classes/tutor/${tutorId}`,
    );
    return data.data;
}
