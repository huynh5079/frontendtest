import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import type { AppGlobalState } from "../../types/app";

const initialState: AppGlobalState = {
    loading: false,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (_) => {},
});

export const { setLoading } = appSlice.actions;

export default appSlice.reducer;
