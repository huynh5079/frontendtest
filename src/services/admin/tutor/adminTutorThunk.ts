import type {
    ProvideTutor,
    RejectTutor,
    ResponseGetUsersForAdmin,
    TutorForAdmin,
    TutorsForAdmin,
} from "../../../types/admin";
import type { ResponseFromServer } from "../../../types/app";
import {
    acceptTutorApi,
    getAllTutorForAdminApi,
    getDetailTutorForAdminApi,
    providetutorApi,
    rejectTutorApi,
} from "./adminTutorApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const GET_ALL_TUTOR_FOR_ADMIN = "GET_ALL_TUTOR_FOR_ADMIN";
const GET_DETAIL_TUTOR_FOR_ADMIN = "GET_DETAIL_TUTOR_FOR_ADMIN";
const ACCPEPT_TUTOR = "ACCPEPT_TUTOR";
const REJECT_TUTOR = "REJECT_TUTOR";
const PROVIDE_TUTOR = "PROVIDE_TUTOR";

export const getAllTutorForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<ResponseGetUsersForAdmin<TutorsForAdmin[]>>,
    number
>(GET_ALL_TUTOR_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllTutorForAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailTutorForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<TutorForAdmin>,
    string
>(GET_DETAIL_TUTOR_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailTutorForAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const acceptTutorApiThunk = createAsyncThunk<
    ResponseFromServer<TutorForAdmin>,
    string
>(ACCPEPT_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await acceptTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const rejectTutorApiThunk = createAsyncThunk<
    ResponseFromServer<TutorForAdmin>,
    { tutorId: string; params: RejectTutor }
>(REJECT_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectTutorApi(payload.tutorId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const provideTutorApiThunk = createAsyncThunk<
    ResponseFromServer<TutorForAdmin>,
    { tutorId: string; params: ProvideTutor }
>(PROVIDE_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await providetutorApi(payload.tutorId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
