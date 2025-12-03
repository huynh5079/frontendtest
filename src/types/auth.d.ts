export type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    userInfoLogin: UserInfoLogin | null;
};

export type LoginEmail = {
    email: string;
    password: string;
};

export type RegisterStudent = {
    email: string;
    username: string;
    password: string;
    birthday: Date | null;
};

export type RegisterParent = {
    email: string;
    username: string;
    password: string;
};

export type RegisterTutor = {
    username: string;
    password: string;
    email: string;
    gender: string;
    DateOfBirth: Date | null;
    phoneNumber: string;
    address: string;
    seftDescription: string;
    educationLevel: string;
    university: string;
    major: string;
    teachingExperienceYears: string;
    experienceDetails: string;
    teachingSubjects: string[];
    teachingLevel: string;
    specialSkills: string;
    certificatesFiles: File[];
    identityDocuments: File[];
};

export type ForgotPassword = {
    email: string;
    newPassword: string;
    confirmPassword: string;
};

export type ChangePassword = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type VerifyEmail = {
    email: string;
};

export type VerifyOtp = {
    email: string;
    code: string;
};

export type AuthResponse = {
    token: string;
    user: UserInfoLogin;
};
