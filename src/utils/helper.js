import { routes } from "../routes/routeName";
import { parseISO } from "date-fns";
import { useEffect } from "react";
export const daysOptions = [
    { value: "monday", label: "Thứ 2" },
    { value: "tuesday", label: "Thứ 3" },
    { value: "wednesday", label: "Thứ 4" },
    { value: "thursday", label: "Thứ 5" },
    { value: "friday", label: "Thứ 6" },
    { value: "saturday", label: "Thứ 7" },
    { value: "sunday", label: "Chủ nhật" },
];
export const timesOptions = [
    { value: "morning", label: "Buổi sáng" },
    { value: "afternoon", label: "Buổi chiều" },
    { value: "evening", label: "Buổi tối" },
];
export const studentOtions = [
    { value: "1", label: "Phạm Công Lê Tuấn" },
    { value: "2", label: "Nguyễn thị Yến Vy" },
];
export const sampleData = [
    { name: "Có mặt", value: 120 },
    { name: "Vắng", value: 30 },
    { name: "Chưa điểm danh", value: 25 },
];
export const logout = () => {
    localStorage.clear();
    window.location.href = routes.home;
};
export function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
export function formatDateReverse(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
export function formatDateToYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
export function csvToArray(csv) {
    return csv
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
export const USER_STUDENT = "Student";
export const USER_TUTOR = "Tutor";
export const USER_PARENT = "Parent";
export const USER_ADMIN = "Admin";
export function groupSchedulesByWeek(data) {
    const getDayName = (date) => [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ][date.getDay()];
    const isWithinTimeRange = (date) => {
        const hour = date.getHours();
        return hour >= 7 && hour <= 22; // chỉ lấy trong khoảng 7h - 22h
    };
    const weeklySchedule = data.reduce((acc, item) => {
        const start = parseISO(item.startTime);
        const end = parseISO(item.endTime);
        // bỏ qua lịch ngoài khung giờ
        if (!isWithinTimeRange(start) || !isWithinTimeRange(end))
            return acc;
        const dayName = getDayName(start);
        const startTime = start.toTimeString().slice(0, 5); // HH:mm
        const endTime = end.toTimeString().slice(0, 5);
        if (!acc[dayName])
            acc[dayName] = [];
        // kiểm tra trùng
        const exists = acc[dayName].some((slot) => slot.start === startTime && slot.end === endTime);
        if (!exists) {
            acc[dayName].push({ start: startTime, end: endTime });
        }
        return acc;
    }, {});
    // đảm bảo đủ thứ 2 → CN
    const fullWeek = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    };
    for (const day in fullWeek) {
        if (weeklySchedule[day]) {
            fullWeek[day] =
                weeklySchedule[day];
        }
    }
    return fullWeek;
}
export function convertWeeklyScheduleToBusy(schedule) {
    const dayMap = {
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
    const result = [];
    Object.entries(schedule).forEach(([day, slots]) => {
        const dayIndex = dayMap[day];
        if (dayIndex === undefined)
            return;
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
export const useDocumentTitle = (title) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};
export const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    // Cộng thêm 7 giờ (7 * 60 * 60 * 1000 ms)
    past.setHours(past.getHours() + 7);
    const diff = (now.getTime() - past.getTime()) / 1000; // tính giây
    if (diff < 60)
        return `${Math.floor(diff)} giây trước`;
    const minutes = diff / 60;
    if (minutes < 60)
        return `${Math.floor(minutes)} phút trước`;
    const hours = minutes / 60;
    if (hours < 24)
        return `${Math.floor(hours)} giờ trước`;
    const days = hours / 24;
    if (days < 30)
        return `${Math.floor(days)} ngày trước`;
    const months = days / 30;
    if (months < 12)
        return `${Math.floor(months)} tháng trước`;
    const years = months / 12;
    return `${Math.floor(years)} năm trước`;
};
export const convertScheduleStringToSchedule = (input) => {
    const dayMap = {
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
export const getStatusText = (status) => {
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
        default:
            return "Không có";
    }
};
