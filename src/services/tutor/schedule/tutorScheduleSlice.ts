import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    DetailScheduleLessonForTutor,
    OneOnOneStudentForTutor,
    ScheduleForTutor,
    ScheduleForTutorState,
} from "../../../types/tutor";
import {
    getAllOneOnOneStudentForTutorApiThunk,
    getAllScheduleForTutorApiThunk,
    getAllStudyScheduleWithSpecificClassForTutorApiThunk,
    getAllStudyScheduleWithSpecificStudentForTutorApiThunk,
    getDetailScheduleLessonForTutorApiThunk,
} from "./tutorScheduleThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: ScheduleForTutorState = {
    list: [],
    detail: null,
    listOneOnOne: [],
};

export const scheduleForTutorSlice = createSlice({
    name: "scheduleForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllScheduleForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<ScheduleForTutor[]>
                    >
                ) => {
                    state.list = action.payload.data;
                }
            )
            .addCase(
                getAllStudyScheduleWithSpecificStudentForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<ScheduleForTutor[]>
                    >
                ) => {
                    state.list = action.payload.data;
                }
            )
            .addCase(
                getAllStudyScheduleWithSpecificClassForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<ScheduleForTutor[]>
                    >
                ) => {
                    state.list = action.payload.data;
                }
            )
            .addCase(
                getAllOneOnOneStudentForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<OneOnOneStudentForTutor[]>
                    >
                ) => {
                    state.listOneOnOne = action.payload.data;
                }
            )
            .addCase(
                getDetailScheduleLessonForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<DetailScheduleLessonForTutor>
                    >
                ) => {
                    state.detail = action.payload.data;
                }
            );
    },
});

export const {} = scheduleForTutorSlice.actions;

export default scheduleForTutorSlice.reducer;
