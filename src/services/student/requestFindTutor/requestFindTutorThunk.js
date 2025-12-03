import { createAsyncThunk } from "@reduxjs/toolkit";
import { acceptApplyRequestFindTutorForStudentApi, getAllApplyRequestFindTutorForStudentApi, rejectApplyRequestFindTutorForStudentApi, } from "./requestFindTutorApi";
const GET_ALL_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT = "GET_ALL_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT";
const ACCEPT_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT = "ACCEPT_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT";
const REJECT_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT = "REJECT_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT";
export const getAllApplyRequestFindTutorForStudentApiThunk = createAsyncThunk(GET_ALL_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllApplyRequestFindTutorForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const acceptApplyRequestFindTutorForStudentApiThunk = createAsyncThunk(ACCEPT_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await acceptApplyRequestFindTutorForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const rejectApplyRequestFindTutorForStudentApiThunk = createAsyncThunk(REJECT_APPLY_REQUEST_FIND_TUTOR_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectApplyRequestFindTutorForStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
