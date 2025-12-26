import { useState, type FC } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
    PublicTutors,
    RatingStarsProps,
    Tutor,
    TutorCardProps,
} from "../../types/tutor";
import { SystemLogo } from "../../assets/images";
import { navigateHook } from "../../routes/routeApp";
import { routes } from "../../routes/routeName";

interface LandingTopTutorProps {
    tutors: PublicTutors[];
}

const LandingTopTutors: FC<LandingTopTutorProps> = ({ tutors }) => {
    const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => (
        <div className="rating-stars">
            {[...Array(5)].map((_, index) => (
                <span key={index}>
                    {index < Math.floor(rating) ? (
                        <FaStar className="star filled" />
                    ) : (
                        <FaRegStar className="star" />
                    )}
                </span>
            ))}
            <span className="rating-value">{rating}</span>
        </div>
    );

    const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
        const [imageError, setImageError] = useState(false);

        return (
            <div className="tutor-card">
                <div className="tutor-image">
                    <img
                        src={imageError ? SystemLogo : tutor.avatarUrl}
                        alt={tutor.username}
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                </div>
                <h3 className="tutor-name">{tutor.username}</h3>
                <p className="tutor-specialty">{tutor.teachingSubjects}</p>
                <div className="tutor-rating">
                    <RatingStars rating={tutor.rating!} />
                    <p className="review-count">
                        {tutor.feedbackCount} đánh giá
                    </p>
                </div>
                <button
                    className="view-details-btn"
                    onClick={() =>
                        navigateHook(routes.tutor.detail, {
                            tutorId: tutor.tutorId,
                        })
                    }
                >
                    Xem thông tin
                </button>
            </div>
        );
    };

    return (
        <div className="top-rated-tutors">
            {tutors?.length > 0 ? (
                <div className="tutors-grid">
                    {tutors.map((tutor) => (
                        <TutorCard key={tutor.tutorId} tutor={tutor} />
                    ))}
                </div>
            ) : (
                <div className="no-tutors">
                    Hiên tại không có dữ liệu khả thi
                </div>
            )}
        </div>
    );
};

export default LandingTopTutors;
