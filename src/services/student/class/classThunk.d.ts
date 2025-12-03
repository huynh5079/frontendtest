import type { ResponseFromServer } from "../../../types/app";
import type { AssignClassParamsForStudent, AssignedClassForStudent, CheckAssignClassResponse } from "../../../types/student";
export declare const assignClassForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, AssignClassParamsForStudent, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const withdrawClassForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const checkAssignClassForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<CheckAssignClassResponse>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllAssignedClassForStudentApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<AssignedClassForStudent[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
