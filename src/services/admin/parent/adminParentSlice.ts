import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type {
    ParentForAdmin,
    ParentForAdminState,
    ParentsForAdmin,
    ResponseGetUsersForAdmin,
} from "../../../types/admin";
import {
    getAllParentForAdminApiThunk,
    getDetailParentForAdminApiThunk,
} from "./adminParentThunk";

const initialState: ParentForAdminState = {
    listParents: [],
    parent: null,
};

export const parentForAdminSlice = createSlice({
    name: "parentForAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllParentForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ResponseGetUsersForAdmin<ParentsForAdmin[]>>>
                ) => {
                    state.listParents = action.payload.data.items;
                }
            )
            .addCase(
                getDetailParentForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ParentForAdmin>>
                ) => {
                    state.parent = action.payload.data;
                }
            );
    },
});

export const {} = parentForAdminSlice.actions;

export default parentForAdminSlice.reducer;
