import request from "../../request";
export const getAllLearingScheduleForStudentApi = async (params) => {
    const data = await request.get(`/schedules/my-schedule?startDate=${params.startDate}&endDate=${params.endDate}`);
    return data.data;
};
