// Admin Cancel Class Types
export type ClassCancelReason =
    | "SystemError"
    | "TutorFault"
    | "StudentFault"
    | "MutualConsent"
    | "PolicyViolation"
    | "DuplicateClass"
    | "IncorrectInfo"
    | "Other";

export interface AdminCancelClassParams {
    reason: number; // 0-7 corresponding to ClassCancelReason enum
    note?: string;
}

export interface AdminCancelClassResponse {
    classId: string;
    newStatus: string;
    reason: string;
    refundedEscrowsCount: number;
    totalRefundedAmount: number;
    depositRefunded: boolean;
    depositRefundAmount?: number;
    message?: string;
}

export interface AdminCancelStudentEnrollmentParams {
    reason: number; // 0-7 corresponding to ClassCancelReason enum
    note?: string;
}

export interface AdminCancelStudentEnrollmentResponse {
    classId: string;
    newStatus: string;
    reason: string;
    refundedEscrowsCount: number;
    totalRefundedAmount: number;
    message?: string;
}

// Tutor Cancel/Complete Class Types
export interface TutorCancelClassParams {
    reason?: string;
}

export interface TutorCancelClassResponse {
    classId: string;
    newStatus: string;
    reason: string;
    refundedEscrowsCount: number;
    totalRefundedAmount: number;
    depositRefunded: boolean;
    depositRefundAmount?: number;
    message?: string;
}

export interface TutorCompleteClassResponse {
    message?: string;
}

