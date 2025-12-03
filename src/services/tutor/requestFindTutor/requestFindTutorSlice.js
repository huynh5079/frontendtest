import { createSlice } from "@reduxjs/toolkit";
import { getAllRequestFindTutorForTutorApiThunk, getApplyRequestFindTutorForTutorApiThunk, getDetailRequestFindTutorForTutorApiThunk, } from "./requestFindTutorThunk";
const initialState = {
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
            .addCase(getAllRequestFindTutorForTutorApiThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
        })
            .addCase(getDetailRequestFindTutorForTutorApiThunk.fulfilled, (state, action) => {
            state.detail = action.payload;
        })
            .addCase(getApplyRequestFindTutorForTutorApiThunk.fulfilled, (state, action) => {
            state.listApply = action.payload.data;
        });
    },
});
export const {} = requestFindTutorForTutorSlice.actions;
export default requestFindTutorForTutorSlice.reducer;
