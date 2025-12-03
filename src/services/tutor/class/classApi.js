import request from "../../request";
export const createClassApi = async (params) => {
    const data = await request.post("/classes", params);
    return data.data;
};
export const getAllClassApi = async () => {
    const data = await request.get("/classes/my-classes");
    return data.data;
};
export const getDetailClassApi = async (classId) => {
    const data = await request.get(`/classes/${classId}`);
    return data.data;
};
export const getAllStudentEnrolledClassForTutorApi = async () => {
    const data = await request.get(`/assigns/tutor/my-students`);
    return data.data;
};
export const updateInfoClassForTutorApi = async (classId, params) => {
    const data = await request.put(`/classes/${classId}`, params);
    return data.data;
};
export const UpdateScheduleClassForTutorApi = async (classId, params) => {
    const data = await request.put(`/classes/${classId}/schedules`, params);
    return data.data;
};
export const deleteClassForTutorApi = async (classId) => {
    const data = await request.delete(`/classes/${classId}`);
    return data.data;
};
