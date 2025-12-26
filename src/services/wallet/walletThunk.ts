import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    checkBalanceApi,
    confirmPaymentApi,
    depositWalletApi,
    depositWalletPayOSApi,
    getAllTransactionHistoryApi,
    tranferToAdminApi,
    tranferWalletApi,
    withdrawWalletApi,
    createWithdrawalRequestApi,
    getMyWithdrawalRequestsApi,
    getMyWithdrawalRequestByIdApi,
    cancelWithdrawalRequestApi,
    getAllWithdrawalRequestsApi,
    getWithdrawalRequestByIdApi,
    approveWithdrawalRequestApi,
    rejectWithdrawalRequestApi,
    retryPaymentPayOSApi,
} from "./walletApi";
import type {
    DepositWalletParams,
    DepositWalletResponse,
    TranferToAdminParams,
    TranferWalletParams,
    WalletBalance,
    WalletTransactionHistoryResponse,
    WithdrawWalletParams,
    CreateWithdrawalRequestParams,
    WithdrawalRequestResponse,
    WithdrawalRequestDto,
    ApproveWithdrawalRequestParams,
    RejectWithdrawalRequestParams,
} from "../../types/wallet";

const CHECK_BALANCE = "CHECK_BALANCE";
const GET_ALL_TRANSACTION_HISTORY = "GET_ALL_TRANSACTION_HISTORY";
const DEPOSIT_WALLET = "DEPOSIT_WALLET";
const DEPOSIT_WALLET_PAYOS = "DEPOSIT_WALLET_PAYOS";
const WITHDRAW_WALLET = "WITHDRAW_WALLET";
const TRANFER_WALLET = "TRANFER_WALLET";
const CONFIRM_PAYMENT = "CONFIRM_PAYMENT";
const CREATE_WITHDRAWAL_REQUEST = "CREATE_WITHDRAWAL_REQUEST";
const GET_MY_WITHDRAWAL_REQUESTS = "GET_MY_WITHDRAWAL_REQUESTS";
const GET_MY_WITHDRAWAL_REQUEST_BY_ID = "GET_MY_WITHDRAWAL_REQUEST_BY_ID";
const CANCEL_WITHDRAWAL_REQUEST = "CANCEL_WITHDRAWAL_REQUEST";
const GET_ALL_WITHDRAWAL_REQUESTS = "GET_ALL_WITHDRAWAL_REQUESTS";
const GET_WITHDRAWAL_REQUEST_BY_ID = "GET_WITHDRAWAL_REQUEST_BY_ID";
const APPROVE_WITHDRAWAL_REQUEST = "APPROVE_WITHDRAWAL_REQUEST";
const REJECT_WITHDRAWAL_REQUEST = "REJECT_WITHDRAWAL_REQUEST";

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
    }
);

export const getAllTransactionHistoryApiThunk = createAsyncThunk<
    WalletTransactionHistoryResponse,
    { page: number; size: number }
>(GET_ALL_TRANSACTION_HISTORY, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllTransactionHistoryApi(
            payload.page,
            payload.size
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

export const depositWalletPayOSApiThunk = createAsyncThunk<
    DepositWalletResponse,
    DepositWalletParams
>(DEPOSIT_WALLET_PAYOS, async (payload, { rejectWithValue }) => {
    try {
        const response = await depositWalletPayOSApi(payload);
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
    }
);

export const withdrawWalletApiThunk = createAsyncThunk<
    {},
    WithdrawWalletParams
>(WITHDRAW_WALLET, async (payload, { rejectWithValue }) => {
    try {
        const response = await withdrawWalletApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

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

export const confirmPaymentApiThunk = createAsyncThunk<{}, string>(
    CONFIRM_PAYMENT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await confirmPaymentApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

// ===== Withdrawal Request Thunks =====
export const createWithdrawalRequestApiThunk = createAsyncThunk<
    { requestId: string },
    CreateWithdrawalRequestParams
>(CREATE_WITHDRAWAL_REQUEST, async (payload, { rejectWithValue }) => {
    try {
        const response = await createWithdrawalRequestApi(payload);
        return response.data as { requestId: string };
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getMyWithdrawalRequestsApiThunk = createAsyncThunk<
    WithdrawalRequestResponse,
    { page: number; size: number }
>(GET_MY_WITHDRAWAL_REQUESTS, async (payload, { rejectWithValue }) => {
    try {
        const response = await getMyWithdrawalRequestsApi(payload.page, payload.size);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getMyWithdrawalRequestByIdApiThunk = createAsyncThunk<
    WithdrawalRequestDto,
    string
>(GET_MY_WITHDRAWAL_REQUEST_BY_ID, async (payload, { rejectWithValue }) => {
    try {
        const response = await getMyWithdrawalRequestByIdApi(payload);
        return response.data;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const cancelWithdrawalRequestApiThunk = createAsyncThunk<{}, string>(
    CANCEL_WITHDRAWAL_REQUEST,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await cancelWithdrawalRequestApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response?.data,
            });
        }
    }
);

// Admin thunks
export const getAllWithdrawalRequestsApiThunk = createAsyncThunk<
    WithdrawalRequestResponse,
    { status?: string; page: number; size: number }
>(GET_ALL_WITHDRAWAL_REQUESTS, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllWithdrawalRequestsApi(
            payload.status,
            payload.page,
            payload.size
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getWithdrawalRequestByIdApiThunk = createAsyncThunk<
    WithdrawalRequestDto,
    string
>(GET_WITHDRAWAL_REQUEST_BY_ID, async (payload, { rejectWithValue }) => {
    try {
        const response = await getWithdrawalRequestByIdApi(payload);
        return response.data;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const approveWithdrawalRequestApiThunk = createAsyncThunk<
    {},
    { requestId: string; params: ApproveWithdrawalRequestParams }
>(APPROVE_WITHDRAWAL_REQUEST, async (payload, { rejectWithValue }) => {
    try {
        const response = await approveWithdrawalRequestApi(payload.requestId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const rejectWithdrawalRequestApiThunk = createAsyncThunk<
    {},
    { requestId: string; params: RejectWithdrawalRequestParams }
>(REJECT_WITHDRAWAL_REQUEST, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectWithdrawalRequestApi(payload.requestId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});
