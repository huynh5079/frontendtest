import type { GetScheduleForTutorParams, ScheduleForTutor } from "../../../types/tutor";
import type { ResponseFromServer } from "../../../types/app";
export declare const getAllScheduleForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ScheduleForTutor[]>, GetScheduleForTutorParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
