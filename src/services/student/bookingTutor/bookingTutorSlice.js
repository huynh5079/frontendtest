import { createSlice } from "@reduxjs/toolkit";
import { getAllClassRequestForStudentApiThunk, getDetailClassRequestForStudentApiThunk, } from "./bookingTutorThunk";
const initialState = {
    lists: [],
    detail: null,
};
export const bookingTutorStudentSlice = createSlice({
    name: "bookingTutorStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllClassRequestForStudentApiThunk.fulfilled, (state, action) => {
            state.lists = action.payload;
        })
            .addCase(getDetailClassRequestForStudentApiThunk.fulfilled, (state, action) => {
            state.detail = action.payload;
        });
    },
});
export const {} = bookingTutorStudentSlice.actions;
export default bookingTutorStudentSlice.reducer;
