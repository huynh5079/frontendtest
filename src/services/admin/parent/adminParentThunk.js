import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllParentForAdminApi, getDetailParentForAdminApi } from "./adminParentApi";
const GET_ALL_PARENT_FOR_ADMIN = "GET_ALL_PARENT_FOR_ADMIN";
const GET_DETAIL_PARENT_FOR_ADMIN = "GET_DETAIL_PARENT_FOR_ADMIN";
export const getAllParentForAdminApiThunk = createAsyncThunk(GET_ALL_PARENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllParentForAdminApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getDetailParentForAdminApiThunk = createAsyncThunk(GET_DETAIL_PARENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailParentForAdminApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
