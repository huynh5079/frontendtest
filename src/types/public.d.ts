//class
export type PublicClassState = {
    list: PublicClass[];
    detail: PublicClass | null;
};

interface ScheduleString {
    dayOfWeek: string; // 0=CN, 1=T2, ..., 6=T7
    startTime: string; // định dạng "HH:mm:ss"
    endTime: string; // định dạng "HH:mm:ss"
}

export type PublicClass = {
    id: string;
    tutorId: string;
    tutorUserId: string;
    tutorName?: string; // Thêm field này để lưu tên gia sư
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
