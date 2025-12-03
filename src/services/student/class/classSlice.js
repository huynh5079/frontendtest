import { createSlice } from "@reduxjs/toolkit";
import { checkAssignClassForStudentApiThunk, getAllAssignedClassForStudentApiThunk, } from "./classThunk";
const initialState = {
    isEnrolled: false,
    assignedClasses: null,
};
export const studentClassSlice = createSlice({
    name: "studentClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAssignClassForStudentApiThunk.fulfilled, (state, action) => {
            state.isEnrolled = action.payload.data.isEnrolled;
        })
            .addCase(getAllAssignedClassForStudentApiThunk.fulfilled, (state, action) => {
            state.assignedClasses = action.payload.data;
        });
    },
});
export const {} = studentClassSlice.actions;
export default studentClassSlice.reducer;
