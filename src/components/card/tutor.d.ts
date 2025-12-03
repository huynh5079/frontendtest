import type { FC } from "react";
import type { PublicTutors } from "../../types/tutor";
interface TutorCardProps {
    tutor: PublicTutors;
    handeleToDetailTutor: (tutorId: string) => void;
}
declare const TutorCard: FC<TutorCardProps>;
export default TutorCard;
