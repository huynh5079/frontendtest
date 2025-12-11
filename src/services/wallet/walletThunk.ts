import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    checkBalanceApi,
    depositWalletApi,
    getAllTransactionHistoryApi,
    tranferToAdminApi,
    tranferWalletApi,
} from "./walletApi";
import type {
    DepositWalletParams,
    DepositWalletResponse,
    TranferToAdminParams,
    TranferWalletParams,
    WalletBalance,
    WalletTransactionHistoryResponse,
} from "../../types/wallet";

const CHECK_BALANCE = "CHECK_BALANCE";
const GET_ALL_TRANSACTION_HISTORY = "GET_ALL_TRANSACTION_HISTORY";
const DEPOSIT_WALLET = "DEPOSIT_WALLET";
const TRANFER_WALLET = "TRANFER_WALLET";
const TRANFER_TO_ADMIN = "TRANFER_TO_ADMIN";

export const checkBalanceApiThunk = createAsyncThunk<WalletBalance>(
    CHECK_BALANCE,
    async (_, { rejectWithValue }) => {
        try {
            const response = await checkBalanceApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllTransactionHistoryApiThunk = createAsyncThunk<
    WalletTransactionHistoryResponse,
    { page: number; size: number }
>(GET_ALL_TRANSACTION_HISTORY, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllTransactionHistoryApi(
            payload.page,
            payload.size,
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const depositWalletApiThunk = createAsyncThunk<
    DepositWalletResponse,
    DepositWalletParams
>(DEPOSIT_WALLET, async (payload, { rejectWithValue }) => {
    try {
        const response = await depositWalletApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const transferWalletApiThunk = createAsyncThunk<{}, TranferWalletParams>(
    TRANFER_WALLET,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await tranferWalletApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const tranferToAdminApiThunk = createAsyncThunk<
    {},
    TranferToAdminParams
>(TRANFER_WALLET, async (payload, { rejectWithValue }) => {
    try {
        const response = await tranferToAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
