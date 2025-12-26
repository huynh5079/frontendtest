import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getTutorMonthlyIncomeApi,
    getTutorMonthlyLessonsApi,
    getTutorTotalStatsApi,
} from "./tutorDashboardApi";
import { ResponseFromServer } from "../../../types/app";
import {
    TutorMonthlyIncome,
    TutorMonthlyLessons,
    TutorTotalStatistics,
} from "../../../types/tutor";

const GET_TUTOR_TOTAL_STATS = "GET_TUTOR_TOTAL_STATS";
const GET_TUTOR_MONTHLY_INCOME = "GET_TUTOR_MONTHLY_INCOME";
const GET_TUTOR_MONTHLY_LESSONS = "GET_TUTOR_MONTHLY_LESSONS";

export const getTutorTotalStatsApiThunk = createAsyncThunk<
    ResponseFromServer<TutorTotalStatistics>
>(GET_TUTOR_TOTAL_STATS, async (_, { rejectWithValue }) => {
    try {
        const response = await getTutorTotalStatsApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getTutorMonthlyIncomeApiThunk = createAsyncThunk<
    ResponseFromServer<TutorMonthlyIncome>,
    string
>(GET_TUTOR_MONTHLY_INCOME, async (year, { rejectWithValue }) => {
    try {
        const response = await getTutorMonthlyIncomeApi(year);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getTutorMonthlyLessonsApiThunk = createAsyncThunk<
    ResponseFromServer<TutorMonthlyLessons>,
    string
>(GET_TUTOR_MONTHLY_LESSONS, async (year, { rejectWithValue }) => {
    try {
        const response = await getTutorMonthlyLessonsApi(year);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});
