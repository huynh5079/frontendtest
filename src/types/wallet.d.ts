export type WalletState = {
    balance: WalletBalance | null;
    transactionHistory: WalletTransactionHistoryResponse | null;
    myWithdrawalRequests: WithdrawalRequestResponse | null;
    myWithdrawalRequestDetail: WithdrawalRequestDto | null;
    allWithdrawalRequests: WithdrawalRequestResponse | null;
    withdrawalRequestDetail: WithdrawalRequestDto | null;
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
    note?: string;
    counterpartyUserId?: string;
    counterpartyUsername?: string;
    createdAt: string;
};

export type DepositWalletParams = {
    amount: number;
    contextType: string;
    description: string;
    extraData: string;
};

export type DepositWalletResponse = {
    paymentId: string;
    orderId: string;
    payUrl: string;
    deepLink: string;
    provider: string;
    // PayOS specific fields
    checkoutUrl?: string;
    qrCode?: string;
    data?: {
        checkoutUrl?: string;
        qrCode?: string;
        accountNumber?: string;
        accountName?: string;
        amount?: number;
        description?: string;
        status?: string;
    };
};

export type TranferWalletParams = {
    amount: number;
    toUserId: string;
    note: string;
};

export type TranferToAdminParams = {
    Amount: number;
    Note: string;
};

export type WithdrawWalletParams = {
    Amount: number;
    Note: string;
};

// ===== Withdrawal Request Types =====
export type WithdrawalMethod = "MoMo" | "BankTransfer" | "PayPal";
export type WithdrawalStatus = "Pending" | "Approved" | "Processing" | "Completed" | "Failed" | "Rejected" | "Cancelled";

export type CreateWithdrawalRequestParams = {
    amount: number;
    method: WithdrawalMethod;
    recipientInfo: string;
    recipientName?: string;
    note?: string;
};

export type WithdrawalRequestDto = {
    id: string;
    userId: string;
    userName?: string;
    amount: number;
    method: string;
    status: string;
    recipientInfo: string;
    recipientName?: string;
    note?: string;
    adminNote?: string;
    processedByUserId?: string;
    processedByUserName?: string;
    processedAt?: string;
    paymentId?: string;
    transactionId?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
};

export type WithdrawalRequestResponse = {
    items: WithdrawalRequestDto[];
    total: number;
    page: number;
    size: number;
};

export type ApproveWithdrawalRequestParams = {
    adminNote?: string;
};

export type RejectWithdrawalRequestParams = {
    reason: string;
    adminNote?: string;
};