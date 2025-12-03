import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { selectListFeedbackInTutorProfile } from "../../app/selector";
import { getAllFeedbackInTutorProfileApiThunk } from "../../services/feedback/feedbackThunk";
import { timeAgo } from "../../utils/helper";
const FeedbackTutor = ({ tutorId }) => {
    const dispatch = useAppDispatch();
    const feedbacksInTutorProfile = useAppSelector(selectListFeedbackInTutorProfile);
    console.log(feedbacksInTutorProfile);
    useEffect(() => {
        dispatch(getAllFeedbackInTutorProfileApiThunk({
            tutorUserId: tutorId,
            page: 1,
            pageSize: 10,
        }));
    }, [dispatch]);
    return (_jsx("div", { className: "feedback-tutor", children: feedbacksInTutorProfile?.items?.map((feedback) => (_jsxs("div", { className: "account", children: [_jsx("img", { className: "avatar" }), _jsxs("div", { className: "info", children: [_jsxs("h5", { className: "name", children: [feedback.fromUserName, _jsx("span", { className: "time", children: timeAgo(feedback.createdAt) })] }), _jsx("p", { className: "review", children: feedback.comment })] })] }, feedback.id))) }));
};
export default FeedbackTutor;
