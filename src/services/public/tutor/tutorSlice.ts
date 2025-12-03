import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    PublicTutor,
    PublicTutors,
    PublicTutorState,
    ResponsePublicTutors,
} from "../../../types/tutor";
import {
    publicGetAllTutorsApiThunk,
    publicGetDetailTutorApiThunk,
} from "./tutorThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: PublicTutorState = {
    listTutors: null,
    tutor: null,
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
                publicGetDetailTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<PublicTutor>>,
                ) => {
                    state.tutor = action.payload.data;
                },
            );
    },
});

export const {} = publicTutorSlice.actions;

export default publicTutorSlice.reducer;
