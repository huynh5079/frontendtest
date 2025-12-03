import { type FC } from "react";
type WeeklySchedule = Record<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday", {
    start: string;
    end: string;
}[]>;
interface CreateClassOfflineProps {
    infoTutor: any;
    startDateStudy: Date | null;
    setStartDateStudy: (date: Date | null) => void;
    busySchedules: WeeklySchedule;
}
declare const CreateClassOffline: FC<CreateClassOfflineProps>;
export default CreateClassOffline;
