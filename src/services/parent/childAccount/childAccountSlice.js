import { createSlice } from "@reduxjs/toolkit";
import { getAllChildAccountApiThunk, getDetailChildAccountApiThunk, } from "./childAccountThunk";
const initialState = {
    listChildAccounts: [],
    detailChildAccount: null,
};
export const childAccountSlice = createSlice({
    name: "childAccount",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllChildAccountApiThunk.fulfilled, (state, action) => {
            state.listChildAccounts = action.payload.data;
        })
            .addCase(getDetailChildAccountApiThunk.fulfilled, (state, action) => {
            state.detailChildAccount = action.payload.data;
        });
    },
});
export const {} = childAccountSlice.actions;
export default childAccountSlice.reducer;
