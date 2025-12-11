import { AcceptBookingForTutorParams } from "../../../types/tutor";
import request from "../../request";

export const getAllBookingForTutorApi = async () => {
    const data = await request.get("/class-request/direct-requests");
    return data.data;
};

export const getDetailBookingForTutorApi = async (bookingId: string) => {
    const data = await request.get(`/class-request/${bookingId}`);
    return data.data;
};

export const acceptBookingForTutorApi = async (
    bookingId: string,
    params: AcceptBookingForTutorParams
) => {
    const data = await request.patch(
        `/class-request/${bookingId}/respond?accept=true`,
        params
    );
    return data.data;
};

export const rejectBookingForTutorApi = async (bookingId: string) => {
    const data = await request.patch(
        `/class-request/${bookingId}/respond?accept=false`
    );
    return data.data;
};
