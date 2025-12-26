import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    getCommissionApi,
    updateCommissionApi,
    type CommissionData,
    type UpdateCommissionParams,
} from "./adminCommissionApi";

const GET_COMMISSION = "GET_COMMISSION";
const UPDATE_COMMISSION = "UPDATE_COMMISSION";

export const getCommissionApiThunk = createAsyncThunk<
    CommissionData
>(GET_COMMISSION, async (_, { rejectWithValue }) => {
    try {
        const response = await getCommissionApi();
        // Backend trả về trực tiếp CommissionDto, không có ApiResponse wrapper
        return response.data || response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const updateCommissionApiThunk = createAsyncThunk<
    CommissionData,
    UpdateCommissionParams
>(UPDATE_COMMISSION, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateCommissionApi(payload);
        // Backend trả về trực tiếp CommissionDto, không có ApiResponse wrapper
        return response.data || response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

