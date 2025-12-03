import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    WalletBalance,
    WalletState,
    WalletTransactionHistoryResponse,
} from "../../types/wallet";
import {
    checkBalanceApiThunk,
    getAllTransactionHistoryApiThunk,
} from "./walletThunk";

const initialState: WalletState = {
    balance: null,
    transactionHistory: null,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                checkBalanceApiThunk.fulfilled,
                (state, action: PayloadAction<WalletBalance>) => {
                    state.balance = action.payload;
                },
            )
            .addCase(
                getAllTransactionHistoryApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<WalletTransactionHistoryResponse>,
                ) => {
                    state.transactionHistory = action.payload;
                },
            );
    },
});

export const {} = walletSlice.actions;

export default walletSlice.reducer;
