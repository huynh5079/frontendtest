import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import { getAllLearingScheduleForStudentApi } from "./learningScheduleApi";
import type {
    GetLearingScheduleForStudentParams,
    learningScheduleForStudent,
} from "../../../types/student";

const GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT =
    "GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT";

export const getAllLearingScheduleForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<learningScheduleForStudent[]>,
    GetLearingScheduleForStudentParams
>(
    GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllLearingScheduleForStudentApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);
