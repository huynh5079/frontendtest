import request from "../../request";
export const getAllBookingForTutorApi = async () => {
    const data = await request.get("/class-request/direct-requests");
    return data.data;
};
export const getDetailBookingForTutorApi = async (bookingId) => {
    const data = await request.get(`/class-request/${bookingId}`);
    return data.data;
};
export const acceptBookingForTutorApi = async (bookingId) => {
    const data = await request.patch(`/class-request/${bookingId}/accept`);
    return data.data;
};
export const rejectBookingForTutorApi = async (bookingId) => {
    const data = await request.patch(`/class-request/${bookingId}/reject`);
    return data.data;
};
