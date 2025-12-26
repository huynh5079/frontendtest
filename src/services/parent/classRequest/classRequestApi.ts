import request from "../../request";

export const getAllClassRequestForParentApi = async (childId: string) => {
    const data = await request.get(
        `/class-request/my-requests?childId=${childId}`
    );
    return data.data;
};
