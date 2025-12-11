import type { AdminCancelClassParams, AdminCancelStudentEnrollmentParams } from "../../../types/class";

export declare const adminCancelClassApi: (
    classId: string,
    params: AdminCancelClassParams
) => Promise<any>;

export declare const adminCancelStudentEnrollmentApi: (
    classId: string,
    studentId: string,
    params: AdminCancelStudentEnrollmentParams
) => Promise<any>;

