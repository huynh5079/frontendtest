import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    ChildSchedule,
    ChildScheduleState,
    DetailChildScheduleLessonForParent,
} from "../../../types/parent";
import {
    getDetailChildScheduleLessonForParentApiThunk,
    getScheduleSpecificChildForParentApiThunk,
} from "./childScheduleThunk";

const initialState: ChildScheduleState = {
    list: [],
    detail: null,
};

export const childScheduleSlice = createSlice({
    name: "childSchedule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getScheduleSpecificChildForParentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ChildSchedule[]>>
                ) => {
                    state.list = action.payload.data;
                }
            )
            .addCase(
                getDetailChildScheduleLessonForParentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<
                        ResponseFromServer<DetailChildScheduleLessonForParent>
                    >
                ) => {
                    state.detail = action.payload.data;
                }
            );
    },
});

export const {} = childScheduleSlice.actions;

export default childScheduleSlice.reducer;
