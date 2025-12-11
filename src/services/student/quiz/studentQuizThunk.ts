import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseFromServer } from "../../../types/app";
import {
    GetAllQuizForStudent,
    GetDetailQuizForStudent,
    StudentQuizResult,
    SubmitQuizForStudentParams,
} from "../../../types/student";
import {
    doQuizForStudentApi,
    getAllHistorySubmitQuizForStudentApi,
    getAllQuizForStudentApi,
    submitQuizForStudentApi,
} from "./studentQuizApi";

const GET_ALL_QUIZ_FOR_STUDENT = "GET_ALL_QUIZ_FOR_STUDENT";
const GET_ALL_HISTORY_SUBMIT_QUIZ_FOR_STUDENT =
    "GET_ALL_HISTORY_SUBMIT_QUIZ_FOR_STUDENT";
const DO_QUIZ_FOR_STUDENT = "DO_QUIZ_FOR_STUDENT";
const SUBMIT_QUIZ_FOR_STUDENT = "SUBMIT_QUIZ_FOR_STUDENT";

export const getAllQuizForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<GetAllQuizForStudent[]>,
    string
>(GET_ALL_QUIZ_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllQuizForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getAllHistorySubmitQuizForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<StudentQuizResult[]>,
    string
>(
    GET_ALL_HISTORY_SUBMIT_QUIZ_FOR_STUDENT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllHistorySubmitQuizForStudentApi(
                payload,
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response?.data,
            });
        }
    },
);

export const doQuizForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<GetDetailQuizForStudent>,
    string
>(DO_QUIZ_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await doQuizForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const submitQuizForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<StudentQuizResult>,
    SubmitQuizForStudentParams
>(SUBMIT_QUIZ_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await submitQuizForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});
