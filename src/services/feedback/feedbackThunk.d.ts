import type { CreateFeedbackInClass, CreateFeedbackInTutorProfile, FeedbackInTutorProfileResponse } from "../../types/feedback";
import type { ResponseFromServer } from "../../types/app";
export declare const createFeedbackInTutorProfileApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, {
    tutorUserId: string;
    params: CreateFeedbackInTutorProfile;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const createFeedbackInClassApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, CreateFeedbackInClass, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getAllFeedbackInTutorProfileApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<FeedbackInTutorProfileResponse>, {
    tutorUserId: string;
    page: number;
    pageSize: number;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
