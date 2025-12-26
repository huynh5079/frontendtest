import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    CreateRescheduleParams,
    GetAllReschedule,
} from "../../types/reschedule";
import {
    acceptRescheduleApi,
    createRescheduleForStudentApi,
    createRescheduleForTutorApi,
    getAllRescheduleApi,
    rejectRescheduleApi,
} from "./rescheduleApi";
import { ResponseFromServer } from "../../types/app";

const CREATE_RESCHEDULE_FOR_STUDENT = "CREATE_RESCHEDULE_FOR_STUDENT";
const CREATE_RESCHEDULE_FOR_TUTOR = "CREATE_RESCHEDULE_FOR_TUTOR";
const GET_ALL_RESCHEDULE = "GET_ALL_RESCHEDULE";
const ACCEPT_RESCHEDULE = "ACCEPT_RESCHEDULE";
const REJECT_RESCHEDULE = "REJECT_RESCHEDULE";

export const createRescheduleForStudentApiThunk = createAsyncThunk<
    {},
    { lessonId: string; params: CreateRescheduleParams }
>(CREATE_RESCHEDULE_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await createRescheduleForStudentApi(
            payload.lessonId,
            payload.params
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const createRescheduleForTutorApiThunk = createAsyncThunk<
    {},
    { lessonId: string; params: CreateRescheduleParams }
>(CREATE_RESCHEDULE_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await createRescheduleForTutorApi(
            payload.lessonId,
            payload.params
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllRescheduleApiThunk = createAsyncThunk<
    ResponseFromServer<GetAllReschedule[]>
>(GET_ALL_RESCHEDULE, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllRescheduleApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const acceptRescheduleApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(ACCEPT_RESCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await acceptRescheduleApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const rejectRescheduleApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(REJECT_RESCHEDULE, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectRescheduleApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
