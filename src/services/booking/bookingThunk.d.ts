import type { GetAllTutorScheduleParams, TutorSchedules } from "../../types/booking";
import type { ResponseFromServer } from "../../types/app";
export declare const getAllTutorScheduleApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorSchedules[]>, GetAllTutorScheduleParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
