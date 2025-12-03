import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicGetAllTutorsApi, publicGetDetailTutorApi } from "./tutorApi";
const PUBLIC_GET_ALL_TUTORS = "PUBLIC_GET_ALL_TUTORS";
const PUBLIC_GET_DETAIL_TUTOR = "PUBLIC_GET_DETAIL_TUTOR";
export const publicGetAllTutorsApiThunk = createAsyncThunk(PUBLIC_GET_ALL_TUTORS, async (payload, { rejectWithValue }) => {
    try {
        const response = await publicGetAllTutorsApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const publicGetDetailTutorApiThunk = createAsyncThunk(PUBLIC_GET_DETAIL_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await publicGetDetailTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
