import type { ResponseFromServer } from "../../../types/app";
import type { PublicTutor, PublicTutors, ResponsePublicTutors } from "../../../types/tutor";
export declare const publicGetAllTutorsApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<ResponsePublicTutors<PublicTutors[]>>, number, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const publicGetDetailTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<PublicTutor>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
