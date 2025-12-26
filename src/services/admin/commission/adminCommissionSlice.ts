import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CommissionData } from "./adminCommissionApi";
import { getCommissionApiThunk, updateCommissionApiThunk } from "./adminCommissionThunk";

interface CommissionState {
    commission: CommissionData | null;
    loading: boolean;
    error: string | null;
}

const initialState: CommissionState = {
    commission: null,
    loading: false,
    error: null,
};

const commissionSlice = createSlice({
    name: "commission",
    initialState,
    reducers: {
        clearCommission: (state) => {
            state.commission = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Commission
            .addCase(getCommissionApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCommissionApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Payload là CommissionData trực tiếp
                state.commission = action.payload;
            })
            .addCase(getCommissionApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            })
            // Update Commission
            .addCase(updateCommissionApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCommissionApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Payload là CommissionData trực tiếp
                state.commission = action.payload;
            })
            .addCase(updateCommissionApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
});

export const { clearCommission } = commissionSlice.actions;
export default commissionSlice.reducer;

