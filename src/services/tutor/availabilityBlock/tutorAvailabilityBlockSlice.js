import { createSlice } from "@reduxjs/toolkit";
import { getAllAvailabilityBlockForTutorApiThunk } from "./tutorAvailabilityBlockThunk";
const initialState = {
    listAvailabilityBlock: [],
};
export const availabilityBlockForTutorSlice = createSlice({
    name: "availabilityBlockForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllAvailabilityBlockForTutorApiThunk.fulfilled, (state, action) => {
            state.listAvailabilityBlock = action.payload;
        });
    },
});
export const {} = availabilityBlockForTutorSlice.actions;
export default availabilityBlockForTutorSlice.reducer;
