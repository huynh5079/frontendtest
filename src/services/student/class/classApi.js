import request from "../../request";
export const assignClassForStudentApi = async (params) => {
    const data = await request.post("/assigns", params);
    return data.data;
};
export const withdrawClassForStudentApi = async (classId) => {
    const data = await request.delete(`/assigns/${classId}`);
    return data.data;
};
export const checkAssignClassForStudentApi = async (classId) => {
    const data = await request.get(`/assigns/${classId}/check`);
    return data.data;
};
export const getAllAssignedClassForStudentApi = async () => {
    const data = await request.get("/assigns/my-classes");
    return data.data;
};
