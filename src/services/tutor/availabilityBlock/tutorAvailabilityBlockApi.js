import request from "../../request";
export const getAllAvailabilityBlockForTutorApi = async (params) => {
    const data = await request.get(`/availability-block/blocks?startDate=${params.startTime}&endDate=${params.endTime}`);
    return data.data;
};
export const createAvailabilityBlockForTutorApi = async (params) => {
    const data = await request.post("/availability-block/blocks", params);
    return data.data;
};
export const deleteAvailabilityBlockForTutorApi = async (availabilityBlockId) => {
    const data = await request.delete(`/availability-block/blocks/${availabilityBlockId}`);
    return data.data;
};
