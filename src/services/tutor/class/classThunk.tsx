import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
    CreateClassParams,
    StudentEnrolledClassForTutor,
    TutorClass,
    UpdateInfoClassForTutorParams,
    UpdateScheduleClassForTutorParmas,
} from "../../../types/tutor";
import {
    cancelClassForTutorApi,
    completeClassForTutorApi,
    createClassApi,
    deleteClassForTutorApi,
    getAllClassApi,
    getAllStudentEnrolledClassForTutorApi,
    getDetailClassApi,
    syncLessonStatusForClassApi,
    updateInfoClassForTutorApi,
    UpdateScheduleClassForTutorApi,
} from "./classApi";
import type { ResponseFromServer } from "../../../types/app";

const CREATE_CLASS = "CREATE_CLASS";
const GET_ALL_CLASS = "GET_ALL_CLASS";
const GET_DETAIL_CLASS = "GET_DETAIL_CLASS";
const GET_ALL_STUDENT_ENROLLED_CLASS_FOR_TUTOR =
    "GET_ALL_STUDENT_ENROLLED_CLASS_FOR_TUTOR";
const UPDATE_INFO_CLASS_FOR_TUTOR = "UPDATE_INFO_CLASS_FOR_TUTOR";
const UPDATE_SCHEDULE_CLASS_FOR_TUTOR = "UPDATE_SCHEDULE_CLASS_FOR_TUTOR";
const DELETE_CLASS_FOR_TUTOR = "DELETE_CLASS_FOR_TUTOR";
const CANCEL_CLASS_FOR_TUTOR = "CANCEL_CLASS_FOR_TUTOR";
const COMPLETE_CLASS_FOR_TUTOR = "COMPLETE_CLASS_FOR_TUTOR";
const SYNC_LESSON_STATUS_FOR_CLASS = "SYNC_LESSON_STATUS_FOR_CLASS";

export const createClassApiThunk = createAsyncThunk<{}, CreateClassParams>(
    CREATE_CLASS,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createClassApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllClassApiThunk = createAsyncThunk<
    ResponseFromServer<TutorClass[]>
>(GET_ALL_CLASS, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllClassApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailClassApiThunk = createAsyncThunk<
    ResponseFromServer<TutorClass>,
    string
>(GET_DETAIL_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailClassApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllStudentEnrolledClassForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<StudentEnrolledClassForTutor[]>,
    string
>(
    GET_ALL_STUDENT_ENROLLED_CLASS_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllStudentEnrolledClassForTutorApi(
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

export const updateInfoClassForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { classId: string; params: UpdateInfoClassForTutorParams }
>(UPDATE_INFO_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateInfoClassForTutorApi(
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
});

export const updateScheduleClassForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { classId: string; params: UpdateScheduleClassForTutorParmas }
>(UPDATE_SCHEDULE_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await UpdateScheduleClassForTutorApi(
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
});

export const deleteClassForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(DELETE_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await deleteClassForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const cancelClassForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<any>,
    { classId: string; reason?: string }
>(CANCEL_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await cancelClassForTutorApi(payload.classId, {
            reason: payload.reason,
        });
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const completeClassForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(COMPLETE_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await completeClassForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const syncLessonStatusForClassApiThunk = createAsyncThunk<
    ResponseFromServer<{ completedLessons: number }>,
    string
>(SYNC_LESSON_STATUS_FOR_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await syncLessonStatusForClassApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});
