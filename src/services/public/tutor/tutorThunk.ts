import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    publicGet3TutorsApi,
    publicGetAllTutorsApi,
    publicGetDetailTutorApi,
    publicGetTutorClassesApi,
} from "./tutorApi";
import type { ResponseFromServer } from "../../../types/app";
import type {
    PublicTutor,
    PublicTutors,
    ResponsePublicTutors,
} from "../../../types/tutor";
import { PublicClass } from "../../../types/public";

const PUBLIC_GET_ALL_TUTORS = "PUBLIC_GET_ALL_TUTORS";
const PUBLIC_GET_3_TUTORS = "PUBLIC_GET_3_TUTORS";
const PUBLIC_GET_DETAIL_TUTOR = "PUBLIC_GET_DETAIL_TUTOR";
const PUBLIC_GET_TUTOR_CLASSES = "PUBLIC_GET_TUTOR_CLASSES";

export const publicGetAllTutorsApiThunk = createAsyncThunk<
    ResponseFromServer<ResponsePublicTutors<PublicTutors[]>>,
    number
>(PUBLIC_GET_ALL_TUTORS, async (payload, { rejectWithValue }) => {
    try {
        const response = await publicGetAllTutorsApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const publicGet3TutorsApiThunk = createAsyncThunk<
    ResponseFromServer<PublicTutors[]>
>(PUBLIC_GET_3_TUTORS, async (_, { rejectWithValue }) => {
    try {
        const response = await publicGet3TutorsApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const publicGetDetailTutorApiThunk = createAsyncThunk<
    ResponseFromServer<PublicTutor>,
    string
>(PUBLIC_GET_DETAIL_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await publicGetDetailTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const publicGetTutorClassesApiThunk = createAsyncThunk<
    ResponseFromServer<PublicClass[]>,
    string
>(PUBLIC_GET_TUTOR_CLASSES, async (payload, { rejectWithValue }) => {
    try {
        const response = await publicGetTutorClassesApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
