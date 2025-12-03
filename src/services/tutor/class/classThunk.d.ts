import type { CreateClassParams, StudentEnrolledClassForTutor, TutorClass, UpdateInfoClassForTutorParams, UpdateScheduleClassForTutorParmas } from "../../../types/tutor";
import type { ResponseFromServer } from "../../../types/app";
export declare const createClassApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, CreateClassParams, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllClassApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorClass[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailClassApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<TutorClass>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllStudentEnrolledClassForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<StudentEnrolledClassForTutor[]>, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateInfoClassForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, {
    classId: string;
    params: UpdateInfoClassForTutorParams;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateScheduleClassForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, {
    classId: string;
    params: UpdateScheduleClassForTutorParmas;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const deleteClassForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<{}>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
