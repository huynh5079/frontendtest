import type { BookingForTutor } from "../../../types/tutor";
export declare const getAllBookingForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<BookingForTutor[], void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const getDetailBookingForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<BookingForTutor, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const acceptBookingForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const rejectBookingForTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
