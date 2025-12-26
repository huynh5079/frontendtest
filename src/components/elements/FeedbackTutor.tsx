import { type FC } from "react";
import { timeAgo } from "../../utils/helper";
import { FeedbackInTutorProfileResponse } from "../../types/feedback";
import { NoStar } from "../../assets/images";

interface FeedbackTutorProps {
    feedbacksInTutorProfile: FeedbackInTutorProfileResponse | null;
    filterStar: number | null;
}

const FeedbackTutor: FC<FeedbackTutorProps> = ({
    feedbacksInTutorProfile,
    filterStar,
}) => {
    const filtered = filterStar
        ? feedbacksInTutorProfile?.items?.filter(
              (fb) => fb.rating === filterStar,
          )
        : feedbacksInTutorProfile?.items;

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
                            fontSize: "20px",
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
        <div className="feedback-tutor">
            {filtered && filtered.length > 0 ? (
                filtered.map((feedback) => (
                    <div className="account" key={feedback.id}>
                        <img className="avatar" />
                        <div className="info">
                            <h5 className="name">
                                {feedback.fromUserName}
                                <span className="time">
                                    {timeAgo(feedback.createdAt)}
                                </span>
                            </h5>
                            <StarRating
                        value={Number(feedback.rating)}
                        onChange={() => {}}
                    />
                            <p className="review">{feedback.comment}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-feedback">
                    <img src={NoStar} alt="" />
                    <p>Chưa có đánh giá nào</p>
                </div>
            )}
        </div>
    );
};

export default FeedbackTutor;
