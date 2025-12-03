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
    tutor: Tutor;
}

export type PublicTutorState = {
    listTutors: ResponsePublicTutors | null;
    tutor: PublicTutor | null;
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
};

export type PublicTutor = {
    tutorId: string;
    tutorProfileId: string;
    username: string;
    email: string;
    avatarUrl: string;
    gender: "male" | "female" | "other" | null;
    dateOfBirth: string | null;
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
};

//booking
export type BookingForTutorState = {
    list: BookingForTutor[] | null;
    detail: BookingForTutor | null;
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
};

export type ScheduleForTutor = {
    id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    entryType: string;
};

//request
export type ResponseGetRequestFindTutorForTutor<T> = {
    data: T;
    totalCount: number;
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
