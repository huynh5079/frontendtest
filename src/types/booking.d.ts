export type GetAllTutorScheduleParams = {
    tutorProfileId: string;
    startDate: string;
    endDate: string;
};

export type TutorScheduleState = {
    listTutorSchedule: TutorSchedules[]
}

export type TutorSchedules = {
    id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    entryType: string;
}