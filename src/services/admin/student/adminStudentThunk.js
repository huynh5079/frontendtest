import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudentForAdminApi, getDetailStudentForAdminApi } from "./adminStudentApi";
const GET_ALL_STUDENT_FOR_ADMIN = "GET_ALL_STUDENT_FOR_ADMIN";
const GET_DETAIL_STUDENT_FOR_ADMIN = "GET_DETAIL_STUDENT_FOR_ADMIN";
export const getAllStudentForAdminApiThunk = createAsyncThunk(GET_ALL_STUDENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllStudentForAdminApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getDetailStudentForAdminApiThunk = createAsyncThunk(GET_DETAIL_STUDENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailStudentForAdminApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
