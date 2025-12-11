import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    markAttendance11ForTutorApi,
    markAttendanceManyStudentsForTutorApi,
} from "./tutorAttendanceApi";
import {
    MarkAttendance11Params,
    MarkAttendanceManyStudentsParams,
} from "../../../types/tutor";

const MARK_ATTENDANCE_11_FOR_TUTOR = "MARK_ATTENDANCE_11_FOR_TUTOR";
const MARK_ATTENDANCE_MANY_STUDENTS_FOR_TUTOR =
    "MARK_ATTENDANCE_MANY_STUDENTS_FOR_TUTOR";

export const markAttendance11ForTutorApiThunk = createAsyncThunk<
    {},
    MarkAttendance11Params
>(MARK_ATTENDANCE_11_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await markAttendance11ForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const markAttendanceManyStudentsForTutorApiThunk = createAsyncThunk<
    {},
    { lessonId: string; params: MarkAttendanceManyStudentsParams }
>(
    MARK_ATTENDANCE_MANY_STUDENTS_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await markAttendanceManyStudentsForTutorApi(
                payload.lessonId,
                payload.params
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);
