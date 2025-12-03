import { createSlice } from "@reduxjs/toolkit";
import { getProfileParentApiThunk, getProfileStudentApiThunk, getProfileTutorApiThunk, } from "./userThunk";
const initialState = {
    tutorProfile: null,
    parentProfile: null,
    studentProfile: null,
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfileTutorApiThunk.fulfilled, (state, action) => {
            state.tutorProfile = action.payload.data;
        })
            .addCase(getProfileParentApiThunk.fulfilled, (state, action) => {
            state.parentProfile = action.payload.data;
        })
            .addCase(getProfileStudentApiThunk.fulfilled, (state, action) => {
            state.studentProfile = action.payload.data;
        });
    },
});
export const {} = userSlice.actions;
export default userSlice.reducer;
