import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    GetAllQuizForTutor,
    GetDetailQuizForTutor,
    QuizForTutorState,
} from "../../../types/tutor";
import {
    getAllQuizForTutorApiThunk,
    getDetailQuizForTutorApiThunk,
} from "./tutorQuizThunk";

const initialState: QuizForTutorState = {
    list: [],
    detail: null,
};

export const tutorQuizSlice = createSlice({
    name: "tutorQuiz",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllQuizForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<GetAllQuizForTutor[]>
                    >,
                ) => {
                    state.list = action.payload.data;
                },
            )
            .addCase(
                getDetailQuizForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<GetDetailQuizForTutor>
                    >,
                ) => {
                    state.detail = action.payload.data;
                },
            );
    },
});

export const {} = tutorQuizSlice.actions;

export default tutorQuizSlice.reducer;
