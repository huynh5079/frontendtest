export type ResponseFromServer<T> = {
    status: string;
    message: string;
    data: T;
};

export type AppGlobalState = {
    loading: boolean;
};

export type ListPaginationResponse<T> = {
    data: T;
    pagination: Pagination;
};

export type Pagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type ThunkErrors = {
    errorMessage: string;
    data?: any;
    success?: boolean;
};

export type Selector<S> = (state: RootState) => S;

type Option = {
    value: string;
    label: string;
};

type Payment = {
    amount: number;
    message: string;
};

export type OptionMultiSelectData = {
    value: string;
    label: string;
};

export type PieChartData = {
    name: string;
    value: number;
    [key: string]: string | number;
};
