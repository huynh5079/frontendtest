import { combineReducers } from "@reduxjs/toolkit";
// === Slice imports ===
import { appSlice } from "../services/app/appSlice";
import { authSlice } from "../services/auth/authSlice";
import { registerTutorSlice, } from "../services/auth/registerTutorSlice";
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
export default reducer;
