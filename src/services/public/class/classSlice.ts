import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type { PublicClass, PublicClassState } from "../../../types/public";
import {
    publicGetAllClassesApiThunk,
    publicGetDetailClassApiThunk,
} from "./classthunk";

const initialState: PublicClassState = {
    list: [],
    detail: null,
};

export const publicClassSlice = createSlice({
    name: "publicClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                publicGetAllClassesApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<PublicClass[]>>
                ) => {
                    state.list = action.payload.data;
                }
            )
            .addCase(
                publicGetDetailClassApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<PublicClass>>
                ) => {
                    state.detail = action.payload.data;
                }
            );
    },
});

export const {} = publicClassSlice.actions;

export default publicClassSlice.reducer;
