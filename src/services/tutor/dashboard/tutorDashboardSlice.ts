import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    TutorDashboardState,
    TutorMonthlyIncome,
    TutorMonthlyLessons,
    TutorTotalStatistics,
} from "../../../types/tutor";
import {
    getTutorMonthlyIncomeApiThunk,
    getTutorMonthlyLessonsApiThunk,
    getTutorTotalStatsApiThunk,
} from "./tutorDashboardThunk";

const initialState: TutorDashboardState = {
    totalStatistics: null,
    monthlyIncome: null,
    monthlyLessons: null,
};

export const tutorDashboardSlice = createSlice({
    name: "tutorDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getTutorTotalStatsApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<TutorTotalStatistics>
                    >,
                ) => {
                    state.totalStatistics = action.payload.data;
                },
            )
            .addCase(
                getTutorMonthlyIncomeApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<TutorMonthlyIncome>
                    >,
                ) => {
                    state.monthlyIncome = action.payload.data;
                },
            )
            .addCase(
                getTutorMonthlyLessonsApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<TutorMonthlyLessons>
                    >,
                ) => {
                    state.monthlyLessons = action.payload.data;
                },
            );
    },
});

export const {} = tutorDashboardSlice.actions;

export default tutorDashboardSlice.reducer;
