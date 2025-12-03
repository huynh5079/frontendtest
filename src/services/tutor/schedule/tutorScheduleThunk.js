import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllScheduleForTutorApi } from "./tutorScheduleApi";
const GET_ALL_TUTOR_SCHEDULE = "GET_ALL_TUTOR_SCHEDULE";
export const getAllScheduleForTutorApiThunk = createAsyncThunk(GET_ALL_TUTOR_SCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllScheduleForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
