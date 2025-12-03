import type { ClassRequests, CreateClassRequestParams, Schedule, UpdateInfoClassRequestParams } from "../../../types/student";
export declare const createClassRequestForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, CreateClassRequestParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllClassRequestForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ClassRequests[], void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailClassRequestForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ClassRequests, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateInfoClassRequestForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, {
    classRequestId: string;
    params: UpdateInfoClassRequestParams;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateScheduleClassRequestForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, {
    classRequestId: string;
    params: Schedule[];
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const cancelClassRequestForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
