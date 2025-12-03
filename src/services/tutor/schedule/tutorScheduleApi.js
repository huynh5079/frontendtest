import request from "../../request";
export const getAllScheduleForTutorApi = async (params) => {
    const data = await request.get(`/schedules/tutor/${params.tutorProfileId}?startDate=${params.startDate}&endDate=${params.endDate}`);
    return data.data;
};
