import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAvailabilityBlockForTutorApi, deleteAvailabilityBlockForTutorApi, getAllAvailabilityBlockForTutorApi, } from "./tutorAvailabilityBlockApi";
const GET_ALL_AVAILABILITY_BLOCK_FOR_TUTOR = "GET_ALL_AVAILABILITY_BLOCK_FOR_TUTOR";
const CREATE_AVAILABILITY_BLOCK_FOR_TUTOR = "CREATE_AVAILABILITY_BLOCK_FOR_TUTOR";
const DELETE_AVAILABILITY_BLOCK_FOR_TUTOR = "DELETE_AVAILABILITY_BLOCK_FOR_TUTOR";
export const getAllAvailabilityBlockForTutorApiThunk = createAsyncThunk(GET_ALL_AVAILABILITY_BLOCK_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllAvailabilityBlockForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const createAvailabilityBlockForTutorApiThunk = createAsyncThunk(CREATE_AVAILABILITY_BLOCK_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await createAvailabilityBlockForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const deleteAvailabilityBlockForTutorApiThunk = createAsyncThunk(DELETE_AVAILABILITY_BLOCK_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await deleteAvailabilityBlockForTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
