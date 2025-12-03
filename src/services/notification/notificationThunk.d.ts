import type { NotificationResponseItem, NotificationResponse } from "../../types/notification";
export declare const getMyNotificationsApiThunk: import("@reduxjs/toolkit").AsyncThunk<NotificationResponse<NotificationResponseItem[]>, {
    pageNumber: number;
    pageSize: number;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const readNotificationApiThunk: import("@reduxjs/toolkit").AsyncThunk<any, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
