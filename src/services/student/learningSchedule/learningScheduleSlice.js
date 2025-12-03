import { createSlice } from "@reduxjs/toolkit";
import { getAllLearingScheduleForStudentApiThunk } from "./learningScheduleThunk";
const initialState = {
    list: [],
};
export const learningScheduleForStudentSlice = createSlice({
    name: "learningScheduleForStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllLearingScheduleForStudentApiThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
        });
    },
});
export const {} = learningScheduleForStudentSlice.actions;
export default learningScheduleForStudentSlice.reducer;
