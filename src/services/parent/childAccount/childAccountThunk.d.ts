import type { ResponseFromServer } from "../../../types/app";
import type { ChildAccount, ChildAccounts, CreateChildAccountParams } from "../../../types/parent";
export declare const createChildAccountApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, CreateChildAccountParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllChildAccountApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ChildAccounts[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailChildAccountApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ChildAccount>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
