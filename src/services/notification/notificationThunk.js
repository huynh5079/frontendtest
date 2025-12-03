import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyNotificationsApi, readNotificationApi } from "./notificationApi";
const READ_NOTIFICATION = "READ_NOTIFICATION";
const GET_MY_NOTIFICATIONS = "GET_MY_NOTIFICATIONS";
export const getMyNotificationsApiThunk = createAsyncThunk(GET_MY_NOTIFICATIONS, async (payload, { rejectWithValue }) => {
    try {
        const response = await getMyNotificationsApi(payload.pageNumber, payload.pageSize);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});
export const readNotificationApiThunk = createAsyncThunk(READ_NOTIFICATION, async (notificationId, { rejectWithValue }) => {
    try {
        const response = await readNotificationApi(notificationId);
        return response.data; // Trả về dữ liệu từ API
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
