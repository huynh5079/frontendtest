import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    BookingTutorStudentState,
    ClassRequests,
} from "../../../types/student";
import {
    getAllClassRequestForStudentApiThunk,
    getDetailClassRequestForStudentApiThunk,
} from "./bookingTutorThunk";
import { ResponseFromServer } from "../../../types/app";

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
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ClassRequests[]>>
                ) => {
                    state.lists = action.payload.data;
                }
            )
            .addCase(
                getDetailClassRequestForStudentApiThunk.fulfilled,
                (state, action: PayloadAction<ClassRequests>) => {
                    state.detail = action.payload;
                }
            );
    },
});

export const {} = bookingTutorStudentSlice.actions;

export default bookingTutorStudentSlice.reducer;
