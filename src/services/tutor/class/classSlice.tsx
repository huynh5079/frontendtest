import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    StudentEnrolledClassForTutor,
    TutorClass,
    TutorClassState,
} from "../../../types/tutor";
import {
    getAllClassApiThunk,
    getAllStudentEnrolledClassForTutorApiThunk,
    getDetailClassApiThunk,
} from "./classThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: TutorClassState = {
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
            .addCase(
                getAllClassApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorClass[]>>
                ) => {
                    state.list = action.payload.data;
                }
            )
            .addCase(
                getDetailClassApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorClass>>
                ) => {
                    state.detail = action.payload.data;
                }
            )
            .addCase(
                getAllStudentEnrolledClassForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<StudentEnrolledClassForTutor[]>
                    >
                ) => {
                    state.listStudentEnrolled = action.payload.data;
                }
            );
    },
});

export const {} = tutorClassSlice.actions;

export default tutorClassSlice.reducer;
