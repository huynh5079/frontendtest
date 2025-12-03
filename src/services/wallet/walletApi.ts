import type { DepositWalletParams, TranferWalletParams } from "../../types/wallet";
import request from "../request";

export const checkBalanceApi = async () => {
    const data = await request.get(`/wallet/me`);
    return data.data;
};

export const getAllTransactionHistoryApi = async (
    page: number,
    size: number,
) => {
    const data = await request.get(
        `/wallet/me/transactions?pageNumber=${page}&sizeSize=${size}`,
    );
    return data.data;
};

export const depositWalletApi = async (params: DepositWalletParams) => {
    const data = await request.post(`/payments/momo/create`, params);
    return data.data;
};

export const tranferWalletApi = async (params: TranferWalletParams) => {
    const data = await request.post(`/api/wallet/transfer`, params);
    return data.data;
};
