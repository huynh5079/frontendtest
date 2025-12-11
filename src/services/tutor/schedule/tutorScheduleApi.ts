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

export const getAllOneOnOneStudentForTutorApi = async () => {
    const data = await request.get(`/assigns/my-students`);
    return data.data;
};

export const getAllStudyScheduleWithSpecificStudentForTutorApi = async (
    studentId: string,
    params: GetScheduleForTutorParams
) => {
    const data = await request.get(
        `/schedules/tutor/${params.tutorProfileId}?startDate=${params.startDate}&endDate=${params.endDate}&studentId=${studentId}`
    );
    return data.data;
};

export const getAllStudyScheduleWithSpecificClassForTutorApi = async (
    classId: string,
    params: GetScheduleForTutorParams
) => {
    const data = await request.get(
        `/schedules/tutor/${params.tutorProfileId}?startDate=${params.startDate}&endDate=${params.endDate}&classId=${classId}`
    );
    return data.data;
};

export const getDetailScheduleLessonForTutorApi = async (lessonId: string) => {
    const data = await request.get(`/lessons/${lessonId}/tutor-detail`);
    return data.data;
};
