import { PublicClass } from "./public";

interface Tutor {
    id: number;
    name: string;
    profileImage: string;
    specialty: string[];
    rating: number;
    totalReviews: number;
}

interface RatingStarsProps {
    rating: number;
}

interface TutorCardProps {
    tutor: PublicTutors;
}

export type PublicTutorState = {
    listTutors: ResponsePublicTutors | null;
    list3Tutors: PublicTutors[] | null;
    tutor: PublicTutor | null;
    listTutorClasses: PublicClass[] | null;
};

export type ResponsePublicTutors<T> = {
    items: T;
    page: number;
    size: number;
    total: number;
};

export type PublicTutors = {
    tutorId: string;
    username: string;
    email: string;
    teachingSubjects: string;
    teachingLevel: string;
    createDate: string;
    avatarUrl: string;
    address?: string | null; // Địa chỉ gia sư
    rating: number | null;
    feedbackCount: number;
};

export type PublicTutor = {
    tutorId: string;
    tutorProfileId: string;
    username: string;
    email: string;
    avatarUrl: string;
    gender: "male" | "female" | "other" | null;
    dateOfBirth: string | null;
    address: string | null; // Địa chỉ gia sư để học sinh xem khi đặt
    educationLevel: string;
    university: string;
    major: string;
    teachingExperienceYears: number;
    teachingSubjects: string;
    teachingLevel: string;
    bio: string;
    rating: number | null;
    createDate: string;
};

// Profile
type Gender = "male" | "female" | "other";
type TeachingLevel =
    | "Tiểu học"
    | "Trung học cơ sở"
    | "Trung học phổ thông"
    | string;

interface Certificate {
    id: string;
    url: string;
    fileName: string;
    contentType: string; // e.g. "image/png", "application/pdf"
    fileSize: number; // bytes
}

interface IdentityDocument {
    id: string;
    url: string;
    fileName: string;
    contentType: string;
    fileSize: number;
}

export type TutorProfile = {
    tutorProfileId: string;
    bio: string | null;
    educationLevel: string | null;
    university: string | null;
    reviewStatus: string | null;
    major: string | null;
    teachingExperienceYears: number | null;
    teachingSubjects: string | null;
    teachingLevel: TeachingLevel | null;
    specialSkills: string | null;
    rating: number | null;
    certificates: Certificate[];
    identityDocuments: IdentityDocument[];
    username: string;
    email: string;
    phone: string;
    gender: Gender | null;
    address: string | null;
    dateOfBirth: string | null; // ISO date string or null
    avatarUrl: string | null;
};

export type TutorProfileUpdateParams = {
    username: string;
    phone: string;
    gender: Gender | null;
    address: string | null;
    bio: string | null;
    educationLevel: string | null;
    university: string | null;
    major: string | null;
    teachingExperienceYears: number | null;
    teachingSubjects: string | null;
    teachingLevel: TeachingLevel | null;
    specialSkills: string | null;
    avatarFile: File | null;
    newCertificates: Certificate[];
    certificatesFiles?: File[];
};

//booking
export type BookingForTutorState = {
    list: BookingForTutor[] | null;
    detail: BookingForTutor | null;
};

export type AcceptBookingForTutorParams = {
    meetingLink: string;
};

export type BookingForTutor = {
    id: string;
    description: string;
    location: string;
    specialRequirements: string;
    budget: number;
    onlineStudyLink: string | null;
    status: "Pending" | "Approved" | "Rejected" | "Ongoing" | string;
    mode: "Online" | "Offline" | string;
    classStartDate: string; // ISO date string
    expiryDate: string; // ISO date string
    createdAt: string; // ISO date string
    studentName: string;
    tutorName: string;
    subject: string;
    educationLevel: string;
    schedules: Schedule[];
};

//schedule
export type GetScheduleForTutorParams = {
    tutorProfileId: string;
    startDate: string;
    endDate: string;
};

export type ScheduleForTutorState = {
    list: ScheduleForTutor[] | null;
    detail: DetailScheduleLessonForTutor | null;
    listOneOnOne: OneOnOneStudentForTutor[] | null;
};

export type ScheduleForTutor = {
    id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    entryType: string;
    lessonId: string;
    classId: string;
    title: string | null;
    attendanceStatus: string | null;
};

export type OneOnOneStudentForTutor = {
    profileId: string;
    userId: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
};

export type StudentInClass = {
    studentId: string;
    studentUserId: string;
    fullName: string;
    avatarUrl: string;
    isPresent: boolean;
    attendanceStatus: string | null;
    note: string | null;
};

export type DetailScheduleLessonForTutor = {
    id: string;
    title: string | null;
    lessonTitle: string;
    status: string;
    startTime: string;
    endTime: string;
    classId: string;
    classTitle: string;
    mode: string;
    subject: string;
    educationLevel: string;
    location: string | null;
    onlineStudyLink: string | null;
    tutorUserId: string;
    students: StudentInClass[];
};

//request
export type ResponseGetRequestFindTutorForTutor<T> = {
    items: T;
    totalCount: number;
    page: number;
    pageSize: number;
};

export type RequestFindTutorForTutorState = {
    list: RequestFindTutorForTutor[] | null;
    detail: RequestFindTutorForTutor | null;
    listApply: ApplyrequestFindTutorForTutor[] | null;
};

export type RequestFindTutorForTutor = {
    id: string;
    description: string;
    location: string;
    specialRequirements: string;
    budget: number;
    onlineStudyLink: string | null;
    status: "Pending" | "Approved" | "Rejected" | "Ongoing" | string;
    mode: "Online" | "Offline" | string;
    classStartDate: string; // ISO date string
    expiryDate: string; // ISO date string
    createdAt: string; // ISO date string
    studentName: string;
    tutorName: string;
    subject: string;
    educationLevel: string;
    schedules: Schedule[];
};

//apply
export type ApplyrequestFindTutorForTutorParams = {
    classRequestId: string;
};

export type ApplyrequestFindTutorForTutor = {
    id: string;
    classRequestId: string;
    tutorId: string;
    status: string;
    createdAt: string;
    tutorName: string;
    tutorAvatarUrl: string;
};

//class
interface Schedule {
    dayOfWeek: number; // 0=CN, 1=T2, ..., 6=T7
    startTime: string; // định dạng "HH:mm:ss"
    endTime: string; // định dạng "HH:mm:ss"
}

interface ScheduleString {
    dayOfWeek: string; // 0=CN, 1=T2, ..., 6=T7
    startTime: string; // định dạng "HH:mm:ss"
    endTime: string; // định dạng "HH:mm:ss"
}

export type CreateClassParams = {
    subject: string;
    educationLevel: string;
    description: string;
    location: string | null;
    price: number;
    mode: "Online" | "Offline";
    onlineStudyLink: string | null;
    classStartDate: string; // ISO format: "YYYY-MM-DDTHH:mm:ssZ"
    title: string;
    scheduleRules: Schedule[];
    studentLimit: number;
};

export type TutorClassState = {
    list: TutorClass[] | null;
    detail: TutorClass | null;
    listStudentEnrolled: StudentEnrolledClassForTutor[] | null;
};

export type TutorClass = {
    id: string;
    tutorProfileId: string;
    tutorName: string;
    subject: string;
    educationLevel: string;
    description: string;
    location: string | null;
    price: number;
    mode: "Online" | "Offline";
    onlineStudyLink: string | null;
    classStartDate: string; // ISO format: "YYYY-MM-DDTHH:mm:ssZ"
    onlineStudyLink: string | null;
    title: string;
    scheduleRules: ScheduleString[];
    currentStudentCount: number;
    studentLimit: number;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type StudentEnrolledClassForTutor = {
    studentId: string;
    studentUserId?: string | null; // UserId của học sinh (để nhắn tin)
    studentName: string;
    studentEmail: string;
    StudentAvatarUrl: string;
    studentPhone: string;
    approvedStatus: string;
    paymentStatus: string;
    enrolledAt: string;
    createdAt: string;
};

export type UpdateInfoClassForTutorParams = {
    title: string;
    description: string;
    price: number;
    mode: "Online" | "Offline";
    location: string | null;
    onlineStudyLink: string | null;
    studentLimit: number;
};

export type UpdateScheduleClassForTutorParmas = {
    scheduleRules: Schedule[];
};

//attendance
export type MarkAttendance11Params = {
    lessonId: string;
    studentId: string;
    status: "Present" | "Absent";
    notes: string;
};

export type MarkAttendanceManyStudentsParams = {
    notes: string;
    studentStatus: {
        [studentId: string]: "Present" | "Late" | "Absent";
    };
};

//quiz
export type CreateQuizForTutorParams = {
    lessonId: string;
    quizFile: File;
    quizType: string;
    maxAttempts: number;
};

export type QuizForTutorState = {
    list: GetAllQuizForTutor[] | null;
    detail: GetDetailQuizForTutor | null;
};

export type GetAllQuizForTutor = {
    id: string;
    title: string;
    description: string;
    totalQuestions: number;
    timeLimit: number;
    passingScore: number;
    quizType: string;
    maxAttempts: number;
    isActive: boolean;
    createdAt: string;
};

export type QuizQuestion = {
    id: string;
    questionText: string;
    imageUrl: string | null;
    orderIndex: number;
    points: number;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: "A" | "B" | "C" | "D";
    explanation: string;
};

export type GetDetailQuizForTutor = {
    id: string;
    lessonId: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    isActive: boolean;
    quizType: "Practice" | "Exam" | "Test" | string;
    maxAttempts: number;
    totalQuestions: number;
    questions: QuizQuestion[];
    createdAt: string;
};

export type UpdateQuizQuesstionForTutor = {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: "A" | "B" | "C" | "D";
    explanation: string;
};

//
export type TutorDashboardState = {
    totalStatistics: TutorTotalStatistics | null;
    monthlyIncome: TutorMonthlyIncome | null;
    monthlyLessons: TutorMonthlyLessons | null;
};

export type TutorTotalStatistics = {
    totalActiveClasses: number;
    totalStudents: number;
    monthlyIncome: number;
    lessonsThisWeek: number;
    lessonsThisMonth: number;
    activeStudents: number;
    newStudentsThisMonth: number;
};

export type MonthlyIncomeData = {
    month: number;
    amount: number;
};

export type MonthlyLessonsData = {
    month: number;
    lessonCount: number;
};

export type TutorMonthlyIncome = {
    year: string; // Định dạng "YYYY-MM"
    totalIncome: number;
    monthlyData: MonthlyIncomeData[];
};

export type TutorMonthlyLessons = {
    year: string; // Định dạng "YYYY-MM"
    totalLessons: number;
    monthlyData: MonthlyLessonsData[];
};
