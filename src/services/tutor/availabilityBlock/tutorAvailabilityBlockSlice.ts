import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AvailabilityBlockForTutorState, AvailabilityBlocksForTutor } from "../../../types/tutorAvailabilityBlock";
import { getAllAvailabilityBlockForTutorApiThunk } from "./tutorAvailabilityBlockThunk";

const initialState: AvailabilityBlockForTutorState = {
    listAvailabilityBlock: [],
};

export const availabilityBlockForTutorSlice = createSlice({
    name: "availabilityBlockForTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllAvailabilityBlockForTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<AvailabilityBlocksForTutor[]>,
                ) => {
                    state.listAvailabilityBlock = action.payload;
                },
            );
    },
});

export const {} = availabilityBlockForTutorSlice.actions;

export default availabilityBlockForTutorSlice.reducer;
