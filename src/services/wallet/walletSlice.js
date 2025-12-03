import { createSlice } from "@reduxjs/toolkit";
import { checkBalanceApiThunk, getAllTransactionHistoryApiThunk, } from "./walletThunk";
const initialState = {
    balance: null,
    transactionHistory: null,
};
export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkBalanceApiThunk.fulfilled, (state, action) => {
            state.balance = action.payload;
        })
            .addCase(getAllTransactionHistoryApiThunk.fulfilled, (state, action) => {
            state.transactionHistory = action.payload;
        });
    },
});
export const {} = walletSlice.actions;
export default walletSlice.reducer;
