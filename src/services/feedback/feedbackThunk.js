import { createAsyncThunk } from "@reduxjs/toolkit";
import { createFeedbackInClassApi, createFeedbackInTutorProfileApi, getAllFeedbackInTutorProfileApi, } from "./feedbackApi";
const CREATE_FEEDBACK_IN_TUTOR_PROFILE = "CREATE_FEEDBACK_IN_TUTOR_PROFILE";
const CREATE_FEEDBACK_IN_CLASS = "CREATE_FEEDBACK_IN_CLASS";
const GET_ALL_FEEDBACK_IN_TUTOR_PROFILE = "GET_ALL_FEEDBACK_IN_TUTOR_PROFILE";
export const createFeedbackInTutorProfileApiThunk = createAsyncThunk(CREATE_FEEDBACK_IN_TUTOR_PROFILE, async (payload, { rejectWithValue }) => {
    try {
        const response = await createFeedbackInTutorProfileApi(payload.tutorUserId, payload.params);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const createFeedbackInClassApiThunk = createAsyncThunk(CREATE_FEEDBACK_IN_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await createFeedbackInClassApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getAllFeedbackInTutorProfileApiThunk = createAsyncThunk(GET_ALL_FEEDBACK_IN_TUTOR_PROFILE, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllFeedbackInTutorProfileApi(payload.tutorUserId, payload.page, payload.pageSize);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
