import type { FC } from "react";
import type { PublicTutors } from "../../types/tutor";
import { csvToArray } from "../../utils/helper";
import { SystemLogo } from "../../assets/images";
import { FaStar } from "react-icons/fa";

interface TutorCardProps {
    tutor: PublicTutors;
    handeleToDetailTutor: (tutorId: string) => void;
}

const StarRating: FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    className={
                        index < Math.floor(rating) ? "star filled" : "star"
                    }
                />
            ))}
        </div>
    );
};

const TutorCard: FC<TutorCardProps> = ({ tutor, handeleToDetailTutor }) => {
    const subjects = csvToArray(tutor?.teachingSubjects || "");

    return (
        <div className="tutor-card-container">
            <div className="ttc-image">
                <img
                    src={tutor.avatarUrl || SystemLogo}
                    alt={tutor.username}
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = SystemLogo;
                    }}
                />
            </div>

            <div className="ttc-info">
                <h3 className="ttci-name">{tutor.username}</h3>
                <div className="ttci-specialties">
                    {subjects.map((subject, index) => (
                        <p key={index} className="ttci-specialty">
                            {subject}
                        </p>
                    ))}
                </div>
                
                {tutor.address && (
                    <div className="ttci-address">
                        <p className="ttci-address-text">{tutor.address}</p>
                    </div>
                )}
            </div>

            <div className="ttc-rating">
                <StarRating rating={tutor.rating!} />
                <span className="rating">{tutor.rating}</span>
            </div>

            <div className="ttcr-reviews">
                <span className="reviews">
                    ({tutor.feedbackCount} đánh giá)
                </span>
            </div>
            <button
                className="pr-btn"
                onClick={() => handeleToDetailTutor(tutor.tutorId)}
            >
                Xem thông tin
            </button>
        </div>
    );
};

export default TutorCard;
