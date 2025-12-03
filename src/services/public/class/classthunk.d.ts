import type { ResponseFromServer } from "../../../types/app";
import type { PublicClass } from "../../../types/public";
export declare const publicGetAllClassesApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<PublicClass[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const publicGetDetailClassApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<PublicClass>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
