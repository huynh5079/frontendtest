import { useState, type FC } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { RatingStarsProps, Tutor, TutorCardProps } from "../../types/tutor";

const LandingTopTutors: FC = () => {
    const tutors: Tutor[] = [
        {
            id: 1,
            name: "TS. Nguyễn Thị Lan",
            specialty: ["Toán", "Vật lí"],
            rating: 4.9,
            totalReviews: 128,
            profileImage:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
            id: 2,
            name: "ThS. Trần Minh Quang",
            specialty: ["Tin học"],
            rating: 4.7,
            totalReviews: 95,
            profileImage:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        },
        {
            id: 3,
            name: "TS. Lê Hoàng Anh",
            specialty: ["Sinh học", "Hóa học"],
            rating: 4.8,
            totalReviews: 156,
            profileImage:
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
        },
    ];

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
                        src={
                            imageError
                                ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
                                : tutor.profileImage
                        }
                        alt={tutor.name}
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                </div>
                <h3 className="tutor-name">{tutor.name}</h3>
                <p className="tutor-specialty">{tutor.specialty}</p>
                <div className="tutor-rating">
                    <RatingStars rating={tutor.rating} />
                    <p className="review-count">
                        {tutor.totalReviews} đánh giá
                    </p>
                </div>
                <button
                    className="view-details-btn"
                    aria-label={`View details for ${tutor.name}`}
                >
                    Xem thông tin
                </button>
            </div>
        );
    };

    return (
        <div className="top-rated-tutors">
            {tutors.length > 0 ? (
                <div className="tutors-grid">
                    {tutors.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
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
