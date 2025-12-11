import {
    MarkAttendance11Params,
    MarkAttendanceManyStudentsParams,
} from "../../../types/tutor";
import request from "../../request";

export const markAttendance11ForTutorApi = async (
    params: MarkAttendance11Params
) => {
    const data = await request.post(`/attendance/mark`, params);
    return data.data;
};

export const markAttendanceManyStudentsForTutorApi = async (
    lessonId: string,
    params: MarkAttendanceManyStudentsParams
) => {
    const data = await request.post(
        `/attendance/mark-bulk/${lessonId}`,
        params
    );
    return data.data;
};
