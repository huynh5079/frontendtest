import type { CreateClassRequestParams, Schedule, UpdateInfoClassRequestParams } from "../../../types/student";
export declare const createClassRequestForStudentApi: (params: CreateClassRequestParams) => Promise<any>;
export declare const getAllClassRequestForStudentApi: () => Promise<any>;
export declare const getDetailClassRequestForStudentApi: (requestId: string) => Promise<any>;
export declare const updateInfoClassRequestForStudentApi: (requestId: string, params: UpdateInfoClassRequestParams) => Promise<any>;
export declare const UpdateScheduleClassRequestForStudentApi: (requestId: string, params: Schedule[]) => Promise<any>;
export declare const cancelClassRequestForStudentApi: (requestId: string) => Promise<any>;
