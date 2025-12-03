import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import { getAllLearingScheduleForStudentApiThunk } from "./learningScheduleThunk";
import type {
    learningScheduleForStudent,
    learningScheduleForStudentState,
} from "../../../types/student";

const initialState: learningScheduleForStudentState = {
    list: [],
};

export const learningScheduleForStudentSlice = createSlice({
    name: "learningScheduleForStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getAllLearingScheduleForStudentApiThunk.fulfilled,
            (
                state,
                action: PayloadAction<
                    ResponseFromServer<learningScheduleForStudent[]>
                >,
            ) => {
                state.list = action.payload.data;
            },
        );
    },
});

export const {} = learningScheduleForStudentSlice.actions;

export default learningScheduleForStudentSlice.reducer;
