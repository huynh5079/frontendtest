import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTutorScheduleApi } from "./bookingApi";
const GET_ALL_TUTOR_SCHEDULE = "GET_ALL_TUTOR_SCHEDULE";
export const getAllTutorScheduleApiThunk = createAsyncThunk(GET_ALL_TUTOR_SCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllTutorScheduleApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
