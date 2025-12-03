import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
const AnswerFeedbackTutor = () => {
    const [isLike, setIsLike] = useState(false);
    return (_jsxs("div", { className: "feedback-tutor", children: [_jsxs("div", { className: "account", children: [_jsx("div", { className: "avatar" }), _jsxs("div", { className: "info", children: [_jsxs("h5", { className: "name", children: ["Nguy\u1EC5n V\u0103n A ", _jsx("span", { className: "time", children: "12 gi\u00E2y tr\u01B0\u1EDBc" })] }), _jsx("p", { className: "review", children: "Th\u1EA7y c\u1EA3m \u01A1n" })] })] }), _jsxs("div", { className: "action", children: [isLike ? (_jsx("span", { className: "liked", onClick: () => setIsLike(false), children: _jsx(FaHeart, {}) })) : (_jsx("span", { className: "like", onClick: () => setIsLike(true), children: _jsx(FaHeart, {}) })), _jsx("p", { children: "11 l\u01B0\u1EE3t th\u00EDch" })] })] }));
};
export default AnswerFeedbackTutor;
