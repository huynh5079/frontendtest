import type { GetLearingScheduleForStudentParams } from "../../../types/student";
import request from "../../request";

export const getAllLearingScheduleForStudentApi = async (
    params: GetLearingScheduleForStudentParams,
) => {
    const data = await request.get(
        `/schedules/my-schedule?startDate=${params.startDate}&endDate=${params.endDate}`,
    );
    return data.data;
};
