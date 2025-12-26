import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    PublicTutor,
    PublicTutors,
    PublicTutorState,
    ResponsePublicTutors,
} from "../../../types/tutor";
import {
    publicGet3TutorsApiThunk,
    publicGetAllTutorsApiThunk,
    publicGetDetailTutorApiThunk,
    publicGetTutorClassesApiThunk,
} from "./tutorThunk";
import type { ResponseFromServer } from "../../../types/app";
import { PublicClass } from "../../../types/public";

const initialState: PublicTutorState = {
    listTutors: null,
    list3Tutors: null,
    tutor: null,
    listTutorClasses: null,
};

export const publicTutorSlice = createSlice({
    name: "publicTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                publicGetAllTutorsApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<ResponsePublicTutors<PublicTutors[]>>
                    >,
                ) => {
                    state.listTutors = action.payload.data;
                },
            )
            .addCase(
                publicGet3TutorsApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<PublicTutors[]>>,
                ) => {
                    state.list3Tutors = action.payload.data;
                },
            )
            .addCase(
                publicGetDetailTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<PublicTutor>>,
                ) => {
                    state.tutor = action.payload.data;
                },
            )
            .addCase(
                publicGetTutorClassesApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<PublicClass[]>>,
                ) => {
                    state.listTutorClasses = action.payload.data;
                },
            );
    },
});

export const {} = publicTutorSlice.actions;

export default publicTutorSlice.reducer;
