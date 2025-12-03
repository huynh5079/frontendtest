import type { ResponseFromServer } from "../../types/app";
import type { TutorProfile } from "../../types/tutor";
import type { ParentProfile, ProfileStudent, UpdateStudentProfileParams } from "../../types/user";
export declare const getProfileTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorProfile>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getProfileParentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ParentProfile>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getProfileStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ProfileStudent>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateProfileStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, UpdateStudentProfileParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
