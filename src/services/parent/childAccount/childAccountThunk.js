import { createChildAccountApi, getAllChildAccountApi, getDetailChildAccountApi, } from "./childAccountApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
const CREATE_CHILD_ACCOUNT = "CREATE_CHILD_ACCOUNT";
const GET_ALL_CHILD_ACCOUNT = "GET_ALL_CHILD_ACCOUNT";
const GET_DETAIL_CHILD_ACCOUNT = "GET_DETAIL_CHILD_ACCOUNT";
export const createChildAccountApiThunk = createAsyncThunk(CREATE_CHILD_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await createChildAccountApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getAllChildAccountApiThunk = createAsyncThunk(GET_ALL_CHILD_ACCOUNT, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllChildAccountApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getDetailChildAccountApiThunk = createAsyncThunk(GET_DETAIL_CHILD_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailChildAccountApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
