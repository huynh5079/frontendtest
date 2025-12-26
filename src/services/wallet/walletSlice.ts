import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    WalletBalance,
    WalletState,
    WalletTransactionHistoryResponse,
    WithdrawalRequestResponse,
    WithdrawalRequestDto,
} from "../../types/wallet";
import {
    checkBalanceApiThunk,
    getAllTransactionHistoryApiThunk,
    getMyWithdrawalRequestsApiThunk,
    getMyWithdrawalRequestByIdApiThunk,
    getAllWithdrawalRequestsApiThunk,
    getWithdrawalRequestByIdApiThunk,
} from "./walletThunk";

const initialState: WalletState = {
    balance: null,
    transactionHistory: null,
    myWithdrawalRequests: null,
    myWithdrawalRequestDetail: null,
    allWithdrawalRequests: null,
    withdrawalRequestDetail: null,
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
            )
            .addCase(
                getMyWithdrawalRequestsApiThunk.fulfilled,
                (state, action: PayloadAction<WithdrawalRequestResponse>) => {
                    state.myWithdrawalRequests = action.payload;
                },
            )
            .addCase(
                getMyWithdrawalRequestByIdApiThunk.fulfilled,
                (state, action: PayloadAction<WithdrawalRequestDto>) => {
                    state.myWithdrawalRequestDetail = action.payload;
                },
            )
            .addCase(
                getAllWithdrawalRequestsApiThunk.fulfilled,
                (state, action: PayloadAction<WithdrawalRequestResponse>) => {
                    state.allWithdrawalRequests = action.payload;
                },
            )
            .addCase(
                getWithdrawalRequestByIdApiThunk.fulfilled,
                (state, action: PayloadAction<WithdrawalRequestDto>) => {
                    state.withdrawalRequestDetail = action.payload;
                },
            );
    },
});

export const { } = walletSlice.actions;

export default walletSlice.reducer;
