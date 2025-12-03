import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import type { Schedule } from "../../types/student";
interface WeekCalendarUpdateRequestFindTutorProps {
    onSelectedChange?: (schedules: Schedule[]) => void;
    initialEvents?: Schedule[];
}
declare const WeekCalendarUpdateRequestFindTutor: React.FC<WeekCalendarUpdateRequestFindTutorProps>;
export default WeekCalendarUpdateRequestFindTutor;
