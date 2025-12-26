import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    AttendanceState,
    LessonAttendanceDetailForTutor,
    StudentAttendance,
    StudentAttendanceDetailForTutor,
    TutorAttendanceOverview,
} from "../../types/attendance";
import {
    getAttendanceForParentApiThunk,
    getAttendanceForStudentApiThunk,
    getAttendanceOverviewForTutorApiThunk,
    getLessonAttendanceDetailForTutorApiThunk,
    getStudentAttendanceDetailForTutorApiThunk,
} from "./attendanceThunk";
import { ResponseFromServer } from "../../types/app";

const initialState: AttendanceState = {
    studentAttendances: null,
    parentAttendances: null,
    tutorAttendanceOverview: null,
    studentAttendanceDetailForTutor: null,
    lessonAttendanceDetailForTutor: null,
};

export const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAttendanceForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<StudentAttendance>
                    >,
                ) => {
                    state.studentAttendances = action.payload.data;
                },
            )
            .addCase(
                getAttendanceForParentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<StudentAttendance>
                    >,
                ) => {
                    state.parentAttendances = action.payload.data;
                },
            )
            .addCase(
                getAttendanceOverviewForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<TutorAttendanceOverview>
                    >,
                ) => {
                    state.tutorAttendanceOverview = action.payload.data;
                },
            )
            .addCase(
                getStudentAttendanceDetailForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<StudentAttendanceDetailForTutor>
                    >,
                ) => {
                    state.studentAttendanceDetailForTutor = action.payload.data;
                },
            )
            .addCase(
                getLessonAttendanceDetailForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<LessonAttendanceDetailForTutor>
                    >,
                ) => {
                    state.lessonAttendanceDetailForTutor = action.payload.data;
                },
            );
    },
});

export const {} = attendanceSlice.actions;

export default attendanceSlice.reducer;
