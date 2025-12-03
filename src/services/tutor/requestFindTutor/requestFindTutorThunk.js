import { createAsyncThunk } from "@reduxjs/toolkit";
import { applyRequestFindTutorForTutorApi, getAllRequestFindTutorForTutorApi, getApplyRequestFindTutorForTutorApi, getDetailRequestFindTutorForTutorApi, withdrawApplyRequestFindTutorForTutorApi, } from "./requestFindTutorApi";
const GET_ALL_REQUEST_FIND_TUTOR_FOR_TUTOR = "GET_ALL_REQUEST_FIND_TUTOR_FOR_TUTOR";
const GET_DETAIL_REQUEST_FIND_TUTOR_FOR_TUTOR = "GET_DETAIL_REQUEST_FIND_TUTOR_FOR_TUTOR";
const APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR = "APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR";
const GET_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR = "GET_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR";
const WITHDRAW_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR = "WITHDRAW_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR";
export const getAllRequestFindTutorForTutorApiThunk = createAsyncThunk(GET_ALL_REQUEST_FIND_TUTOR_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllRequestFindTutorForTutorApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getDetailRequestFindTutorForTutorApiThunk = createAsyncThunk(GET_DETAIL_REQUEST_FIND_TUTOR_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailRequestFindTutorForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const applyRequestFindTutorForTutorApiThunk = createAsyncThunk(APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await applyRequestFindTutorForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getApplyRequestFindTutorForTutorApiThunk = createAsyncThunk(GET_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getApplyRequestFindTutorForTutorApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const withdrawApplyRequestFindTutorForTutorApiThunk = createAsyncThunk(WITHDRAW_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await withdrawApplyRequestFindTutorForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
