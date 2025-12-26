import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type {
    TransactionItem,
    TransactionQuery,
    TransactionsResponse,
} from "./adminTransactionApi";
import {
    getTransactionsForAdminApi,
    getTransactionDetailForAdminApi,
} from "./adminTransactionApi";

const GET_TRANSACTIONS_FOR_ADMIN = "GET_TRANSACTIONS_FOR_ADMIN";
const GET_TRANSACTION_DETAIL_FOR_ADMIN = "GET_TRANSACTION_DETAIL_FOR_ADMIN";

export const getTransactionsForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<TransactionsResponse>,
    TransactionQuery | undefined
>(GET_TRANSACTIONS_FOR_ADMIN, async (query, { rejectWithValue }) => {
    try {
        const response = await getTransactionsForAdminApi(query);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getTransactionDetailForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<TransactionItem>,
    string
>(GET_TRANSACTION_DETAIL_FOR_ADMIN, async (transactionId, { rejectWithValue }) => {
    try {
        const response = await getTransactionDetailForAdminApi(transactionId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

