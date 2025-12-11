import type { TutorProfile } from "./tutor";

export type UserInfoLogin = {
    id: string;
    username: string;
    avatarUrl: string;
    role: string;
};

export type UserState = {
    tutorProfile: TutorProfile | null;
    parentProfile: ParentProfile | null;
    studentProfile: StudentProfile | null;
};

export type ParentProfile = {
    username: string;
    avatarUrl: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    dateOfBirth: string;
    children: [];
};

export type ProfileStudent = {
    educationLevel: string;
    preferredSubjects: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    dateOfBirth: string;
    avatarUrl: string;
};

export type UpdateStudentProfileParams = {
    educationLevel: string;
    preferredSubjects: string;
    username: string;
    phone: string;
    address: string;
    gender: string;
    dateOfBirth: string;
};
