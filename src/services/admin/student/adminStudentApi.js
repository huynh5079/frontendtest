import request from "../../request";
export const getAllStudentForAdminApi = async (page) => {
    const data = await request.get(`admin/student?page=${page}`);
    return data.data;
};
export const getDetailStudentForAdminApi = async (studentId) => {
    const data = await request.get(`admin/student/detail/${studentId}`);
    return data.data;
};
