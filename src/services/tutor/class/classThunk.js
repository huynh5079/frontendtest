import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClassApi, deleteClassForTutorApi, getAllClassApi, getAllStudentEnrolledClassForTutorApi, getDetailClassApi, updateInfoClassForTutorApi, UpdateScheduleClassForTutorApi, } from "./classApi";
const CREATE_CLASS = "CREATE_CLASS";
const GET_ALL_CLASS = "GET_ALL_CLASS";
const GET_DETAIL_CLASS = "GET_DETAIL_CLASS";
const GET_ALL_STUDENT_ENROLLED_CLASS_FOR_TUTOR = "GET_ALL_STUDENT_ENROLLED_CLASS_FOR_TUTOR";
const UPDATE_INFO_CLASS_FOR_TUTOR = "UPDATE_INFO_CLASS_FOR_TUTOR";
const UPDATE_SCHEDULE_CLASS_FOR_TUTOR = "UPDATE_SCHEDULE_CLASS_FOR_TUTOR";
const DELETE_CLASS_FOR_TUTOR = "DELETE_CLASS_FOR_TUTOR";
export const createClassApiThunk = createAsyncThunk(CREATE_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await createClassApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getAllClassApiThunk = createAsyncThunk(GET_ALL_CLASS, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllClassApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getDetailClassApiThunk = createAsyncThunk(GET_DETAIL_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailClassApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getAllStudentEnrolledClassForTutorApiThunk = createAsyncThunk(GET_ALL_STUDENT_ENROLLED_CLASS_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllStudentEnrolledClassForTutorApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const updateInfoClassForTutorApiThunk = createAsyncThunk(UPDATE_INFO_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateInfoClassForTutorApi(payload.classId, payload.params);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const updateScheduleClassForTutorApiThunk = createAsyncThunk(UPDATE_SCHEDULE_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await UpdateScheduleClassForTutorApi(payload.classId, payload.params);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const deleteClassForTutorApiThunk = createAsyncThunk(DELETE_CLASS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await deleteClassForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
