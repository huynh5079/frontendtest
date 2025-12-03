//auth
export const selectUserLogin = (state) => {
    return state.auth.userInfoLogin;
};
export const selectIsAuthenticated = (state) => {
    return state.auth.isAuthenticated;
};
export const selectToken = (state) => {
    return state.auth.token;
};
//admin
//tutor
export const selectListTutorsForAdmin = (state) => {
    return state.tutorForAdmin.listTutors;
};
export const selectTutorForAdmin = (state) => {
    return state.tutorForAdmin.tutor;
};
//student
export const selectListStudentsForAdmin = (state) => {
    return state.studentForAdmin.listStudents;
};
export const selectStudentForAdmin = (state) => {
    return state.studentForAdmin.student;
};
//parent
export const selectListParentsForAdmin = (state) => {
    return state.parentForAdmin.listParents;
};
export const selectParentForAdmin = (state) => {
    return state.parentForAdmin.parent;
};
//tutor
//availability block
export const selectListAvailabilityBlockForTutor = (state) => {
    return state.availabilityBlockForTutor.listAvailabilityBlock;
};
//booking
export const selectListBookingForTutor = (state) => {
    return state.bookingForTutor.list;
};
export const selectDetailBookingForTutor = (state) => {
    return state.bookingForTutor.detail;
};
//schedule
export const selectListScheduleForTutor = (state) => {
    return state.scheduleForTutor.list;
};
//request
export const selectListRequestFindTutorForTutor = (state) => {
    return state.requestFindTutorForTutor.list;
};
export const selectDetailRequestFindTutorForTutor = (state) => {
    return state.requestFindTutorForTutor.detail;
};
export const selectListApplyRequestFindTutorForTutor = (state) => {
    return state.requestFindTutorForTutor.listApply;
};
//class
export const selectListTutorClass = (state) => {
    return state.tutorClass.list;
};
export const selectDetailTutorClass = (state) => {
    return state.tutorClass.detail;
};
export const selectListStudentEnrolledClassFortutor = (state) => {
    return state.tutorClass.listStudentEnrolled;
};
//public
//tutor
export const selectListPublicTutors = (state) => {
    return state.publicTutor.listTutors;
};
export const selectPublicTutor = (state) => {
    return state.publicTutor.tutor;
};
//class
export const selectListPublicClasses = (state) => {
    return state.publicClass.list;
};
export const selectDetailPublicClass = (state) => {
    return state.publicClass.detail;
};
//booking
//tutor_Schedule
export const selectListTutorSchedule = (state) => {
    return state.tutorSchedule.listTutorSchedule;
};
//user
export const selectProfileTutor = (state) => {
    return state.user.tutorProfile;
};
export const selectProfileParent = (state) => {
    return state.user.parentProfile;
};
export const selectProfileStudent = (state) => {
    return state.user.studentProfile;
};
//parent
//childAccount
export const selectListChildAccount = (state) => {
    return state.childAccount.listChildAccounts;
};
export const selectDetailChildAccount = (state) => {
    return state.childAccount.detailChildAccount;
};
//student
//booking tutor
export const selectListClassRequestForStudent = (state) => {
    return state.bookingTutorStudent.lists;
};
export const selectDetailClassRequestForStudent = (state) => {
    return state.bookingTutorStudent.detail;
};
//learning schedule
export const selectListLearningScheduleForStudent = (state) => {
    return state.learningScheduleForStudent.list;
};
//request find tutor
export const selectListApplyRequestFindTutorForStudent = (state) => {
    return state.requestFindTutorForStudent.list;
};
//class
export const selectIsEnrolledClassForStudent = (state) => {
    return state.studentClass.isEnrolled;
};
export const selectListAssignedClassForStudent = (state) => {
    return state.studentClass.assignedClasses;
};
//Notification
export const selectNotifications = (state) => {
    return state.notification.notifications;
};
//wallet
export const selectBalance = (state) => {
    return state.wallet.balance;
};
export const selectListTransactionHistory = (state) => {
    return state.wallet.transactionHistory;
};
//feedback
export const selectListFeedbackInTutorProfile = (state) => {
    return state.feedback.feedbackInTutorProfile;
};
//favoriteTutor
export const selectCheckFavoriteTutor = (state) => {
    return state.favoriteTutor.isFavorited;
};
