import type { ResponseFromServer } from "../../../types/app";
import type { GetLearingScheduleForStudentParams, learningScheduleForStudent } from "../../../types/student";
export declare const getAllLearingScheduleForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<learningScheduleForStudent[]>, GetLearingScheduleForStudentParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
