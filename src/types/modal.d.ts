import type { ClassRequests } from "./student";
import type { ScheduleForTutor, TutorClass } from "./tutor";
import type { AvailabilityBlocksForTutor } from "./tutorAvailabilityBlock";

export type ModalProps = {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    title?: string;
    children: React.ReactNode;
};

export interface ModalCommonProps {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
}

export interface CreateAvailabilityBlockForTutorModalProps
    extends ModalCommonProps {
    startDateProps: string;
    endDateProps: string;
}

export interface DeleteAvailabilityBlockForTutorModalProps
    extends ModalCommonProps {
    selectedAvailabilityBlock: ScheduleForTutor | null;
    startDateProps: string;
    endDateProps: string;
}

export interface RemindLoginModalProps extends ModalCommonProps { }
export interface RemindWalletModalProps extends ModalCommonProps {
    routes: string
}
export interface UpdateBookingTutorForStudentModalProps
    extends ModalCommonProps {
    selectedBooking: ClassRequests | null;
}

export interface UpdateRequestFindTutorForStudentModalProps
    extends ModalCommonProps {
    selectedBooking: ClassRequests | null;
}

export interface updateClassModalProps extends ModalCommonProps {
    selectedClass: TutorClass | null;
}

export interface CancelBookingTutorForStudentProps extends ModalCommonProps {
    requestId: string | null;
}

export interface CancelRequestFindTutorForStudentProps extends ModalCommonProps {
    requestId: string | null;
}

export interface AdminCancelClassModalProps extends ModalCommonProps {
    classId: string | null;
    onSuccess?: () => void;
}

export interface AdminCancelStudentEnrollmentModalProps extends ModalCommonProps {
    classId: string | null;
    studentId: string | null;
    studentName?: string | null;
    onSuccess?: () => void;
}

export interface TutorCancelClassModalProps extends ModalCommonProps {
    classId: string | null;
}

export interface TutorCompleteClassModalProps extends ModalCommonProps {
    classId: string | null;
}

export interface StudentWithdrawClassModalProps extends ModalCommonProps {
    classId: string | null;
}

export interface AdminSelectStudentToCancelModalProps extends ModalCommonProps {
    classId: string | null;
    onSelectStudent?: (studentId: string, studentName?: string) => void;
}