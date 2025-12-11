import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type { PublicClass } from "../../../types/public";
import { adminGetAllClassesApiThunk } from "./adminClassThunk";

type AdminClassState = {
    listClasses: PublicClass[];
};

const initialState: AdminClassState = {
    listClasses: [],
};

export const adminClassSlice = createSlice({
    name: "adminClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            adminGetAllClassesApiThunk.fulfilled,
            (state, action: PayloadAction<ResponseFromServer<PublicClass[]>>) => {
                state.listClasses = action.payload.data || [];
            }
        );
    },
});

export const { } = adminClassSlice.actions;

export default adminClassSlice.reducer;

