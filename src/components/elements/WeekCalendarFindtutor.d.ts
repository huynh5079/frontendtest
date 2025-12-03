import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import type { Schedule } from "../../types/student";
interface WeekCalendarFindTutorProps {
    onSelectedChange?: (schedules: Schedule[]) => void;
    sessionsPerWeek?: number | "";
}
declare const WeekCalendarFindTutor: React.FC<WeekCalendarFindTutorProps>;
export default WeekCalendarFindTutor;
