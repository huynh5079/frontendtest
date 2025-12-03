export type UpdateParentParams = {
    username: string;
    avatarUrl: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    dateOfBirth: string;
};

export type ChildAccountState = {
    listChildAccounts: ChildAccounts[];
    detailChildAccount: ChildAccount | null;
};

export type CreateChildAccountParams = {
    username: string;
    email: string;
    address: string;
    phone: string;
    educationLevelId: string;
    preferredSubjects: string;
    relationship: string;
    initialPassword: string;
};

export type ChildAccounts = {
    studentId: string;
    studentUserId: string;
    username: string;
    email: string;
    avatarUrl: string;
    educationLevelId: string;
    preferredSubjects: string;
    createDate: string;
};

export type ChildAccount = {
    studentId: string;
    studentUserId: string;
    username: string;
    email: string;
    avatarUrl: string;
    phone: string;
    address: string;
    gender: string | null;
    dateOfBirth: string | null;
    educationLevel: string | null;
    preferredSubjects: string;
    relationship: string;
    createDate: string;
};
