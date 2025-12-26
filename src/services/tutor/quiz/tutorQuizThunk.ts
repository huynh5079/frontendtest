import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    GetAllQuizForTutor,
    GetDetailQuizForTutor,
} from "../../../types/tutor";
import {
    createQuizForTutorApi,
    getAllQuizForTutorApi,
    getDetailQuizForTutorApi,
    updateQuizQuestionForTutorApi,
} from "./tutorQuizApi";
import { ResponseFromServer } from "../../../types/app";

const CREATE_QUIZ_FOR_TUTOR = "CREATE_QUIZ_FOR_TUTOR";
const UPDATE_QUIZ_QUESTION_FOR_TUTOR = "UPDATE_QUIZ_QUESTION_FOR_TUTOR";
const GET_ALL_QUIZ_FOR_TUTOR = "GET_ALL_QUIZ_FOR_TUTOR";
const GET_DETAIL_QUIZ_FOR_TUTOR = "GET_DETAIL_QUIZ_FOR_TUTOR";

export const createQuizForTutorApiThunk = createAsyncThunk<{}, FormData>(
    CREATE_QUIZ_FOR_TUTOR,
    async (formData, { rejectWithValue }) => {
        try {
            const response = await createQuizForTutorApi(formData);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response?.data,
            });
        }
    }
);

export const updateQuizQuestionForTutorApiThunk = createAsyncThunk<
    {},
    { questionId: string; params: FormData }
>(UPDATE_QUIZ_QUESTION_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateQuizQuestionForTutorApi(
            payload.questionId,
            payload.params
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getAllQuizForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<GetAllQuizForTutor[]>,
    string
>(GET_ALL_QUIZ_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllQuizForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getDetailQuizForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<GetDetailQuizForTutor>,
    string
>(GET_DETAIL_QUIZ_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailQuizForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});
