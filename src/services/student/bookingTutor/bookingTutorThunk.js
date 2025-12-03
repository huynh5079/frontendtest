import { createAsyncThunk } from "@reduxjs/toolkit";
import { cancelClassRequestForStudentApi, createClassRequestForStudentApi, getAllClassRequestForStudentApi, getDetailClassRequestForStudentApi, updateInfoClassRequestForStudentApi, UpdateScheduleClassRequestForStudentApi, } from "./bookingTutorApi";
const CREATE_CLASS_REQUEST_FOR_STUDENT = "CREATE_CLASS_REQUEST_FOR_STUDENT";
const GET_ALL_CLASS_REQUEST_FOR_STUDENT = "GET_ALL_CLASS_REQUEST_FOR_STUDENT";
const GET_DETAIL_CLASS_REQUEST_FOR_STUDENT = "GET_DETAIL_CLASS_REQUEST_FOR_STUDENT";
const UPDATE_INFO_CLASS_REQUEST_FOR_STUDENT = "UPDATE_INFO_CLASS_REQUEST_FOR_STUDENT";
const UPDATE_SCHEDULE_CLASS_REQUEST_FOR_STUDENT = "UPDATE_SCHEDULE_CLASS_REQUEST_FOR_STUDENT";
const CANCEL_CLASS_REQUEST_FOR_STUDENT = "CANCEL_CLASS_REQUEST_FOR_STUDENT";
export const createClassRequestForStudentApiThunk = createAsyncThunk(CREATE_CLASS_REQUEST_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await createClassRequestForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getAllClassRequestForStudentApiThunk = createAsyncThunk(GET_ALL_CLASS_REQUEST_FOR_STUDENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllClassRequestForStudentApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getDetailClassRequestForStudentApiThunk = createAsyncThunk(GET_DETAIL_CLASS_REQUEST_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailClassRequestForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const updateInfoClassRequestForStudentApiThunk = createAsyncThunk(UPDATE_INFO_CLASS_REQUEST_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateInfoClassRequestForStudentApi(payload.classRequestId, payload.params);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const updateScheduleClassRequestForStudentApiThunk = createAsyncThunk(UPDATE_SCHEDULE_CLASS_REQUEST_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await UpdateScheduleClassRequestForStudentApi(payload.classRequestId, payload.params);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const cancelClassRequestForStudentApiThunk = createAsyncThunk(CANCEL_CLASS_REQUEST_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await cancelClassRequestForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
