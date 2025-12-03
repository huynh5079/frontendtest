import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicGetAllTutorsApi, publicGetDetailTutorApi } from "./tutorApi";
import type { ResponseFromServer } from "../../../types/app";
import type {
    PublicTutor,
    PublicTutors,
    ResponsePublicTutors,
} from "../../../types/tutor";

const PUBLIC_GET_ALL_TUTORS = "PUBLIC_GET_ALL_TUTORS";
const PUBLIC_GET_DETAIL_TUTOR = "PUBLIC_GET_DETAIL_TUTOR";

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
