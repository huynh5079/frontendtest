import { createSlice } from "@reduxjs/toolkit";
import { getAllClassApiThunk, getAllStudentEnrolledClassForTutorApiThunk, getDetailClassApiThunk, } from "./classThunk";
const initialState = {
    list: [],
    detail: null,
    listStudentEnrolled: [],
};
export const tutorClassSlice = createSlice({
    name: "tutorClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllClassApiThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
        })
            .addCase(getDetailClassApiThunk.fulfilled, (state, action) => {
            state.detail = action.payload.data;
        })
            .addCase(getAllStudentEnrolledClassForTutorApiThunk.fulfilled, (state, action) => {
            state.listStudentEnrolled = action.payload.data;
        });
    },
});
export const {} = tutorClassSlice.actions;
export default tutorClassSlice.reducer;
