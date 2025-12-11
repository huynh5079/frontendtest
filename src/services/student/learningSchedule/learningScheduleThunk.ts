import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    getAllLearingScheduleForStudentApi,
    getAllLearingScheduleWithOngoingClassForStudentApi,
    getAllLearingScheduleWithSpecificTutorForStudentApi,
    getAllOneOnOneTutorForStudentApi,
    getDetailScheduleLessonForStudentApi,
} from "./learningScheduleApi";
import type {
    DetailScheduleLessonForStudent,
    GetLearingScheduleForStudentParams,
    learningScheduleForStudent,
    OneOnOneTutorForStudent,
} from "../../../types/student";

const GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT =
    "GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT";
const GET_ALL_LEARNING_SCHEDULE_WITH_SPECIFIC_TUTOR_FOR_STUDENT =
    "GET_ALL_LEARNING_SCHEDULE_WITH_SPECIFIC_TUTOR_FOR_STUDENT";
const GET_ALL_LEARNING_SCHEDULE_WITH_ONGOING_CLASS_FOR_STUDENT =
    "GET_ALL_LEARNING_SCHEDULE_WITH_ONGOING_CLASS_FOR_STUDENT";
const GET_DETAIL_SCHEDULE_LESSON_FOR_STUDENT =
    "GET_DETAIL_SCHEDULE_LESSON_FOR_STUDENT";
const GET_ALL_ONE_ON_ONE_TUTOR_FOR_STUDENT =
    "GET_ALL_ONE_ON_ONE_TUTOR_FOR_STUDENT";

export const getAllLearingScheduleForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<learningScheduleForStudent[]>,
    GetLearingScheduleForStudentParams
>(
    GET_ALL_LEARNING_SCHEDULE_FOR_STUDENT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllLearingScheduleForStudentApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllLearingScheduleWithSpecificTutorForStudentApiThunk =
    createAsyncThunk<
        ResponseFromServer<learningScheduleForStudent[]>,
        { tutorId: string; params: GetLearingScheduleForStudentParams }
    >(
        GET_ALL_LEARNING_SCHEDULE_WITH_SPECIFIC_TUTOR_FOR_STUDENT,
        async (payload, { rejectWithValue }) => {
            try {
                const response =
                    await getAllLearingScheduleWithSpecificTutorForStudentApi(
                        payload.tutorId,
                        payload.params,
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

export const getAllLearingScheduleWithOngoingClassForStudentApiThunk =
    createAsyncThunk<
        ResponseFromServer<learningScheduleForStudent[]>,
        { classId: string; params: GetLearingScheduleForStudentParams }
    >(
        GET_ALL_LEARNING_SCHEDULE_WITH_ONGOING_CLASS_FOR_STUDENT,
        async (payload, { rejectWithValue }) => {
            try {
                const response =
                    await getAllLearingScheduleWithOngoingClassForStudentApi(
                        payload.classId,
                        payload.params,
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

export const getDetailScheduleLessonForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<DetailScheduleLessonForStudent>,
    string
>(GET_DETAIL_SCHEDULE_LESSON_FOR_STUDENT, async (id, { rejectWithValue }) => {
    try {
        const response = await getDetailScheduleLessonForStudentApi(id);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
})

export const getAllOneOnOneTutorForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<OneOnOneTutorForStudent[]>
>(GET_ALL_ONE_ON_ONE_TUTOR_FOR_STUDENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllOneOnOneTutorForStudentApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
