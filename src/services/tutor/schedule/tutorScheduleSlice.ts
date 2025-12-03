import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    ScheduleForTutor,
    ScheduleForTutorState,
} from "../../../types/tutor";
import { getAllScheduleForTutorApiThunk } from "./tutorScheduleThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: ScheduleForTutorState = {
    list: [],
};

export const scheduleForTutorSlice = createSlice({
    name: "scheduleForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getAllScheduleForTutorApiThunk.fulfilled,
            (
                state,
                action: PayloadAction<ResponseFromServer<ScheduleForTutor[]>>
            ) => {
                state.list = action.payload.data;
            }
        );
    },
});

export const {} = scheduleForTutorSlice.actions;

export default scheduleForTutorSlice.reducer;
