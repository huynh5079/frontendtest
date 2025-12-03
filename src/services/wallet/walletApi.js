import request from "../request";
export const checkBalanceApi = async () => {
    const data = await request.get(`/wallet/me`);
    return data.data;
};
export const getAllTransactionHistoryApi = async (page, size) => {
    const data = await request.get(`/wallet/me/transactions?pageNumber=${page}&sizeSize=${size}`);
    return data.data;
};
export const depositWalletApi = async (params) => {
    const data = await request.post(`/payments/momo/create`, params);
    return data.data;
};
export const tranferWalletApi = async (params) => {
    const data = await request.post(`/api/wallet/transfer`, params);
    return data.data;
};
