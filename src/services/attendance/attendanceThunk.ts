import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseFromServer } from "../../types/app";
import {
    LessonAttendanceDetailForTutor,
    StudentAttendance,
    StudentAttendanceDetailForTutor,
    TutorAttendanceOverview,
} from "../../types/attendance";
import {
    getAttendanceForParentApi,
    getAttendanceForStudentApi,
    getAttendanceOverviewForTutorApi,
    getLessonAttendanceDetailForTutorApi,
    getStudentAttendanceDetailForTutorApi,
} from "./attendanceApi";

const GET_ATTENDANCE_FOR_STUDENT = "GET_ATTENDANCE_FOR_STUDENT";
const GET_ATTENDANCE_FOR_PARENT = "GET_ATTENDANCE_FOR_PARENT";
const GET_ATTENDANCE_OVERVIEW_FOR_TUTOR = "GET_ATTENDANCE_OVERVIEW_FOR_TUTOR";
const GET_STUDENT_ATTENDANCE_DETAIL_FOR_TUTOR =
    "GET_STUDENT_ATTENDANCE_DETAIL_FOR_TUTOR";
const GET_LESSON_ATTENDANCE_DETAIL_FOR_TUTOR =
    "GET_LESSON_ATTENDANCE_DETAIL_FOR_TUTOR";

export const getAttendanceForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<StudentAttendance>,
    string
>(GET_ATTENDANCE_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAttendanceForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAttendanceForParentApiThunk = createAsyncThunk<
    ResponseFromServer<StudentAttendance>,
    { classId: string; studentId: string }
>(GET_ATTENDANCE_FOR_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAttendanceForParentApi(
            payload.classId,
            payload.studentId,
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAttendanceOverviewForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<TutorAttendanceOverview>,
    string
>(GET_ATTENDANCE_OVERVIEW_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAttendanceOverviewForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getStudentAttendanceDetailForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<StudentAttendanceDetailForTutor>,
    { classId: string; studentId: string }
>(
    GET_STUDENT_ATTENDANCE_DETAIL_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getStudentAttendanceDetailForTutorApi(
                payload.classId,
                payload.studentId,
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getLessonAttendanceDetailForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<LessonAttendanceDetailForTutor>,
    string
>(
    GET_LESSON_ATTENDANCE_DETAIL_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getLessonAttendanceDetailForTutorApi(
                payload,
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);
