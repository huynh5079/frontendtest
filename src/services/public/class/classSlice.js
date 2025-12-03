import { createSlice } from "@reduxjs/toolkit";
import { publicGetAllClassesApiThunk, publicGetDetailClassApiThunk, } from "./classthunk";
const initialState = {
    list: [],
    detail: null,
};
export const publicClassSlice = createSlice({
    name: "publicClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(publicGetAllClassesApiThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
        })
            .addCase(publicGetDetailClassApiThunk.fulfilled, (state, action) => {
            state.detail = action.payload.data;
        });
    },
});
export const {} = publicClassSlice.actions;
export default publicClassSlice.reducer;
