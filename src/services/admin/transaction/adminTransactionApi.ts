import request from "../../request";

export interface TransactionItem {
    id: string;
    walletId?: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    type: string;
    amount: number;
    status: string;
    note?: string;
    counterpartyUserId?: string;
    counterpartyUsername?: string;
    createdAt: string;
}

export interface TransactionQuery {
    role?: "Tutor" | "Student" | "Parent";
    type?: string;
    status?: "Succeeded" | "Pending" | "Failed" | "all";
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}

export interface TransactionsResponse {
    total: number;
    items: TransactionItem[];
    page: number;
    size: number;
}

export const getTransactionsForAdminApi = async (query?: TransactionQuery) => {
    const params = new URLSearchParams();
    if (query?.role) params.append("role", query.role);
    if (query?.type) params.append("type", query.type);
    if (query?.status && query.status !== "all") params.append("status", query.status);
    if (query?.startDate) params.append("startDate", query.startDate);
    if (query?.endDate) params.append("endDate", query.endDate);
    if (query?.page) params.append("page", query.page.toString());
    if (query?.pageSize) params.append("pageSize", query.pageSize.toString());

    const data = await request.get(`admin/transactions?${params.toString()}`);
    return data.data;
};

export const getTransactionDetailForAdminApi = async (transactionId: string) => {
    const data = await request.get(`admin/transactions/${transactionId}`);
    return data.data;
};

