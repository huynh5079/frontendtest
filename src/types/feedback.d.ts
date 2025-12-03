export type CreateFeedbackInTutorProfile = {
    comment: string;
    rating: number;
};

export type CreateFeedbackInClass = {
    classId: string;
    toUserId: string;
    comment: string;
    rating: number;
};

export type FeedbackState = {
    feedbackInTutorProfile: FeedbackInTutorProfileResponse | null;
};

export type FeedbackInTutorProfileResponse = {
    items: FeedbackInTutorProfileItem[];
    paging: FeedbackPaging;
};

export type FeedbackInTutorProfileItem = {
    id: string;
    classId: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
};

export type FeedbackPaging = {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};
