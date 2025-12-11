//booking
interface Schedule {
    dayOfWeek: number; // 0=CN, 1=T2, ..., 6=T7
    startTime: string; // định dạng "HH:mm:ss"
    endTime: string; // định dạng "HH:mm:ss"
}

interface CreateClassRequestParams {
    studentUserId: string | null;
    tutorId: string | null;
    subject: string;
    educationLevel: string;
    description: string;
    location: string;
    budget: number;
    mode: "Online" | "Offline";
    classStartDate: string; // ISO format: "YYYY-MM-DDTHH:mm:ssZ"
    specialRequirements: string;
    schedules: Schedule[];
}

interface UpdateInfoClassRequestParams {
    description: string;
    location: string;
    budget: number;
    mode: "Online" | "Offline" | string;
    onlineStudyLink: string | null;
}

interface UpdateScheduleClassRequestParams {
    schedules: Schedule[];
}

interface BookingTutorStudentState {
    lists: ClassRequests[];
    detail: ClassRequests | null;
}

export type ClassRequests = {
    id: string;
    description: string;
    location: string;
    specialRequirements: string;
    budget: number;
    onlineStudyLink: string | null;
    status: "Pending" | "Approved" | "Rejected" | string;
    mode: "Online" | "Offline" | string;
    classStartDate: string; // ISO date string
    expiryDate: string; // ISO date string
    createdAt: string; // ISO date string
    studentName: string;
    tutorId: string;
    tutorName: string;
    subject: string;
    educationLevel: string;
    schedules: Schedule[];
};

//learning schedule
export type GetLearingScheduleForStudentParams = {
    startDate: string;
    endDate: string;
};

export type learningScheduleForStudentState = {
    list: learningScheduleForStudent[] | null;
    detail: DetailScheduleLessonForStudent | null;
    listOneOnOne: OneOnOneTutorForStudent[] | null;
};

export type learningScheduleForStudent = {
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

export type OneOnOneTutorForStudent = {
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

export type DetailScheduleLessonForStudent = {
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
};

//apply request
export type ApplyRequestFindTutorForStudentState = {
    list: ApplyRequestFindTutorForStudent[] | null;
};

export type ApplyRequestFindTutorForStudent = {
    id: string;
    classRequestId: string;
    tutorId: string;
    status: string;
    createdAt: string;
    tutorName: string;
    tutorAvatarUrl: string;
};

//class
export type StudentClassState = {
    isEnrolled: boolean;
    assignedClasses: AssignedClassForStudent[] | null;
};

export type AssignClassParamsForStudent = {
    classId: string;
};

export type CheckAssignClassResponse = {
    classId: string;
    isEnrolled: boolean;
};

export type AssignedClassForStudent = {
    classId: string;
    classTitle: string;
    subject: string;
    educationLevel: string;
    tutorName: string;
    price: number;
    classStatus: string;
    paymentStatus: string;
    enrolledAt: string;
    location: string;
    mode: string;
    classStartDate: string;
};

//quiz
export type QuizForStudentState = {
    list: GetAllQuizForStudent[] | null;
    detail: GetDetailQuizForStudent | null;
    result: StudentQuizResult | null;
    historic: StudentQuizResult[] | null;
};

export type GetAllQuizForStudent = {
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
};

export type GetDetailQuizForStudent = {
    id: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    quizType: "Practice" | "Exam" | "Test" | string;
    maxAttempts: number;
    totalQuestions: number;
    currentAttemptCount: number;
    questions: QuizQuestion[];
    createdAt: string;
};

export type QuestionSubmit = {
    questionId: string;
    selectedAnswer: string;
};

export type SubmitQuizForStudentParams = {
    quizId: string;
    answers: QuestionSubmit[];
};

export interface AnswerDetail {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
}

export interface StudentQuizResult {
    attemptId: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    isPassed: boolean;
    submittedAt: string; // hoặc Date nếu bạn muốn convert
    answerDetails: AnswerDetail[];
}
