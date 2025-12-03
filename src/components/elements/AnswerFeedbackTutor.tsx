import { useState, type FC } from "react";
import { FaHeart } from "react-icons/fa";

const AnswerFeedbackTutor: FC = () => {
    const [isLike, setIsLike] = useState(false);
    return (
        <div className="feedback-tutor">
            <div className="account">
                <div className="avatar"></div>
                <div className="info">
                    <h5 className="name">
                        Nguyễn Văn A <span className="time">12 giây trước</span>
                    </h5>
                    <p className="review">Thầy cảm ơn</p>
                </div>
            </div>
            <div className="action">
                {isLike ? (
                    <span className="liked" onClick={() => setIsLike(false)}>
                        <FaHeart />
                    </span>
                ) : (
                    <span className="like" onClick={() => setIsLike(true)}>
                        <FaHeart />
                    </span>
                )}
                <p>11 lượt thích</p>
            </div>
        </div>
    );
};

export default AnswerFeedbackTutor;
