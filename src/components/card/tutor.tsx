import type { FC } from "react";
import type { PublicTutors } from "../../types/tutor";
import { csvToArray } from "../../utils/helper";

interface TutorCardProps {
    tutor: PublicTutors;
    handeleToDetailTutor: (tutorId: string) => void;
}

// const StarRating: FC<{ rating: number }> = ({ rating }) => {
//     return (
//         <div className="star-rating">
//             {[...Array(5)].map((_, index) => (
//                 <FaStar
//                     key={index}
//                     className={
//                         index < Math.floor(rating) ? "star filled" : "star"
//                     }
//                 />
//             ))}
//         </div>
//     );
// };

const TutorCard: FC<TutorCardProps> = ({ tutor, handeleToDetailTutor }) => {

    const subjects = csvToArray(tutor?.teachingSubjects || "");

    return (
        <div className="tutor-card-container">
            <div className="ttc-image">
                <img
                    src={tutor.avatarUrl}
                    alt={tutor.username}
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
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
            </div>

            {/* <div className="ttc-rating">
                <StarRating rating={tutor.rating} />
                <div className="ttcr-reviews">
                    <span className="rating">{tutor.rating}</span>
                    <span className="reviews">
                        ({tutor.totalReviews} đánh giá)
                    </span>
                </div>
            </div> */}

            <button
                className="ttc-btn"
                onClick={() => handeleToDetailTutor(tutor.tutorId)}
            >
                Xem thông tin
            </button>
        </div>
    );
};

export default TutorCard;
