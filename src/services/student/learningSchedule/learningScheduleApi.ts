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

export const getAllLearingScheduleWithSpecificTutorForStudentApi = async (
    tutorId: string,
    params: GetLearingScheduleForStudentParams,
) => {
    const data = await request.get(
        `/schedules/my-schedule?startDate=${params.startDate}&endDate=${params.endDate}&tutorId=${tutorId}`,
    );
    return data.data;
};

export const getAllLearingScheduleWithOngoingClassForStudentApi = async (
    classId: string,
    params: GetLearingScheduleForStudentParams,
) => {
    const data = await request.get(
        `/schedules/my-schedule?startDate=${params.startDate}&endDate=${params.endDate}&classId=${classId}`,
    );
    return data.data;
};

export const getDetailScheduleLessonForStudentApi = async (
    lessonId: string,
) => {
    const data = await request.get(`/lessons/${lessonId}`);
    return data.data;
};

export const getAllOneOnOneTutorForStudentApi = async () => {
    const data = await request.get(`/assigns/my-tutors`);
    return data.data;
};
