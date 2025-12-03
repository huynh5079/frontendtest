import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import type { Schedule } from "../../types/student";
type WeeklySchedule = Record<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday", {
    start: string;
    end: string;
}[]>;
interface WeekCalendarCreateClassProps {
    busySchedules: WeeklySchedule;
    onSelectedChange?: (schedules: Schedule[]) => void;
    sessionsPerWeek?: number | "";
}
declare const WeekCalendarCreateClass: React.FC<WeekCalendarCreateClassProps>;
export default WeekCalendarCreateClass;
