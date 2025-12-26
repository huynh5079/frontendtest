import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type {
    ResponseGetUsersForAdmin,
    StudentForAdmin,
    StudentForAdminState,
    StudentsForAdmin,
} from "../../../types/admin";
import {
    getAllStudentForAdminApiThunk,
    getDetailStudentForAdminApiThunk,
} from "./adminStudentThunk";

const initialState: StudentForAdminState = {
    listStudents: [],
    student: null,
};

export const studentForAdminSlice = createSlice({
    name: "studentForAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllStudentForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<ResponseGetUsersForAdmin<StudentsForAdmin[]>>
                    >
                ) => {
                    state.listStudents = action.payload.data.items;
                }
            )
            .addCase(
                getDetailStudentForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<StudentForAdmin>>
                ) => {
                    state.student = action.payload.data;
                }
            );
    },
});

export const {} = studentForAdminSlice.actions;

export default studentForAdminSlice.reducer;
