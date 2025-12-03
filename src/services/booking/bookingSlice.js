import { createSlice } from "@reduxjs/toolkit";
import { getAllTutorScheduleApiThunk } from "./bookingThunk";
const initialState = {
    listTutorSchedule: [],
};
export const tutorScheduleSlice = createSlice({
    name: "tutorSchedule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTutorScheduleApiThunk.fulfilled, (state, action) => {
            state.listTutorSchedule = action.payload.data;
        });
    },
});
export const {} = tutorScheduleSlice.actions;
export default tutorScheduleSlice.reducer;
