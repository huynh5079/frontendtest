import type { CreateClassParams, UpdateInfoClassForTutorParams, UpdateScheduleClassForTutorParmas } from "../../../types/tutor";
export declare const createClassApi: (params: CreateClassParams) => Promise<any>;
export declare const getAllClassApi: () => Promise<any>;
export declare const getDetailClassApi: (classId: string) => Promise<any>;
export declare const getAllStudentEnrolledClassForTutorApi: () => Promise<any>;
export declare const updateInfoClassForTutorApi: (classId: string, params: UpdateInfoClassForTutorParams) => Promise<any>;
export declare const UpdateScheduleClassForTutorApi: (classId: string, params: UpdateScheduleClassForTutorParmas) => Promise<any>;
export declare const deleteClassForTutorApi: (classId: string) => Promise<any>;
