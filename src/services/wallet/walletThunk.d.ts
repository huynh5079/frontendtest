import type { DepositWalletParams, DepositWalletResponse, TranferWalletParams, WalletBalance, WalletTransactionHistoryResponse } from "../../types/wallet";
export declare const checkBalanceApiThunk: import("@reduxjs/toolkit").AsyncThunk<WalletBalance, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllTransactionHistoryApiThunk: import("@reduxjs/toolkit").AsyncThunk<WalletTransactionHistoryResponse, {
    page: number;
    size: number;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const depositWalletApiThunk: import("@reduxjs/toolkit").AsyncThunk<DepositWalletResponse, DepositWalletParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const transferWalletApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, TranferWalletParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
