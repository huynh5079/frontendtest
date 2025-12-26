import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type { TransactionItem, TransactionsResponse } from "./adminTransactionApi";
import {
    getTransactionsForAdminApiThunk,
    getTransactionDetailForAdminApiThunk,
} from "./adminTransactionThunk";

interface AdminTransactionState {
    transactions: TransactionItem[];
    transactionDetail: TransactionItem | null;
    total: number;
    loading: boolean;
    detailLoading: boolean;
    error: string | null;
}

const initialState: AdminTransactionState = {
    transactions: [],
    transactionDetail: null,
    total: 0,
    loading: false,
    detailLoading: false,
    error: null,
};

export const adminTransactionSlice = createSlice({
    name: "adminTransaction",
    initialState,
    reducers: {
        clearTransactionDetail: (state) => {
            state.transactionDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactionsForAdminApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                getTransactionsForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TransactionsResponse>>,
                ) => {
                    state.loading = false;
                    state.transactions = action.payload.data?.items || [];
                    state.total = action.payload.data?.total || 0;
                    state.error = null;
                },
            )
            .addCase(getTransactionsForAdminApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.errorMessage || "Lỗi khi tải danh sách giao dịch";
            })
            .addCase(getTransactionDetailForAdminApiThunk.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(
                getTransactionDetailForAdminApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TransactionItem>>,
                ) => {
                    state.detailLoading = false;
                    state.transactionDetail = action.payload.data || null;
                    state.error = null;
                },
            )
            .addCase(getTransactionDetailForAdminApiThunk.rejected, (state, action) => {
                state.detailLoading = false;
                state.error =
                    (action.payload as any)?.errorMessage || "Lỗi khi tải chi tiết giao dịch";
            });
    },
});

export const { clearTransactionDetail } = adminTransactionSlice.actions;

export default adminTransactionSlice.reducer;

