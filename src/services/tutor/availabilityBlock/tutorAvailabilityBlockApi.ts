import type {
    CreateTutorAvailabilityParams,
    GetAllTutorAvailabilityParams,
} from "../../../types/tutorAvailabilityBlock";
import request from "../../request";

export const getAllAvailabilityBlockForTutorApi = async (
    params: GetAllTutorAvailabilityParams,
) => {
    const data = await request.get(
        `/availability-block/blocks?startDate=${params.startTime}&endDate=${params.endTime}`,
    );
    return data.data;
};

export const createAvailabilityBlockForTutorApi = async (
    params: CreateTutorAvailabilityParams,
) => {
    const data = await request.post("/availability-block/blocks", params);
    return data.data;
};

export const deleteAvailabilityBlockForTutorApi = async (
    availabilityBlockId: string,
) => {
    const data = await request.delete(
        `/availability-block/blocks/${availabilityBlockId}`,
    );
    return data.data;
};
