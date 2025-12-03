import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
    ApplyrequestFindTutorForTutor,
    ApplyrequestFindTutorForTutorParams,
    RequestFindTutorForTutor,
    ResponseGetRequestFindTutorForTutor,
} from "../../../types/tutor";
import {
    applyRequestFindTutorForTutorApi,
    getAllRequestFindTutorForTutorApi,
    getApplyRequestFindTutorForTutorApi,
    getDetailRequestFindTutorForTutorApi,
    withdrawApplyRequestFindTutorForTutorApi,
} from "./requestFindTutorApi";
import type { ResponseFromServer } from "../../../types/app";

const GET_ALL_REQUEST_FIND_TUTOR_FOR_TUTOR =
    "GET_ALL_REQUEST_FIND_TUTOR_FOR_TUTOR";

const GET_DETAIL_REQUEST_FIND_TUTOR_FOR_TUTOR =
    "GET_DETAIL_REQUEST_FIND_TUTOR_FOR_TUTOR";

const APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR = "APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR";

const GET_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR =
    "GET_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR";

const WITHDRAW_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR =
    "WITHDRAW_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR";

export const getAllRequestFindTutorForTutorApiThunk = createAsyncThunk<
    ResponseGetRequestFindTutorForTutor<RequestFindTutorForTutor[]>
>(GET_ALL_REQUEST_FIND_TUTOR_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllRequestFindTutorForTutorApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailRequestFindTutorForTutorApiThunk = createAsyncThunk<
    RequestFindTutorForTutor,
    string
>(
    GET_DETAIL_REQUEST_FIND_TUTOR_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getDetailRequestFindTutorForTutorApi(
                payload,
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const applyRequestFindTutorForTutorApiThunk = createAsyncThunk<
    {},
    ApplyrequestFindTutorForTutorParams
>(APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await applyRequestFindTutorForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getApplyRequestFindTutorForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<ApplyrequestFindTutorForTutor[]>
>(GET_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getApplyRequestFindTutorForTutorApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const withdrawApplyRequestFindTutorForTutorApiThunk = createAsyncThunk<
    {},
    string
>(
    WITHDRAW_APPLY_REQUEST_FIND_TUTOR_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await withdrawApplyRequestFindTutorForTutorApi(
                payload,
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);
