import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    GetAllQuizForStudent,
    GetDetailQuizForStudent,
    QuizForStudentState,
    StudentQuizResult,
} from "../../../types/student";
import {
    doQuizForStudentApiThunk,
    getAllHistorySubmitQuizForStudentApiThunk,
    getAllQuizForStudentApiThunk,
    submitQuizForStudentApiThunk,
} from "./studentQuizThunk";

const initialState: QuizForStudentState = {
    list: [],
    detail: null,
    result: null,
    historic: null,
};

export const studentQuizSlice = createSlice({
    name: "studentQuiz",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllQuizForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<GetAllQuizForStudent[]>
                    >,
                ) => {
                    state.list = action.payload.data;
                },
            )
            .addCase(
                doQuizForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<GetDetailQuizForStudent>
                    >,
                ) => {
                    state.detail = action.payload.data;
                },
            )
            .addCase(
                submitQuizForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<StudentQuizResult>
                    >,
                ) => {
                    state.result = action.payload.data;
                },
            )
            .addCase(
                getAllHistorySubmitQuizForStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<StudentQuizResult[]>
                    >,
                ) => {
                    state.historic = action.payload.data;
                },
            );
    },
});

export const {} = studentQuizSlice.actions;

export default studentQuizSlice.reducer;
