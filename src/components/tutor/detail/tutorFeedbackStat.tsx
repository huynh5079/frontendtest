import { FC } from "react";
import { FeedbackInTutorProfileResponse } from "../../../types/feedback";

interface TutorFeedbackStatProps {
    feedbacksInTutorProfile: FeedbackInTutorProfileResponse | null;
    setFilterStar: (star: number | null) => void;
    activeStar: number | null;
}

const TutorFeedbackStat: FC<TutorFeedbackStatProps> = ({
    feedbacksInTutorProfile,
    setFilterStar,
    activeStar,
}) => {
    const totalFeedbacks = feedbacksInTutorProfile?.items?.length;

    const fiveStarFeedbacks = feedbacksInTutorProfile?.items?.filter(
        (fb) => fb.rating === 5,
    ).length;

    const fourStarFeedbacks = feedbacksInTutorProfile?.items?.filter(
        (fb) => fb.rating === 4,
    ).length;

    const threeStarFeedbacks = feedbacksInTutorProfile?.items?.filter(
        (fb) => fb.rating === 3,
    ).length;

    const twoStarFeedbacks = feedbacksInTutorProfile?.items?.filter(
        (fb) => fb.rating === 2,
    ).length;

    const oneStarFeedbacks = feedbacksInTutorProfile?.items?.filter(
        (fb) => fb.rating === 1,
    ).length;

    const averageRating =
        feedbacksInTutorProfile?.items?.length! > 0
            ? (
                  feedbacksInTutorProfile?.items?.reduce(
                      (sum, fb) => sum + fb.rating,
                      0,
                  )! / feedbacksInTutorProfile?.items?.length!
              ).toFixed(1)
            : "0";

    /** ============ STAR COMPONENT ============== */
    const StarRating = ({ value, onChange }: any) => {
        return (
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => onChange(star)}
                        style={{
                            cursor: "pointer",
                            color: star <= value ? "var(--main-color)" : "#ccc",
                            fontSize: "40px",
                            marginRight: "8px",
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="feedback-stat">
            <div className="fsc1">
                <div className="fsc1r1">
                    <span>{averageRating}</span> trên 5
                </div>
                <div className="fsc1r2">
                    <StarRating
                        value={Number(averageRating)}
                        onChange={() => {}}
                    />
                </div>
            </div>
            <div className="fsc2">
                <div
                    className={`fsc2-item ${
                        activeStar === null ? "active" : ""
                    }`}
                    onClick={() => setFilterStar(null)}
                >
                    Tất cả ({totalFeedbacks})
                </div>

                <div
                    className={`fsc2-item ${activeStar === 5 ? "active" : ""}`}
                    onClick={() => setFilterStar(5)}
                >
                    5 sao ({fiveStarFeedbacks})
                </div>

                <div
                    className={`fsc2-item ${activeStar === 4 ? "active" : ""}`}
                    onClick={() => setFilterStar(4)}
                >
                    4 sao ({fourStarFeedbacks})
                </div>

                <div
                    className={`fsc2-item ${activeStar === 3 ? "active" : ""}`}
                    onClick={() => setFilterStar(3)}
                >
                    3 sao ({threeStarFeedbacks})
                </div>

                <div
                    className={`fsc2-item ${activeStar === 2 ? "active" : ""}`}
                    onClick={() => setFilterStar(2)}
                >
                    2 sao ({twoStarFeedbacks})
                </div>

                <div
                    className={`fsc2-item ${activeStar === 1 ? "active" : ""}`}
                    onClick={() => setFilterStar(1)}
                >
                    1 sao ({oneStarFeedbacks})
                </div>
            </div>
        </div>
    );
};

export default TutorFeedbackStat;
