import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkBalanceApi, depositWalletApi, getAllTransactionHistoryApi, tranferWalletApi, } from "./walletApi";
const CHECK_BALANCE = "CHECK_BALANCE";
const GET_ALL_TRANSACTION_HISTORY = "GET_ALL_TRANSACTION_HISTORY";
const DEPOSIT_WALLET = "DEPOSIT_WALLET";
const TRANFER_WALLET = "TRANFER_WALLET";
export const checkBalanceApiThunk = createAsyncThunk(CHECK_BALANCE, async (_, { rejectWithValue }) => {
    try {
        const response = await checkBalanceApi();
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const getAllTransactionHistoryApiThunk = createAsyncThunk(GET_ALL_TRANSACTION_HISTORY, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllTransactionHistoryApi(payload.page, payload.size);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const depositWalletApiThunk = createAsyncThunk(DEPOSIT_WALLET, async (payload, { rejectWithValue }) => {
    try {
        const response = await depositWalletApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const transferWalletApiThunk = createAsyncThunk(TRANFER_WALLET, async (payload, { rejectWithValue }) => {
    try {
        const response = await tranferWalletApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
