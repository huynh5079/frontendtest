import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllOneOnOneStudentForTutorApi,
    getAllScheduleForTutorApi,
    getAllStudyScheduleWithSpecificClassForTutorApi,
    getAllStudyScheduleWithSpecificStudentForTutorApi,
    getDetailScheduleLessonForTutorApi,
} from "./tutorScheduleApi";
import type {
    DetailScheduleLessonForTutor,
    GetScheduleForTutorParams,
    OneOnOneStudentForTutor,
    ScheduleForTutor,
} from "../../../types/tutor";
import type { ResponseFromServer } from "../../../types/app";

const GET_ALL_TUTOR_SCHEDULE = "GET_ALL_TUTOR_SCHEDULE";
const GET_ALL_ONE_ON_ONE_STUDENT_FOR_TUTOR =
    "GET_ALL_ONE_ON_ONE_STUDENT_FOR_TUTOR";
const GET_ALL_STUDY_SCHEDULE_WITH_SPECIFIC_STUDENT_FOR_TUTOR =
    "GET_ALL_STUDY_SCHEDULE_WITH_SPECIFIC_STUDENT_FOR_TUTOR";
const GET_ALL_STUDY_SCHEDULE_WITH_SPECIFIC_CLASS_FOR_TUTOR =
    "GET_ALL_STUDY_SCHEDULE_WITH_SPECIFIC_CLASS_FOR_TUTOR";
const GET_DETAIL_SCHEDULE_LESSON_FOR_TUTOR =
    "GET_DETAIL_SCHEDULE_LESSON_FOR_TUTOR";

export const getAllScheduleForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<ScheduleForTutor[]>,
    GetScheduleForTutorParams
>(GET_ALL_TUTOR_SCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllScheduleForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllStudyScheduleWithSpecificStudentForTutorApiThunk =
    createAsyncThunk<
        ResponseFromServer<ScheduleForTutor[]>,
        { studentId: string; params: GetScheduleForTutorParams }
    >(
        GET_ALL_STUDY_SCHEDULE_WITH_SPECIFIC_STUDENT_FOR_TUTOR,
        async (payload, { rejectWithValue }) => {
            try {
                const response =
                    await getAllStudyScheduleWithSpecificStudentForTutorApi(
                        payload.studentId,
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

export const getAllStudyScheduleWithSpecificClassForTutorApiThunk =
    createAsyncThunk<
        ResponseFromServer<ScheduleForTutor[]>,
        { classId: string; params: GetScheduleForTutorParams }
    >(
        GET_ALL_STUDY_SCHEDULE_WITH_SPECIFIC_CLASS_FOR_TUTOR,
        async (payload, { rejectWithValue }) => {
            try {
                const response =
                    await getAllStudyScheduleWithSpecificClassForTutorApi(
                        payload.classId,
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

export const getAllOneOnOneStudentForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<OneOnOneStudentForTutor[]>
>(GET_ALL_ONE_ON_ONE_STUDENT_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllOneOnOneStudentForTutorApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailScheduleLessonForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<DetailScheduleLessonForTutor>,
    string
>(GET_DETAIL_SCHEDULE_LESSON_FOR_TUTOR, async (id, { rejectWithValue }) => {
    try {
        const response = await getDetailScheduleLessonForTutorApi(id);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
