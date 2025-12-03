import { createSlice } from "@reduxjs/toolkit";
import { getAllBookingForTutorApiThunk, getDetailBookingForTutorApiThunk, } from "./bookingThunk";
const initialState = {
    list: [],
    detail: null,
};
export const bookingForTutorSlice = createSlice({
    name: "bookingForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBookingForTutorApiThunk.fulfilled, (state, action) => {
            state.list = action.payload;
        })
            .addCase(getDetailBookingForTutorApiThunk.fulfilled, (state, action) => {
            state.detail = action.payload;
        });
    },
});
export const {} = bookingForTutorSlice.actions;
export default bookingForTutorSlice.reducer;
