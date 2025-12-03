import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import type { Schedule } from "../../types/student";
type WeeklySchedule = Record<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday", {
    start: string;
    end: string;
}[]>;
interface WeekCalendarUpdateProps {
    busySchedules: WeeklySchedule;
    onSelectedChange?: (schedules: Schedule[]) => void;
    initialEvents?: Schedule[];
}
declare const WeekCalendarUpdate: React.FC<WeekCalendarUpdateProps>;
export default WeekCalendarUpdate;
