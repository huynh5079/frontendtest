import request from "../request";

export const getMyNotificationsApi = async (
    pageNumber: number,
    pageSize: number,
) => {
    const res = await request.get(
        `/notifications/me?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
    return res.data;
};

export const readNotificationApi = async (notificationId: string) => {
    const data = await request.put(
        `/notifications/me/${notificationId}/read`,
    );
    return data.data;
};
