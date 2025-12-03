import type { ResponseFromServer } from "../../../types/app";
import type { ApplyRequestFindTutorForStudent } from "../../../types/student";
export declare const getAllApplyRequestFindTutorForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ApplyRequestFindTutorForStudent[]>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const acceptApplyRequestFindTutorForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const rejectApplyRequestFindTutorForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
