import type {
    TutorForAdmin,
    TutorForAdminState,
    TutorsForAdmin,
} from "../../../types/admin";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    acceptTutorApiThunk,
    getAllTutorForAdminApiThunk,
    getDetailTutorForAdminApiThunk,
    provideTutorApiThunk,
    rejectTutorApiThunk,
} from "./adminTutorThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: TutorForAdminState = {
    listTutors: [],
    tutor: null,
};

export const tutorForAdminSlice = createSlice({
    name: "tutorForAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllTutorForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorsForAdmin[]>>,
                ) => {
                    state.listTutors = action.payload.data;
                },
            )
            .addCase(
                getDetailTutorForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorForAdmin>>,
                ) => {
                    state.tutor = action.payload.data;
                },
            )
            .addCase(
                acceptTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorForAdmin>>,
                ) => {
                    state.tutor = action.payload.data;
                },
            )
            .addCase(
                rejectTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorForAdmin>>,
                ) => {
                    state.tutor = action.payload.data;
                },
            )
            .addCase(
                provideTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorForAdmin>>,
                ) => {
                    state.tutor = action.payload.data;
                },
            );
    },
});

export const {} = tutorForAdminSlice.actions;

export default tutorForAdminSlice.reducer;
