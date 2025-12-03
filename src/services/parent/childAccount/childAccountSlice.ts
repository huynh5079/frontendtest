import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    ChildAccount,
    ChildAccounts,
    ChildAccountState,
} from "../../../types/parent";
import {
    getAllChildAccountApiThunk,
    getDetailChildAccountApiThunk,
} from "./childAccountThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: ChildAccountState = {
    listChildAccounts: [],
    detailChildAccount: null,
};

export const childAccountSlice = createSlice({
    name: "childAccount",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllChildAccountApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ChildAccounts[]>>
                ) => {
                    state.listChildAccounts = action.payload.data;
                }
            )
            .addCase(
                getDetailChildAccountApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ChildAccount>>
                ) => {
                    state.detailChildAccount = action.payload.data;
                }
            );
    },
});

export const {} = childAccountSlice.actions;

export default childAccountSlice.reducer;
