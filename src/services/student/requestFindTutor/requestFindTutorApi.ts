import request from "../../request";

export const getAllApplyRequestFindTutorForStudentApi = async (
    requestId: string,
) => {
    const data = await request.get(`/tutor-application/request/${requestId}`);
    return data.data;
};

export const acceptApplyRequestFindTutorForStudentApi = async (
    applyId: string,
) => {
    const data = await request.put(`/tutor-application/${applyId}/accept`);
    return data.data;
};

export const rejectApplyRequestFindTutorForStudentApi = async (
    applyId: string,
) => {
    const data = await request.put(`/tutor-application/${applyId}/reject`);
    return data.data;
};
