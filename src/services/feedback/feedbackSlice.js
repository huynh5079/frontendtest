import { createSlice } from "@reduxjs/toolkit";
import { getAllFeedbackInTutorProfileApiThunk } from "./feedbackThunk";
const initialState = {
    feedbackInTutorProfile: null,
};
export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFeedbackInTutorProfileApiThunk.fulfilled, (state, action) => {
            state.feedbackInTutorProfile = action.payload.data;
        });
    },
});
export const {} = feedbackSlice.actions;
export default feedbackSlice.reducer;
