import type { CreateFeedbackInClass, CreateFeedbackInTutorProfile } from "../../types/feedback";
export declare const createFeedbackInTutorProfileApi: (tutorUserId: string, params: CreateFeedbackInTutorProfile) => Promise<any>;
export declare const createFeedbackInClassApi: (params: CreateFeedbackInClass) => Promise<any>;
export declare const getAllFeedbackInTutorProfileApi: (tutorUserId: string, page: number, pageSize: number) => Promise<any>;
