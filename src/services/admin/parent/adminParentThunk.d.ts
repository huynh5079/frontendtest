import type { ResponseFromServer } from "../../../types/app";
import type { ParentForAdmin, ParentsForAdmin } from "../../../types/admin";
export declare const getAllParentForAdminApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ParentsForAdmin[]>, number, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailParentForAdminApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ParentForAdmin>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
