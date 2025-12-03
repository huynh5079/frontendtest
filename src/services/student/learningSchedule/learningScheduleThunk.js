import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllLearingScheduleForStudentApi } from "./learningScheduleApi";
const GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT = "GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT";
export const getAllLearingScheduleForStudentApiThunk = createAsyncThunk(GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllLearingScheduleForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
