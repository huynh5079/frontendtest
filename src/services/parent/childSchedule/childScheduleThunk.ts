import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getDetailChildScheduleLessonForParentApi,
    getScheduleSpecificChildForParentApi,
} from "./childScheduleApi";
import { ResponseFromServer } from "../../../types/app";
import {
    ChildSchedule,
    DetailChildScheduleLessonForParent,
    GetScheduleSpecificChildParams,
} from "../../../types/parent";

const GET_SCHEDULE_SPECIFIC_CHILD_FOR_PARENT =
    "GET_SCHEDULE_SPECIFIC_CHILD_FOR_PARENT";
const GET_DETAIL_CHILD_SCHEDULE_LESSON_FOR_PARENT =
    "GET_DETAIL_CHILD_SCHEDULE_LESSON_FOR_PARENT";

export const getScheduleSpecificChildForParentApiThunk = createAsyncThunk<
    ResponseFromServer<ChildSchedule[]>,
    GetScheduleSpecificChildParams
>(
    GET_SCHEDULE_SPECIFIC_CHILD_FOR_PARENT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getScheduleSpecificChildForParentApi(
                payload
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getDetailChildScheduleLessonForParentApiThunk = createAsyncThunk<
    ResponseFromServer<DetailChildScheduleLessonForParent>,
    string
>(
    GET_DETAIL_CHILD_SCHEDULE_LESSON_FOR_PARENT,
    async (id, { rejectWithValue }) => {
        try {
            const response = await getDetailChildScheduleLessonForParentApi(id);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);
