export interface AttendanceState {
    studentAttendances: StudentAttendance | null;
    parentAttendances: StudentAttendance | null;
    tutorAttendanceOverview: TutorAttendanceOverview | null;
    studentAttendanceDetailForTutor: StudentAttendanceDetailForTutor | null;
    lessonAttendanceDetailForTutor: LessonAttendanceDetailForTutor | null;
}

export type LessonStatus = "Present" | "Late" | "Absent" | "Excused" | null;

//student, parent
export interface LessonAttendance {
    lessonId: string;
    lessonNumber: number;
    lessonDate: string;
    startTime: string;
    endTime: string;
    status: LessonStatus;
    notes: string | null;
}

export interface StudentAttendance {
    studentId: string;
    studentUserId: string;
    studentName: string;
    email: string;
    avatarUrl: string;

    classId: string;
    className: string;

    totalLessons: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;

    attendanceRate: number;
    lessons: LessonAttendance[];
}

//tutor
export interface StudentAttendanceForTutor {
    studentId: string;
    studentUserId: string;
    studentName: string;
    email: string;
    avatarUrl: string;

    totalLessons: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;
    notMarkedCount: number;

    attendanceRate: number; // %
}

export interface LessonAttendanceForTutor {
    lessonId: string;
    lessonNumber: number;

    lessonDate: string; // ISO string
    startTime: string; // ISO string
    endTime: string; // ISO string

    totalStudents: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;
    notMarkedCount: number;

    attendanceRate: number; // %
}
export interface TutorAttendanceOverview {
    classId: string;
    className: string;
    subject: string;

    totalStudents: number;
    totalLessons: number;

    students: StudentAttendanceForTutor[];
    lessons: LessonAttendanceForTutor[];
}

//student detail
export interface StudentLessonAttendance {
    lessonId: string;
    lessonNumber: number;

    lessonDate: string; // ISO string
    startTime: string; // ISO string
    endTime: string; // ISO string

    status: LessonAttendanceStatus;
    notes: string | null;
}

export interface StudentAttendanceDetailForTutor {
    studentId: string;
    studentUserId: string;
    studentName: string;
    email: string;
    avatarUrl: string;

    classId: string;
    className: string;

    totalLessons: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;

    attendanceRate: number; // %

    lessons: StudentLessonAttendance[];
}

//lesson detail
export interface LessonStudentAttendance {
    studentId: string;
    studentUserId: string;
    studentName: string;
    email: string;
    avatarUrl: string;

    status: AttendanceStatus;
    notes: string | null;
}

export interface LessonAttendanceDetailForTutor {
    lessonId: string;
    lessonNumber: number;

    lessonDate: string; // ISO string
    startTime: string; // ISO string
    endTime: string; // ISO string

    classId: string;
    className: string;

    totalStudents: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;

    attendanceRate: number; // %

    students: LessonStudentAttendance[];
}
