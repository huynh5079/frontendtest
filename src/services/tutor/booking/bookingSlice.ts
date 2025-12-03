import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    BookingForTutor,
    BookingForTutorState,
} from "../../../types/tutor";
import {
    getAllBookingForTutorApiThunk,
    getDetailBookingForTutorApiThunk,
} from "./bookingThunk";

const initialState: BookingForTutorState = {
    list: [],
    detail: null,
};

export const bookingForTutorSlice = createSlice({
    name: "bookingForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllBookingForTutorApiThunk.fulfilled,
                (state, action: PayloadAction<BookingForTutor[]>) => {
                    state.list = action.payload;
                }
            )
            .addCase(
                getDetailBookingForTutorApiThunk.fulfilled,
                (state, action: PayloadAction<BookingForTutor>) => {
                    state.detail = action.payload;
                }
            );
    },
});

export const {} = bookingForTutorSlice.actions;

export default bookingForTutorSlice.reducer;
