import { type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationResponse, NotificationResponseItem, NotificationState } from "../../types/notification";
export declare const notificationSlice: import("@reduxjs/toolkit").Slice<NotificationState, {
    setNotifications: (state: import("immer").WritableDraft<NotificationState>, action: PayloadAction<NotificationResponse<NotificationResponseItem[]>>) => void;
    addNotification: (state: import("immer").WritableDraft<NotificationState>, action: PayloadAction<NotificationResponseItem>) => void;
}, "notification", "notification", import("@reduxjs/toolkit").SliceSelectors<NotificationState>>;
export declare const setNotifications: import("@reduxjs/toolkit").ActionCreatorWithPayload<NotificationResponse<NotificationResponseItem[]>, "notification/setNotifications">, addNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<NotificationResponseItem, "notification/addNotification">;
declare const _default: import("redux").Reducer<NotificationState>;
export default _default;
