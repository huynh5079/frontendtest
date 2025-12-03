import type { ProvideTutor, RejectTutor, TutorForAdmin, TutorsForAdmin } from "../../../types/admin";
import type { ResponseFromServer } from "../../../types/app";
export declare const getAllTutorForAdminApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorsForAdmin[]>, number, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailTutorForAdminApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorForAdmin>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const acceptTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorForAdmin>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const rejectTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorForAdmin>, {
    tutorId: string;
    params: RejectTutor;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const provideTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorForAdmin>, {
    tutorId: string;
    params: ProvideTutor;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
