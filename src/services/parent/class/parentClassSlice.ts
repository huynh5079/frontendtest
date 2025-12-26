import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    AssignedClassForParent,
    ParentClassState,
} from "../../../types/parent";
import {
    checkAssignClassForParentApiThunk,
    getAllAssignedClassForParentApiThunk,
} from "./parentClassThunk";
import { CheckAssignClassResponse } from "../../../types/student";

const initialState: ParentClassState = {
    isEnrolled: false,
    assignedClasses: null,
};

export const parentClassSlice = createSlice({
    name: "parentClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                checkAssignClassForParentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<CheckAssignClassResponse>
                    >,
                ) => {
                    state.isEnrolled = action.payload.data.isEnrolled;
                },
            )
            .addCase(
                getAllAssignedClassForParentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<AssignedClassForParent[]>
                    >,
                ) => {
                    state.assignedClasses = action.payload.data;
                },
            );
    },
});

export const {} = parentClassSlice.actions;

export default parentClassSlice.reducer;
