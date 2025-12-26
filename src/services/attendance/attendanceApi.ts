import request from "../request";

export const getAttendanceForStudentApi = async (classId: string) => {
    const data = await request.get(
        `/attendance/class/${classId}/my-attendance`,
    );

    return data.data;
};

export const getAttendanceForParentApi = async (
    classId: string,
    studentId: string,
) => {
    const data = await request.get(
        `/attendance/class/${classId}/child/${studentId}`,
    );

    return data.data;
};

export const getAttendanceOverviewForTutorApi = async (classId: string) => {
    const data = await request.get(`/attendance/class/${classId}/overview`);

    return data.data;
};

export const getStudentAttendanceDetailForTutorApi = async (
    classId: string,
    studentId: string,
) => {
    const data = await request.get(
        `/attendance/class/${classId}/student/${studentId}`,
    );
    return data.data;
};

export const getLessonAttendanceDetailForTutorApi = async (
    lessonId: string,
) => {
    const data = await request.get(`/attendance/lesson/${lessonId}/detail`);
    return data.data;
};
