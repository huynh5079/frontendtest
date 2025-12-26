import type {
    DepositWalletParams,
    TranferToAdminParams,
    TranferWalletParams,
    WithdrawWalletParams,
} from "../../types/wallet";
import request from "../request";

export const checkBalanceApi = async () => {
    const data = await request.get(`/wallet/me`);
    return data.data;
};

export const getAllTransactionHistoryApi = async (
    page: number,
    size: number
) => {
    const data = await request.get(
        `/wallet/me/transactions?pageNumber=${page}&pageSize=${size}`
    );
    return data.data;
};

export const depositWalletApi = async (params: DepositWalletParams) => {
    const data = await request.post(`/payments/momo/create`, params);
    return data.data;
};

export const depositWalletPayOSApi = async (params: DepositWalletParams) => {
    const data = await request.post(`/payments/payos/create`, params);
    return data.data;
};

export const tranferWalletApi = async (params: TranferWalletParams) => {
    const data = await request.post(`/api/wallet/transfer`, params);
    return data.data;
};

export const tranferToAdminApi = async (params: TranferToAdminParams) => {
    const data = await request.post(`/wallet/transfer-to-admin`, params);
    return data.data;
};

export const retryPaymentApi = async (paymentId: string) => {
    const data = await request.post(`/payments/momo/${paymentId}/retry`);
    return data.data;
};

export const retryPaymentPayOSApi = async (paymentId: string) => {
    const data = await request.post(`/payments/payos/${paymentId}/retry`);
    return data.data;
};

export const withdrawWalletApi = async (params: WithdrawWalletParams) => {
    const data = await request.post(`/wallet/withdraw`, params);
    return data.data;
};

export const confirmPaymentApi = async (classId: string) => {
    const data = await request.post(`/assigns/confirm-payment/${classId}`);
    return data.data;
};

// ===== Withdrawal Request APIs =====
export const createWithdrawalRequestApi = async (params: {
    amount: number;
    method: "MoMo" | "BankTransfer" | "PayPal";
    recipientInfo: string;
    recipientName?: string;
    note?: string;
}) => {
    const data = await request.post(`/withdrawals`, params);
    return data.data;
};

export const getMyWithdrawalRequestsApi = async (page: number, size: number) => {
    const data = await request.get(`/withdrawals/me?pageNumber=${page}&pageSize=${size}`);
    return data.data;
};

export const getMyWithdrawalRequestByIdApi = async (requestId: string) => {
    const data = await request.get(`/withdrawals/me/${requestId}`);
    return data.data;
};

export const cancelWithdrawalRequestApi = async (requestId: string) => {
    const data = await request.delete(`/withdrawals/${requestId}`);
    return data.data;
};

// Admin APIs
export const getAllWithdrawalRequestsApi = async (
    status?: string,
    page: number = 1,
    size: number = 20
) => {
    const queryParams = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: size.toString(),
    });
    if (status) queryParams.append("status", status);

    const data = await request.get(`/withdrawals?${queryParams.toString()}`);
    return data.data;
};

export const getWithdrawalRequestByIdApi = async (requestId: string) => {
    const data = await request.get(`/withdrawals/${requestId}`);
    return data.data;
};

export const approveWithdrawalRequestApi = async (
    requestId: string,
    params: { adminNote?: string }
) => {
    const data = await request.post(`/withdrawals/${requestId}/approve`, params);
    return data.data;
};

export const rejectWithdrawalRequestApi = async (
    requestId: string,
    params: { reason: string; adminNote?: string }
) => {
    const data = await request.post(`/withdrawals/${requestId}/reject`, params);
    return data.data;
};