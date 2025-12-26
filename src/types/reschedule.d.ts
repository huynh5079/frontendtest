export type CreateRescheduleParams = {
    newStartTime: string;
    newEndTime: string;
    reason: string;
};

export type RescheduleState = {
    list: GetAllReschedule[];
};

export type GetAllReschedule = {
    id: string;
    lessonId: string;
    requesterUserId: string;
    requesterName: string;
    oldStartTime: string; // ISO datetime
    oldEndTime: string; // ISO datetime
    newStartTime: string; // ISO datetime
    newEndTime: string; // ISO datetime
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
    responderUserId: string | null;
    responderName: string | null;
    respondedAt: string | null; // ISO datetime or null
};
