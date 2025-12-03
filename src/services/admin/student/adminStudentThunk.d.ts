import type { StudentForAdmin, StudentsForAdmin } from "../../../types/admin";
import type { ResponseFromServer } from "../../../types/app";
export declare const getAllStudentForAdminApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<StudentsForAdmin[]>, number, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailStudentForAdminApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<StudentForAdmin>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
