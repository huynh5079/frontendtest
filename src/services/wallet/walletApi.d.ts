import type { DepositWalletParams, TranferWalletParams } from "../../types/wallet";
export declare const checkBalanceApi: () => Promise<any>;
export declare const getAllTransactionHistoryApi: (page: number, size: number) => Promise<any>;
export declare const depositWalletApi: (params: DepositWalletParams) => Promise<any>;
export declare const tranferWalletApi: (params: TranferWalletParams) => Promise<any>;
