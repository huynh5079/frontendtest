import type {
    ParentForAdmin,
    ParentsForAdmin,
    StudentForAdmin,
    StudentsForAdmin,
    TutorForAdmin,
    TutorsForAdmin,
} from "../types/admin";
import type { Selector } from "../types/app";
import type { TutorSchedules } from "../types/booking";
import type { CheckFavoriteTutorRessponse } from "../types/favorite-tutor";
import type { FeedbackInTutorProfileResponse } from "../types/feedback";
import type { NotificationResponseItem } from "../types/notification";
import type { ChildAccount, ChildAccounts } from "../types/parent";
import type { PublicClass } from "../types/public";
import type {
    ApplyRequestFindTutorForStudent,
    AssignedClassForStudent,
    ClassRequests,
    learningScheduleForStudent,
} from "../types/student";
import type {
    ApplyrequestFindTutorForTutor,
    BookingForTutor,
    PublicTutor,
    PublicTutors,
    RequestFindTutorForTutor,
    ResponsePublicTutors,
    ScheduleForTutor,
    StudentEnrolledClassForTutor,
    TutorClass,
    TutorProfile,
} from "../types/tutor";
import type { AvailabilityBlocksForTutor } from "../types/tutorAvailabilityBlock";
import type {
    ParentProfile,
    ProfileStudent,
    UserInfoLogin,
} from "../types/user";
import type {
    WalletBalance,
    WalletTransactionHistoryResponse,
} from "../types/wallet";
import type { RootState } from "./reducer";

//auth
export const selectUserLogin: Selector<UserInfoLogin | null> = (
    state: RootState,
) => {
    return state.auth.userInfoLogin;
};

export const selectIsAuthenticated: Selector<boolean> = (state: RootState) => {
    return state.auth.isAuthenticated;
};

export const selectToken: Selector<string | null> = (state: RootState) => {
    return state.auth.token;
};

//admin
//tutor
export const selectListTutorsForAdmin: Selector<TutorsForAdmin[] | null> = (
    state: RootState,
) => {
    return state.tutorForAdmin.listTutors;
};

export const selectTutorForAdmin: Selector<TutorForAdmin | null> = (
    state: RootState,
) => {
    return state.tutorForAdmin.tutor;
};
//student
export const selectListStudentsForAdmin: Selector<StudentsForAdmin[] | null> = (
    state: RootState,
) => {
    return state.studentForAdmin.listStudents;
};

export const selectStudentForAdmin: Selector<StudentForAdmin | null> = (
    state: RootState,
) => {
    return state.studentForAdmin.student;
};
//parent
export const selectListParentsForAdmin: Selector<ParentsForAdmin[] | null> = (
    state: RootState,
) => {
    return state.parentForAdmin.listParents;
};

export const selectParentForAdmin: Selector<ParentForAdmin | null> = (
    state: RootState,
) => {
    return state.parentForAdmin.parent;
};

//tutor
//availability block
export const selectListAvailabilityBlockForTutor: Selector<
    AvailabilityBlocksForTutor[] | null
> = (state: RootState) => {
    return state.availabilityBlockForTutor.listAvailabilityBlock;
};

//booking
export const selectListBookingForTutor: Selector<BookingForTutor[] | null> = (
    state: RootState,
) => {
    return state.bookingForTutor.list;
};

export const selectDetailBookingForTutor: Selector<BookingForTutor | null> = (
    state: RootState,
) => {
    return state.bookingForTutor.detail;
};

//schedule
export const selectListScheduleForTutor: Selector<ScheduleForTutor[] | null> = (
    state: RootState,
) => {
    return state.scheduleForTutor.list;
};

//request
export const selectListRequestFindTutorForTutor: Selector<
    RequestFindTutorForTutor[] | null
> = (state: RootState) => {
    return state.requestFindTutorForTutor.list;
};

export const selectDetailRequestFindTutorForTutor: Selector<
    RequestFindTutorForTutor | null
> = (state: RootState) => {
    return state.requestFindTutorForTutor.detail;
};

export const selectListApplyRequestFindTutorForTutor: Selector<
    ApplyrequestFindTutorForTutor[] | null
> = (state: RootState) => {
    return state.requestFindTutorForTutor.listApply;
};

//class
export const selectListTutorClass: Selector<TutorClass[] | null> = (
    state: RootState,
) => {
    return state.tutorClass.list;
};

export const selectDetailTutorClass: Selector<TutorClass | null> = (
    state: RootState,
) => {
    return state.tutorClass.detail;
};

export const selectListStudentEnrolledClassFortutor: Selector<
    StudentEnrolledClassForTutor[] | null
> = (state: RootState) => {
    return state.tutorClass.listStudentEnrolled;
};

//public
//tutor
export const selectListPublicTutors: Selector<
    ResponsePublicTutors<PublicTutors[]> | null
> = (state: RootState) => {
    return state.publicTutor.listTutors;
};

export const selectPublicTutor: Selector<PublicTutor | null> = (
    state: RootState,
) => {
    return state.publicTutor.tutor;
};

//class
export const selectListPublicClasses: Selector<PublicClass[] | null> = (
    state: RootState,
) => {
    return state.publicClass.list;
};

export const selectDetailPublicClass: Selector<PublicClass | null> = (
    state: RootState,
) => {
    return state.publicClass.detail;
};

//booking
//tutor_Schedule
export const selectListTutorSchedule: Selector<TutorSchedules[] | null> = (
    state: RootState,
) => {
    return state.tutorSchedule.listTutorSchedule;
};

//user
export const selectProfileTutor: Selector<TutorProfile | null> = (
    state: RootState,
) => {
    return state.user.tutorProfile;
};

export const selectProfileParent: Selector<ParentProfile | null> = (
    state: RootState,
) => {
    return state.user.parentProfile;
};

export const selectProfileStudent: Selector<ProfileStudent | null> = (
    state: RootState,
) => {
    return state.user.studentProfile;
};

//parent
//childAccount
export const selectListChildAccount: Selector<ChildAccounts[] | null> = (
    state: RootState,
) => {
    return state.childAccount.listChildAccounts;
};

export const selectDetailChildAccount: Selector<ChildAccount | null> = (
    state: RootState,
) => {
    return state.childAccount.detailChildAccount;
};

//student
//booking tutor
export const selectListClassRequestForStudent: Selector<
    ClassRequests[] | null
> = (state: RootState) => {
    return state.bookingTutorStudent.lists;
};

export const selectDetailClassRequestForStudent: Selector<
    ClassRequests | null
> = (state: RootState) => {
    return state.bookingTutorStudent.detail;
};

//learning schedule
export const selectListLearningScheduleForStudent: Selector<
    learningScheduleForStudent[] | null
> = (state: RootState) => {
    return state.learningScheduleForStudent.list;
};

//request find tutor
export const selectListApplyRequestFindTutorForStudent: Selector<
    ApplyRequestFindTutorForStudent[] | null
> = (state: RootState) => {
    return state.requestFindTutorForStudent.list;
};

//class
export const selectIsEnrolledClassForStudent: Selector<boolean> = (
    state: RootState,
) => {
    return state.studentClass.isEnrolled;
};

export const selectListAssignedClassForStudent: Selector<
    AssignedClassForStudent[] | null
> = (state: RootState) => {
    return state.studentClass.assignedClasses;
};

//Notification
export const selectNotifications: Selector<NotificationResponseItem[]> = (
    state: RootState,
) => {
    return state.notification.notifications;
};

//wallet
export const selectBalance: Selector<WalletBalance | null> = (
    state: RootState,
) => {
    return state.wallet.balance;
};

export const selectListTransactionHistory: Selector<
    WalletTransactionHistoryResponse | null
> = (state: RootState) => {
    return state.wallet.transactionHistory;
};

//feedback
export const selectListFeedbackInTutorProfile: Selector<
    FeedbackInTutorProfileResponse | null
> = (state: RootState) => {
    return state.feedback.feedbackInTutorProfile;
};

//favoriteTutor
export const selectCheckFavoriteTutor: Selector<
    CheckFavoriteTutorRessponse | null
> = (state: RootState) => {
    return state.favoriteTutor.isFavorited;
};
