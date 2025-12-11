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
