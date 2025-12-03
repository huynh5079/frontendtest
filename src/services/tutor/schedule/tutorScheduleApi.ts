import type { GetScheduleForTutorParams } from "../../../types/tutor";
import request from "../../request";

export const getAllScheduleForTutorApi = async (
    params: GetScheduleForTutorParams
) => {
    const data = await request.get(
        `/schedules/tutor/${params.tutorProfileId}?startDate=${params.startDate}&endDate=${params.endDate}`
    );
    return data.data;
};
