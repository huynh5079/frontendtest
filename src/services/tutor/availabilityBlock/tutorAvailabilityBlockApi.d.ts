import type { CreateTutorAvailabilityParams, GetAllTutorAvailabilityParams } from "../../../types/tutorAvailabilityBlock";
export declare const getAllAvailabilityBlockForTutorApi: (params: GetAllTutorAvailabilityParams) => Promise<any>;
export declare const createAvailabilityBlockForTutorApi: (params: CreateTutorAvailabilityParams) => Promise<any>;
export declare const deleteAvailabilityBlockForTutorApi: (availabilityBlockId: string) => Promise<any>;
