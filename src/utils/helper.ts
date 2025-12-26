import { routes } from "../routes/routeName";
import type { OptionMultiSelectData, PieChartData } from "../types/app";
import { format, parseISO } from "date-fns";
import type { TutorSchedules } from "../types/booking";
import { useEffect } from "react";
import type { ScheduleString } from "../types/tutor";
import type { Schedule } from "../types/student";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface TimeSlot {
    start: string;
    end: string;
}

type WeeklySchedule = Record<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday",
    TimeSlot[]
>;

interface BusyEvent {
    startTime: string;
    endTime: string;
}

export const daysOptions: OptionMultiSelectData[] = [
    { value: "monday", label: "Thứ 2" },
    { value: "tuesday", label: "Thứ 3" },
    { value: "wednesday", label: "Thứ 4" },
    { value: "thursday", label: "Thứ 5" },
    { value: "friday", label: "Thứ 6" },
    { value: "saturday", label: "Thứ 7" },
    { value: "sunday", label: "Chủ nhật" },
];

export const timesOptions: OptionMultiSelectData[] = [
    { value: "morning", label: "Buổi sáng" },
    { value: "afternoon", label: "Buổi chiều" },
    { value: "evening", label: "Buổi tối" },
];

export const studentOtions: OptionMultiSelectData[] = [
    { value: "1", label: "Phạm Công Lê Tuấn" },
    { value: "2", label: "Nguyễn thị Yến Vy" },
];

export const sampleData: PieChartData[] = [
    { name: "Có mặt", value: 120 },
    { name: "Vắng", value: 30 },
    { name: "Chưa điểm danh", value: 25 },
];

export const logout = () => {
    localStorage.clear();

    window.location.href = routes.home;
};

export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function formatDateReverse(isoString: string): string {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export function formatDateToYMD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function csvToArray(csv: string): string[] {
    return csv
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

export const USER_STUDENT = "Student";
export const USER_TUTOR = "Tutor";
export const USER_PARENT = "Parent";
export const USER_ADMIN = "Admin";

export function groupSchedulesByWeek(data: TutorSchedules[]): WeeklySchedule {
    const getDayName = (date: Date) =>
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ][date.getDay()];

    const isWithinTimeRange = (date: Date) => {
        const hour = date.getHours();
        return hour >= 7 && hour <= 22; // chỉ lấy trong khoảng 7h - 22h
    };

    const weeklySchedule = data.reduce((acc, item) => {
        const start = parseISO(item.startTime);
        const end = parseISO(item.endTime);

        // bỏ qua lịch ngoài khung giờ
        if (!isWithinTimeRange(start) || !isWithinTimeRange(end)) return acc;

        const dayName = getDayName(start) as keyof WeeklySchedule;
        const startTime = start.toTimeString().slice(0, 5); // HH:mm
        const endTime = end.toTimeString().slice(0, 5);

        if (!acc[dayName]) acc[dayName] = [];

        // kiểm tra trùng
        const exists = acc[dayName].some(
            (slot) => slot.start === startTime && slot.end === endTime,
        );

        if (!exists) {
            acc[dayName].push({ start: startTime, end: endTime });
        }

        return acc;
    }, {} as Partial<WeeklySchedule>);

    // đảm bảo đủ thứ 2 → CN
    const fullWeek: WeeklySchedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    };

    for (const day in fullWeek) {
        if (weeklySchedule[day as keyof WeeklySchedule]) {
            fullWeek[day as keyof WeeklySchedule] =
                weeklySchedule[day as keyof WeeklySchedule]!;
        }
    }

    return fullWeek;
}

export function convertWeeklyScheduleToBusy(
    schedule: WeeklySchedule,
): BusyEvent[] {
    const dayMap: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0, // Chủ nhật
    };

    // 🔹 chọn ngày gốc là Thứ 2 (3/11/2025 chẳng hạn)
    const baseDate = new Date(2025, 10, 3);
    const result: BusyEvent[] = [];

    Object.entries(schedule).forEach(([day, slots]) => {
        const dayIndex = dayMap[day];
        if (dayIndex === undefined) return;

        slots.forEach(({ start, end }) => {
            const startDate = new Date(baseDate);
            startDate.setDate(baseDate.getDate() + ((dayIndex + 6) % 7)); // dịch sang đúng thứ
            const [sh, sm] = start.split(":").map(Number);
            startDate.setHours(sh, sm, 0, 0);

            const endDate = new Date(startDate);
            const [eh, em] = end.split(":").map(Number);
            endDate.setHours(eh, em, 0, 0);

            result.push({
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
            });
        });
    });

    return result;
}

export const useDocumentTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};

export const convertScheduleStringToSchedule = (
    input: ScheduleString[],
): Schedule[] => {
    const dayMap: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };

    return input.map((item) => ({
        dayOfWeek: dayMap[item.dayOfWeek] ?? -1, // fallback nếu lỗi
        startTime: item.startTime,
        endTime: item.endTime,
    }));
};

export const getStatusText = (status: string | null | undefined): string => {
    switch (status) {
        case "Pending":
            return "Chờ xử lý";
        case "Approved":
            return "Đã chấp thuận";
        case "Rejected":
            return "Đã từ chối";
        case "Active":
            return "Đang hoạt động";
        case "Ongoing":
            return "Đang học";
        case "Cancelled":
            return "Đã huỷ";
        case "Successed":
            return "Thành công";
        case "Failed":
            return "Thất bại";
        case "Matched":
            return "Đã kết nối";
        case "Completed":
            return "Đã hoàn thành";
        case "Accepted":
            return "Đã chấp nhận";
        case "Read":
            return "Đã đọc";
        case "Unread":
            return "Chưa đọc";
        default:
            return "Không có";
    }
};

export const getModeText = (status: string | null | undefined): string => {
    switch (status) {
        case "Offline":
            return "Học tại lớp";
        case "Online":
            return "Học trực tuyến";
        default:
            return "Không có";
    }
};

export const getAttendanceText = (
    status: string | null | undefined,
): string => {
    switch (status) {
        case "Absent":
            return "Vắng học";
        case "Present":
            return "Có mặt";
        default:
            return "Chưa học";
    }
};

export const getQuizTypeText = (status: string | null | undefined): string => {
    switch (status) {
        case "Practice":
            return "Bài tập ôn tập";
        case "Test":
            return "Kiểm tra";
        default:
            return "Chưa học";
    }
};

export const timeAgo = (date: string) => {
    return dayjs(date).fromNow();
};

export const formatTime = (isoString?: string | null) => {
    if (!isoString) return "--:--"; // hoặc "" tùy bạn

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--:--";

    return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

export const formatTimeAdd7 = (isoString?: string | null): string => {
    if (!isoString) return "--:--";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--:--";

    // Backend đã serialize DateTime với +07:00 timezone offset
    // JavaScript's new Date() tự động convert sang local time (UTC+7)
    // KHÔNG CẦN cộng thêm 7 giờ nữa
    // Nếu cộng thêm sẽ bị sai 14 giờ (7 + 7 = 14)

    return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

