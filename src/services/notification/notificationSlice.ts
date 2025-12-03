import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    getMyNotificationsApiThunk,
    readNotificationApiThunk,
} from "./notificationThunk";
import type {
    NotificationResponse,
    NotificationResponseItem,
    NotificationState,
} from "../../types/notification";

const initialState: NotificationState = {
    notifications: [],
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (
            state,
            action: PayloadAction<
                NotificationResponse<NotificationResponseItem[]>
            >,
        ) => {
            state.notifications = action.payload.items;
        },
        addNotification: (
            state,
            action: PayloadAction<NotificationResponseItem>,
        ) => {
            state.notifications.unshift(action.payload); // Thêm notification mới vào đầu
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                readNotificationApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        NotificationResponse<NotificationResponseItem[]>
                    >,
                ) => {
                    if (!action.payload || !action.payload.items) {
                        return;
                    }

                    const notificationId = action.payload.items[0].id;
                    const notificationIndex = state.notifications.findIndex(
                        (notif) => notif.id === notificationId,
                    );
                    if (notificationIndex !== -1) {
                        state.notifications[notificationIndex] = {
                            ...state.notifications[notificationIndex],
                            status: "Read",
                        };
                    }
                },
            )
            .addCase(
                getMyNotificationsApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        NotificationResponse<NotificationResponseItem[]>
                    >,
                ) => {
                    state.notifications = action.payload.items;
                },
            );
    },
});

export const { setNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
