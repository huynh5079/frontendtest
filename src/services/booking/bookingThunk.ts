import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
    GetAllTutorScheduleParams,
    TutorSchedules,
} from "../../types/booking";
import { getAllTutorScheduleApi } from "./bookingApi";
import type { ResponseFromServer } from "../../types/app";

const GET_ALL_TUTOR_SCHEDULE = "GET_ALL_TUTOR_SCHEDULE";

export const getAllTutorScheduleApiThunk = createAsyncThunk<
    ResponseFromServer<TutorSchedules[]>,
    GetAllTutorScheduleParams
>(GET_ALL_TUTOR_SCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllTutorScheduleApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
