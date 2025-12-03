import { useEffect, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { selectListFeedbackInTutorProfile } from "../../app/selector";
import { getAllFeedbackInTutorProfileApiThunk } from "../../services/feedback/feedbackThunk";
import { timeAgo } from "../../utils/helper";

interface FeedbackTutorProps {
    tutorId: string;
}

const FeedbackTutor: FC<FeedbackTutorProps> = ({ tutorId }) => {
    const dispatch = useAppDispatch();

    const feedbacksInTutorProfile = useAppSelector(
        selectListFeedbackInTutorProfile
    );

    console.log(feedbacksInTutorProfile);

    useEffect(() => {
        dispatch(
            getAllFeedbackInTutorProfileApiThunk({
                tutorUserId: tutorId,
                page: 1,
                pageSize: 10,
            })
        );
    }, [dispatch]);

    return (
        <div className="feedback-tutor">
            {feedbacksInTutorProfile?.items?.map((feedback) => (
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
            ))}
        </div>
    );
};

export default FeedbackTutor;
