import type { ApplyrequestFindTutorForTutor, ApplyrequestFindTutorForTutorParams, RequestFindTutorForTutor, ResponseGetRequestFindTutorForTutor } from "../../../types/tutor";
import type { ResponseFromServer } from "../../../types/app";
export declare const getAllRequestFindTutorForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseGetRequestFindTutorForTutor<RequestFindTutorForTutor[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailRequestFindTutorForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<RequestFindTutorForTutor, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const applyRequestFindTutorForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, ApplyrequestFindTutorForTutorParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getApplyRequestFindTutorForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ApplyrequestFindTutorForTutor[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const withdrawApplyRequestFindTutorForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
