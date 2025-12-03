import type { OptionMultiSelectData, PieChartData } from "../types/app";
import type { TutorSchedules } from "../types/booking";
import type { ScheduleString } from "../types/tutor";
import type { Schedule } from "../types/student";
interface TimeSlot {
    start: string;
    end: string;
}
type WeeklySchedule = Record<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday", TimeSlot[]>;
interface BusyEvent {
    startTime: string;
    endTime: string;
}
export declare const daysOptions: OptionMultiSelectData[];
export declare const timesOptions: OptionMultiSelectData[];
export declare const studentOtions: OptionMultiSelectData[];
export declare const sampleData: PieChartData[];
export declare const logout: () => void;
export declare function formatDate(isoString: string): string;
export declare function formatDateReverse(isoString: string): string;
export declare function formatDateToYMD(date: Date): string;
export declare function csvToArray(csv: string): string[];
export declare const USER_STUDENT = "Student";
export declare const USER_TUTOR = "Tutor";
export declare const USER_PARENT = "Parent";
export declare const USER_ADMIN = "Admin";
export declare function groupSchedulesByWeek(data: TutorSchedules[]): WeeklySchedule;
export declare function convertWeeklyScheduleToBusy(schedule: WeeklySchedule): BusyEvent[];
export declare const useDocumentTitle: (title: string) => void;
export declare const timeAgo: (dateString: string) => string;
export declare const convertScheduleStringToSchedule: (input: ScheduleString[]) => Schedule[];
export declare const getStatusText: (status: string | null | undefined) => string;
export {};
