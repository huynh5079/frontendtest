import request from "../request";
export const getMyNotificationsApi = async (pageNumber, pageSize) => {
    const res = await request.get(`/notifications/me?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
};
export const readNotificationApi = async (notificationId) => {
    const data = await request.put(`api/notification/me/${notificationId}/read`);
    return data.data;
};
