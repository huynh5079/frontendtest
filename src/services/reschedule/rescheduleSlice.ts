import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAllRescheduleApiThunk } from "./rescheduleThunk";
import { GetAllReschedule, RescheduleState } from "../../types/reschedule";
import { ResponseFromServer } from "../../types/app";

const initialState: RescheduleState = {
    list: [],
};

export const rescheduleSlice = createSlice({
    name: "reschedule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getAllRescheduleApiThunk.fulfilled,
            (
                state,
                action: PayloadAction<ResponseFromServer<GetAllReschedule[]>>
            ) => {
                state.list = action.payload.data;
            }
        );
    },
});

export const {} = rescheduleSlice.actions;

export default rescheduleSlice.reducer;
