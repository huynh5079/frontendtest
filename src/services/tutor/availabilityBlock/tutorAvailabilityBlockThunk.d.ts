import type { ResponseFromServer } from "../../../types/app";
import type { AvailabilityBlocksForTutor, CreateTutorAvailabilityParams, GetAllTutorAvailabilityParams } from "../../../types/tutorAvailabilityBlock";
export declare const getAllAvailabilityBlockForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<AvailabilityBlocksForTutor[], GetAllTutorAvailabilityParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const createAvailabilityBlockForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, CreateTutorAvailabilityParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const deleteAvailabilityBlockForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
