import request from "../request";

export const favoriteTutorApi = async (tutorProfileId: string) => {
    const data = await request.post(`/favorite-tutors/${tutorProfileId}`);
    return data.data;
};

export const checkFavoriteTutorApi = async (tutorProfileId: string) => {
    const data = await request.get(`/favorite-tutors/check/${tutorProfileId}`);
    return data.data;
};

export const deleteFavoriteTutorApi = async (tutorProfileId: string) => {
    const data = await request.delete(`/favorite-tutors/${tutorProfileId}`);
    return data.data;
};

export const getAllFavoriteTutorApi = async () => {
    const data = await request.get(`/favorite-tutors`);
    return data.data;
};
