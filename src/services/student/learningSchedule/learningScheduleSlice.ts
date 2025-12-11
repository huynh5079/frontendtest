import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    getAllLearingScheduleForStudentApiThunk,
    getAllLearingScheduleWithOngoingClassForStudentApiThunk,
    getAllLearingScheduleWithSpecificTutorForStudentApiThunk,
    getAllOneOnOneTutorForStudentApiThunk,
    getDetailScheduleLessonForStudentApiThunk,
} from "./learningScheduleThunk";
import type {
    DetailScheduleLessonForStudent,
    learningScheduleForStudent,
    learningScheduleForStudentState,
    OneOnOneTutorForStudent,
} from "../../../types/student";

const initialState: learningScheduleForStudentState = {
    list: [],
    detail: null,
    listOneOnOne: [],
};

export const learningScheduleForStudentSlice = createSlice({
    name: "learningScheduleForStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllLearingScheduleForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<learningScheduleForStudent[]>
                    >,
                ) => {
                    state.list = action.payload.data;
                },
            )
            .addCase(
                getAllLearingScheduleWithSpecificTutorForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<learningScheduleForStudent[]>
                    >,
                ) => {
                    state.list = action.payload.data;
                },
            )
            .addCase(
                getAllLearingScheduleWithOngoingClassForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<learningScheduleForStudent[]>
                    >,
                ) => {
                    state.list = action.payload.data;
                },
            )
            .addCase(
                getDetailScheduleLessonForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<DetailScheduleLessonForStudent>
                    >,
                ) => {
                    state.detail = action.payload.data;
                },
            )
            .addCase(
                getAllOneOnOneTutorForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<OneOnOneTutorForStudent[]>
                    >,
                ) => {
                    state.listOneOnOne = action.payload.data;
                },
            );
    },
});

export const {} = learningScheduleForStudentSlice.actions;

export default learningScheduleForStudentSlice.reducer;
