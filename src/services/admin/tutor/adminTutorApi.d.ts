import type { RejectTutor, ProvideTutor } from "../../../types/admin";
export declare const getAllTutorForAdminApi: (page: number) => Promise<any>;
export declare const getDetailTutorForAdminApi: (tutorId: string) => Promise<any>;
export declare const acceptTutorApi: (tutorId: string) => Promise<any>;
export declare const rejectTutorApi: (tutorId: string, params: RejectTutor) => Promise<any>;
export declare const providetutorApi: (tutorId: string, params: ProvideTutor) => Promise<any>;
