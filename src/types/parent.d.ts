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
    gender: string;
    dateOfBirth: string;
};

export type LinkExistingChildRequest = {
    studentEmail: string;
    relationship: string;
};

export type UpdateChildRequest = {
    username?: string;
    phone?: string;
    address?: string;
    educationLevel?: string;
    preferredSubjects?: string;
    gender?: string;
    dateOfBirth?: string;
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

//child schedule
export type GetScheduleSpecificChildParams = {
    childProfileId: string;
    startDate: string;
    endDate;
};

export type ChildScheduleState = {
    list: ChildSchedule[] | null;
    detail: DetailChildScheduleLessonForParent | null;
};

export type ChildSchedule = {
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

export type DetailChildScheduleLessonForParent = {
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

//class
export type ParentClassState = {
    isEnrolled: boolean;
    assignedClasses: AssignedClassForParent[] | null;
};

export type AssignClassParamsForParent = {
    studentId: string;
    classId: string;
};

export type AssignedClassForParent = {
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
