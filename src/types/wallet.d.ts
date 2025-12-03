export type WalletState = {
    balance: WalletBalance | null;
    transactionHistory: WalletTransactionHistoryResponse | null;
};

export type WalletBalance = {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    isFrozen: boolean;
    createdAt: string;
    updatedAt: string;
};

export type WalletTransactionHistoryResponse = {
    items: WalletTransactionHistory[];
    total: number;
    page: number;
    size: number;
};

export type WalletTransactionHistory = {
    id: string;
    walletId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
};

export type DepositWalletParams = {
    amount: number;
    contextType: string;
    contextId: string;
    description: string;
    extraData: string;
};

export type DepositWalletResponse = {
    paymentId: string;
    orderId: string;
    payUrl: string;
    deepLink: string;
    provider: string;
};

export type TranferWalletParams = {
    amount: number;
    toUserId: string;
    note: string;
};
