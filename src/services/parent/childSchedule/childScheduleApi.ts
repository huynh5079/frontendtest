import { GetScheduleSpecificChildParams } from "../../../types/parent";
import request from "../../request";

export const getScheduleSpecificChildForParentApi = async (
    params: GetScheduleSpecificChildParams
) => {
    const data = await request.get(
        `/schedules/parent/child/${params.childProfileId}?startDate=${params.startDate}&endDate=${params.endDate}`
    );
    return data.data;
};

export const getDetailChildScheduleLessonForParentApi = async (
    lessonId: string
) => {
    const data = await request.get(`/lessons/${lessonId}`);
    return data.data;
};
