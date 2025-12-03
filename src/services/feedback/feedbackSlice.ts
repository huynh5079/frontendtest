import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    FeedbackInTutorProfileResponse,
    FeedbackState,
} from "../../types/feedback";
import { getAllFeedbackInTutorProfileApiThunk } from "./feedbackThunk";
import type { ResponseFromServer } from "../../types/app";

const initialState: FeedbackState = {
    feedbackInTutorProfile: null,
};

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getAllFeedbackInTutorProfileApiThunk.fulfilled,
            (
                state,
                action: PayloadAction<
                    ResponseFromServer<FeedbackInTutorProfileResponse>
                >
            ) => {
                state.feedbackInTutorProfile = action.payload.data;
            }
        );
    },
});

export const {} = feedbackSlice.actions;

export default feedbackSlice.reducer;
