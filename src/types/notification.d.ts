export type NotificationState = {
    notifications: NotificationResponseItem[];
};

export type NotificationResponse<T> = {
    items: T;
    page: number;
    size: number;
    total: number;
};

export type NotificationResponseItem = {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    status: string;
    relatedEntityId: string;
    createdAt: string;
    updatedAt: string;
};
