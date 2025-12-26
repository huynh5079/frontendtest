import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    ApplyrequestFindTutorForTutor,
    RequestFindTutorForTutor,
    RequestFindTutorForTutorState,
    ResponseGetRequestFindTutorForTutor,
} from "../../../types/tutor";
import {
    getAllRequestFindTutorForTutorApiThunk,
    getApplyRequestFindTutorForTutorApiThunk,
    getDetailRequestFindTutorForTutorApiThunk,
} from "./requestFindTutorThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: RequestFindTutorForTutorState = {
    list: [],
    detail: null,
    listApply: [],
};

export const requestFindTutorForTutorSlice = createSlice({
    name: "requestFindTutorForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllRequestFindTutorForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseGetRequestFindTutorForTutor<RequestFindTutorForTutor[]>
                    >,
                ) => {
                    console.log(action.payload);
                    state.list = action.payload.items;
                },
            )
            .addCase(
                getDetailRequestFindTutorForTutorApiThunk.fulfilled,
                (state, action: PayloadAction<RequestFindTutorForTutor>) => {
                    state.detail = action.payload;
                },
            )
            .addCase(
                getApplyRequestFindTutorForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<ApplyrequestFindTutorForTutor[]>
                    >,
                ) => {
                    state.listApply = action.payload.data;
                },
            );
    },
});

export const {} = requestFindTutorForTutorSlice.actions;

export default requestFindTutorForTutorSlice.reducer;
