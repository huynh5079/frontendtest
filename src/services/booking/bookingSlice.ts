
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TutorSchedules, TutorScheduleState } from "../../types/booking";
import { getAllTutorScheduleApiThunk } from "./bookingThunk";
import type { ResponseFromServer } from "../../types/app";

const initialState: TutorScheduleState = {
    listTutorSchedule: [],
};

export const tutorScheduleSlice = createSlice({
    name: "tutorSchedule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllTutorScheduleApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorSchedules[]>>,
                ) => {
                    state.listTutorSchedule = action.payload.data;
                },
            );
    },
});

export const {} = tutorScheduleSlice.actions;

export default tutorScheduleSlice.reducer;
