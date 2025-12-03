import { createSlice } from "@reduxjs/toolkit";
import { getAllScheduleForTutorApiThunk } from "./tutorScheduleThunk";
const initialState = {
    list: [],
};
export const scheduleForTutorSlice = createSlice({
    name: "scheduleForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllScheduleForTutorApiThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
        });
    },
});
export const {} = scheduleForTutorSlice.actions;
export default scheduleForTutorSlice.reducer;
