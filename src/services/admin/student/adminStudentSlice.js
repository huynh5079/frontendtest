import { createSlice } from "@reduxjs/toolkit";
import { getAllStudentForAdminApiThunk, getDetailStudentForAdminApiThunk, } from "./adminStudentThunk";
const initialState = {
    listStudents: [],
    student: null,
};
export const studentForAdminSlice = createSlice({
    name: "studentForAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllStudentForAdminApiThunk.fulfilled, (state, action) => {
            state.listStudents = action.payload.data;
        })
            .addCase(getDetailStudentForAdminApiThunk.fulfilled, (state, action) => {
            state.student = action.payload.data;
        });
    },
});
export const {} = studentForAdminSlice.actions;
export default studentForAdminSlice.reducer;
