import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllScheduleForTutorApi } from "./tutorScheduleApi";
import type {
    GetScheduleForTutorParams,
    ScheduleForTutor,
} from "../../../types/tutor";
import type { ResponseFromServer } from "../../../types/app";

const GET_ALL_TUTOR_SCHEDULE = "GET_ALL_TUTOR_SCHEDULE";

export const getAllScheduleForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<ScheduleForTutor[]>,
    GetScheduleForTutorParams
>(GET_ALL_TUTOR_SCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllScheduleForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
