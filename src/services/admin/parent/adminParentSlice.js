import { createSlice } from "@reduxjs/toolkit";
import { getAllParentForAdminApiThunk, getDetailParentForAdminApiThunk, } from "./adminParentThunk";
const initialState = {
    listParents: [],
    parent: null,
};
export const parentForAdminSlice = createSlice({
    name: "parentForAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllParentForAdminApiThunk.fulfilled, (state, action) => {
            state.listParents = action.payload.data;
        })
            .addCase(getDetailParentForAdminApiThunk.fulfilled, (state, action) => {
            state.parent = action.payload.data;
        });
    },
});
export const {} = parentForAdminSlice.actions;
export default parentForAdminSlice.reducer;
