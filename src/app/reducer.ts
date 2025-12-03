import { combineReducers } from "@reduxjs/toolkit";

// === Slice imports ===
import { appSlice } from "../services/app/appSlice";
import { authSlice } from "../services/auth/authSlice";
import {
    registerTutorSlice,
    RegisterTutorState,
} from "../services/auth/registerTutorSlice";
import { tutorForAdminSlice } from "../services/admin/tutor/adminTutorSlice";
import { studentForAdminSlice } from "../services/admin/student/adminStudentSlice";
import { parentForAdminSlice } from "../services/admin/parent/adminParentSlice";
import { availabilityBlockForTutorSlice } from "../services/tutor/availabilityBlock/tutorAvailabilityBlockSlice";
import { publicTutorSlice } from "../services/public/tutor/tutorSlice";
import { tutorScheduleSlice } from "../services/booking/bookingSlice";
import { userSlice } from "../services/user/userSlice";
import { childAccountSlice } from "../services/parent/childAccount/childAccountSlice";
import { bookingTutorStudentSlice } from "../services/student/bookingTutor/bookingTutorSlice";
import { bookingForTutorSlice } from "../services/tutor/booking/bookingSlice";
import { scheduleForTutorSlice } from "../services/tutor/schedule/tutorScheduleSlice";
import { learningScheduleForStudentSlice } from "../services/student/learningSchedule/learningScheduleSlice";
import { requestFindTutorForTutorSlice } from "../services/tutor/requestFindTutor/requestFindTutorSlice";
import { requestFindTutorForStudentSlice } from "../services/student/requestFindTutor/requestFindTutorSlice";
import { tutorClassSlice } from "../services/tutor/class/classSlice";
import { publicClassSlice } from "../services/public/class/classSlice";
import { studentClassSlice } from "../services/student/class/classSlice";
import { notificationSlice } from "../services/notification/notificationSlice";
import { walletSlice } from "../services/wallet/walletSlice";
import { feedbackSlice } from "../services/feedback/feedbackSlice";
import { favoriteTutorSlice } from "../services/favoriteTutor/favoriteTutorSlice";
import { AuthState } from "../types/auth";
import {
    ParentForAdminState,
    StudentForAdminState,
    TutorForAdminState,
} from "../types/admin";
import { AvailabilityBlockForTutorState } from "../types/tutorAvailabilityBlock";
import {
    BookingForTutorState,
    PublicTutorState,
    RequestFindTutorForTutorState,
    ScheduleForTutorState,
    TutorClassState,
} from "../types/tutor";
import { TutorScheduleState } from "../types/booking";
import { UserState } from "../types/user";
import { ChildAccountState } from "../types/parent";
import {
    ApplyRequestFindTutorForStudentState,
    BookingTutorStudentState,
    learningScheduleForStudentState,
    StudentClassState,
} from "../types/student";
import { PublicClassState } from "../types/public";
import { NotificationState } from "../types/notification";
import { WalletState } from "../types/wallet";
import { FeedbackState } from "../types/feedback";
import { FavoriteTutorState } from "../types/favorite-tutor";

// === Combine reducers ===
const reducer = combineReducers({
    app: appSlice.reducer,
    auth: authSlice.reducer,
    registerTutor: registerTutorSlice.reducer,
    tutorForAdmin: tutorForAdminSlice.reducer,
    studentForAdmin: studentForAdminSlice.reducer,
    parentForAdmin: parentForAdminSlice.reducer,
    availabilityBlockForTutor: availabilityBlockForTutorSlice.reducer,
    publicTutor: publicTutorSlice.reducer,
    tutorSchedule: tutorScheduleSlice.reducer,
    user: userSlice.reducer,
    childAccount: childAccountSlice.reducer,
    bookingTutorStudent: bookingTutorStudentSlice.reducer,
    bookingForTutor: bookingForTutorSlice.reducer,
    scheduleForTutor: scheduleForTutorSlice.reducer,
    learningScheduleForStudent: learningScheduleForStudentSlice.reducer,
    requestFindTutorForTutor: requestFindTutorForTutorSlice.reducer,
    requestFindTutorForStudent: requestFindTutorForStudentSlice.reducer,
    tutorClass: tutorClassSlice.reducer,
    publicClass: publicClassSlice.reducer,
    studentClass: studentClassSlice.reducer,
    notification: notificationSlice.reducer,
    wallet: walletSlice.reducer,
    feedback: feedbackSlice.reducer,
    favoriteTutor: favoriteTutorSlice.reducer,
});

// === Explicit RootState ===
export type RootState = {
    app: ReturnType<typeof appSlice.reducer>;
    auth: AuthState;
    registerTutor: RegisterTutorState;
    tutorForAdmin: TutorForAdminState;
    studentForAdmin: StudentForAdminState;
    parentForAdmin: ParentForAdminState;
    availabilityBlockForTutor: AvailabilityBlockForTutorState;
    publicTutor: PublicTutorState;
    tutorSchedule: TutorScheduleState;
    user: UserState;
    childAccount: ChildAccountState;
    bookingTutorStudent: BookingTutorStudentState;
    bookingForTutor: BookingForTutorState;
    scheduleForTutor: ScheduleForTutorState;
    learningScheduleForStudent: learningScheduleForStudentState;
    requestFindTutorForTutor: RequestFindTutorForTutorState;
    requestFindTutorForStudent: ApplyRequestFindTutorForStudentState;
    tutorClass: TutorClassState;
    publicClass: PublicClassState;
    studentClass: StudentClassState;
    notification: NotificationState;
    wallet: WalletState;
    feedback: FeedbackState;
    favoriteTutor: FavoriteTutorState;
};

export default reducer;
