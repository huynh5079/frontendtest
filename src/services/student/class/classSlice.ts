import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type {
    AssignedClassForStudent,
    CheckAssignClassResponse,
    StudentClassState,
} from "../../../types/student";
import {
    checkAssignClassForStudentApiThunk,
    getAllAssignedClassForStudentApiThunk,
} from "./classThunk";

const initialState: StudentClassState = {
    isEnrolled: false,
    assignedClasses: null,
};

export const studentClassSlice = createSlice({
    name: "studentClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                checkAssignClassForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<CheckAssignClassResponse>
                    >,
                ) => {
                    state.isEnrolled = action.payload.data.isEnrolled;
                },
            )
            .addCase(
                getAllAssignedClassForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<AssignedClassForStudent[]>
                    >,
                ) => {
                    state.assignedClasses = action.payload.data;
                },
            );
    },
});

export const {} = studentClassSlice.actions;

export default studentClassSlice.reducer;
