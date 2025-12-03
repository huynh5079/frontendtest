import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileParentApi, getProfileStudentApi, getProfileTutorApi, updateProfileStudentApi, } from "./userApi";
const GET_PROFILE_TUTOR = "GET_PROFILE_TUTOR";
const GET_PROFILE_PARENT = "GET_PROFILE_PARENT";
const GET_PROFILE_STUDENT = "GET_PROFILE_STUDENT";
const UPDATE_PROFILE_STUDENT = "UPDATE_PROFILE_STUDENT";
export const getProfileTutorApiThunk = createAsyncThunk(GET_PROFILE_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getProfileTutorApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getProfileParentApiThunk = createAsyncThunk(GET_PROFILE_PARENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getProfileParentApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getProfileStudentApiThunk = createAsyncThunk(GET_PROFILE_STUDENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getProfileStudentApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const updateProfileStudentApiThunk = createAsyncThunk(UPDATE_PROFILE_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateProfileStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
