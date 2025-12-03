import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    BookingTutorStudentState,
    ClassRequests,
} from "../../../types/student";
import {
    getAllClassRequestForStudentApiThunk,
    getDetailClassRequestForStudentApiThunk,
} from "./bookingTutorThunk";

const initialState: BookingTutorStudentState = {
    lists: [],
    detail: null,
};

export const bookingTutorStudentSlice = createSlice({
    name: "bookingTutorStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllClassRequestForStudentApiThunk.fulfilled,
                (state, action: PayloadAction<ClassRequests[]>) => {
                    state.lists = action.payload;
                },
            )
            .addCase(
                getDetailClassRequestForStudentApiThunk.fulfilled,
                (state, action: PayloadAction<ClassRequests>) => {
                    state.detail = action.payload;
                },
            );
    },
});

export const {} = bookingTutorStudentSlice.actions;

export default bookingTutorStudentSlice.reducer;
