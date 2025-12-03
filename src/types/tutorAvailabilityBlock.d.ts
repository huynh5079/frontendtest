export type GetAllTutorAvailabilityParams = {
    startTime: string;
    endTime: string;
};

export interface RecurrenceRule {
    frequency?: "Daily" | "Weekly" | "Monthly" | "Yearly";
    daysOfWeek?: string[]; // 0 = Chủ nhật, 1–6 = Thứ 2 đến Thứ 7
    untilDate?: string; // ISO datetime string (ví dụ: "2025-11-30T23:59:59")
}

export type CreateTutorAvailabilityParams = {
    title: string;
    startTime: string; // dạng "HH:mm:ss"
    endTime: string; // dạng "HH:mm:ss"
    notes?: string;
    recurrenceRule?: RecurrenceRule | null;
};

export type AvailabilityBlockForTutorState = {
    listAvailabilityBlock: AvailabilityBlocksForTutor[];
};

export type AvailabilityBlocksForTutor = {
    id: string;
    tutorId: string;
    title: string;
    startTime: string;
    endTime: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
};
