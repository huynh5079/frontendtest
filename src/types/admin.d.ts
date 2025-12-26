//tutor
export type TutorForAdminState = {
    listTutors: TutorsForAdmin[] | null;
    tutor: TutorForAdmin | null;
};

export type TutorsForAdmin = {
    tutorId: string;
    username: string;
    email: string;
    status: string;
    isBanned: false;
    createDate: string;
};

export interface FileAttachment {
    id: string;
    url: string;
    fileName: string;
    contentType: string;
    fileSize: number;
}

export interface TutorForAdmin {
    userId: string;
    tutorProfileId: string;
    email: string;
    userName: string;
    avatarUrl: string;
    phone: string;
    address: string;
    bio: string;
    experienceDetails: string;
    university: string;
    major: string;
    educationLevel: string;
    teachingExperienceYears: number;
    teachingSubjects: string; // hoặc: string[]
    teachingLevel: string; // hoặc: string[]
    status: "PendingApproval" | "Approved" | "Rejected";
    reviewStatus: string | null;
    rejectReason: string | null;
    provideNote: string | null;
    identityDocuments: FileAttachment[];
    certificates: FileAttachment[];
}

export type RejectTutor = {
    rejectReason: string;
};

export type ProvideTutor = {
    provideText: string;
};

//student
export type StudentForAdminState = {
    listStudents: StudentsForAdmin[] | null;
    student: StudentForAdmin | null;
};

export type StudentsForAdmin = {
    studentId: string;
    username: string;
    email: string;
    isBanned: false;
    createDate: string;
};

export interface StudentForAdmin {
    studentId: string;
    email: string;
    username: string;
    avatarUrl: string;
    phone: string;
    address: string;
    isBanned: boolean;
    gender: string;
    educationLevelId: string;
    preferredSubjects: string;
    createDate: string;
    dateOfBirth: string;
}

//parent
export type ParentForAdminState = {
    listParents: ParentsForAdmin[] | null;
    parent: ParentForAdmin | null;
};

export type ParentsForAdmin = {
    parentId: string;
    username: string;
    email: string;
    isBanned: false;
    createDate: string;
};

export interface ParentForAdmin {
    parentId: string;
    username: string;
    email: string;
    isBanned: boolean;
    createDate: string; // hoặc Date nếu bạn muốn parse về đối tượng Date
    relationship: string | null;
    phone: string | null;
    address: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    linkedStudentId: string | null;
    linkedStudentUsername: string | null;
    linkedStudentEmail: string | null;
    avatarUrl: string;
}

export type ResponseGetUsersForAdmin<T> = {
    items: T;
    size: number;
    total: number;
    totalPages: number;
} 
