import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    ApplyRequestFindTutorForStudent,
    ApplyRequestFindTutorForStudentState,
} from "../../../types/student";
import { getAllApplyRequestFindTutorForStudentApiThunk } from "./requestFindTutorThunk";
import type { ResponseFromServer } from "../../../types/app";

const initialState: ApplyRequestFindTutorForStudentState = {
    list: [],
};

export const requestFindTutorForStudentSlice = createSlice({
    name: "requestFindTutorForStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getAllApplyRequestFindTutorForStudentApiThunk.fulfilled,
            (
                state,
                action: PayloadAction<
                    ResponseFromServer<ApplyRequestFindTutorForStudent[]>
                >,
            ) => {
                state.list = action.payload.data;
            },
        );
    },
});

export const {} = requestFindTutorForStudentSlice.actions;

export default requestFindTutorForStudentSlice.reducer;
