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
import { adminClassSlice } from "../services/admin/class/adminClassSlice";
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
import chatSlice from "../services/chat/chatSlice";
import lessonMaterialsSlice from "../services/lessonMaterials/lessonMaterialsSlice";
import videoAnalysisSlice from "../services/videoAnalysis/videoAnalysisSlice";
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
    QuizForTutorState,
    RequestFindTutorForTutorState,
    ScheduleForTutorState,
    TutorClassState,
    TutorDashboardState,
} from "../types/tutor";
import { TutorScheduleState } from "../types/booking";
import { UserState } from "../types/user";
import {
    ChildAccountState,
    ChildScheduleState,
    ParentClassState,
} from "../types/parent";
import {
    ApplyRequestFindTutorForStudentState,
    BookingTutorStudentState,
    learningScheduleForStudentState,
    QuizForStudentState,
    StudentClassState,
} from "../types/student";
import { PublicClassState } from "../types/public";
import { NotificationState } from "../types/notification";
import { WalletState } from "../types/wallet";
import { FeedbackState } from "../types/feedback";
import { FavoriteTutorState } from "../types/favorite-tutor";
import { ChatState } from "../types/chat";
import { childScheduleSlice } from "../services/parent/childSchedule/childScheduleSlice";
import { tutorQuizSlice } from "../services/tutor/quiz/tutorQuizSlice";
import { studentQuizSlice } from "../services/student/quiz/studentQuizSlice";
import { rescheduleSlice } from "../services/reschedule/rescheduleSlice";
import { RescheduleState } from "../types/reschedule";
import { parentClassSlice } from "../services/parent/class/parentClassSlice";
import commissionSlice from "../services/admin/commission/adminCommissionSlice";
import adminReportSlice from "../services/admin/report/adminReportSlice";
import adminDashboardSlice from "../services/admin/dashboard/adminDashboardSlice";
import adminTransactionSlice from "../services/admin/transaction/adminTransactionSlice";
import { attendanceSlice } from "../services/attendance/attendanceSlice";
import { AttendanceState } from "../types/attendance";
import { tutorDashboardSlice } from "../services/tutor/dashboard/tutorDashboardSlice";
import tutorReportSlice from "../services/tutor/report/tutorReportSlice";

// === Combine reducers ===
const reducer = combineReducers({
    app: appSlice.reducer,
    auth: authSlice.reducer,
    registerTutor: registerTutorSlice.reducer,
    tutorForAdmin: tutorForAdminSlice.reducer,
    studentForAdmin: studentForAdminSlice.reducer,
    parentForAdmin: parentForAdminSlice.reducer,
    adminClass: adminClassSlice.reducer,
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
    parentClass: parentClassSlice.reducer,
    notification: notificationSlice.reducer,
    wallet: walletSlice.reducer,
    feedback: feedbackSlice.reducer,
    favoriteTutor: favoriteTutorSlice.reducer,
    chat: chatSlice,
    childSchedule: childScheduleSlice.reducer,
    tutorQuiz: tutorQuizSlice.reducer,
    studentQuiz: studentQuizSlice.reducer,
    reschedule: rescheduleSlice.reducer,
    lessonMaterials: lessonMaterialsSlice,
    videoAnalysis: videoAnalysisSlice,
    commission: commissionSlice,
    adminReport: adminReportSlice,
    adminDashboard: adminDashboardSlice,
    adminTransaction: adminTransactionSlice,
    attendance: attendanceSlice.reducer,
    tutorDashboard: tutorDashboardSlice.reducer,
    tutorReport: tutorReportSlice,
});

// === Explicit RootState ===
export type RootState = {
    app: ReturnType<typeof appSlice.reducer>;
    auth: AuthState;
    registerTutor: RegisterTutorState;
    tutorForAdmin: TutorForAdminState;
    studentForAdmin: StudentForAdminState;
    parentForAdmin: ParentForAdminState;
    adminClass: {
        listClasses: any[];
        classDetail: any | null;
        studentsInClass: any[];
        loading: boolean;
        studentsLoading: boolean;
        error: string | null;
    };
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
    parentClass: ParentClassState;
    notification: NotificationState;
    wallet: WalletState;
    feedback: FeedbackState;
    favoriteTutor: FavoriteTutorState;
    chat: ChatState;
    childSchedule: ChildScheduleState;
    tutorQuiz: QuizForTutorState;
    studentQuiz: QuizForStudentState;
    reschedule: RescheduleState;
    lessonMaterials: {
        materials: any[];
        isLoading: boolean;
        error: string | null;
    };
    videoAnalysis: {
        currentAnalysis: any | null;
        isLoading: boolean;
        error: string | null;
        questionAnswers: any[];
        isAsking: boolean;
    };
    commission: {
        commission: any | null;
        loading: boolean;
        error: string | null;
    };
    adminReport: {
        reports: any[];
        reportDetail: any | null;
        total: number;
        loading: boolean;
        error: string | null;
    };
    adminDashboard: {
        statistics: any | null;
        loading: boolean;
        error: string | null;
    };
    adminTransaction: {
        transactions: any[];
        transactionDetail: any | null;
        total: number;
        loading: boolean;
        detailLoading: boolean;
        error: string | null;
    };
    attendance: AttendanceState;
    tutorDashboard: TutorDashboardState;
};

export default reducer;
