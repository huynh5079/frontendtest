import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaUsers } from "react-icons/fa";
import { format } from "date-fns";
const CourseDetaiTutorCard = ({ course, }) => {
    const formatBadgeColor = {
        "Trực tuyến": "badge-online",
        "Tại lớp học": "badge-offline",
    };
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (_jsx(FaStar, { className: index < Math.floor(rating) ? "star active" : "star" }, index)));
    };
    // 👉 Logic cho title scroll
    const wrapperRef = useRef(null);
    const textRef = useRef(null);
    const [shift, setShift] = useState(0);
    const [hover, setHover] = useState(false);
    useEffect(() => {
        if (wrapperRef.current && textRef.current) {
            const wrapperWidth = wrapperRef.current.offsetWidth;
            const textWidth = textRef.current.scrollWidth;
            if (textWidth > wrapperWidth) {
                setShift(wrapperWidth - textWidth);
            }
            else {
                setShift(0);
            }
        }
    }, [course.subject]);
    return (_jsx("div", { className: "course-card course-detail-tutor-card", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), children: _jsxs("div", { className: "course-card__content", children: [_jsxs("div", { className: "course-card__header", children: [_jsx("div", { className: "course-card__title-wrapper", ref: wrapperRef, children: _jsxs("h2", { ref: textRef, className: "course-card__title", style: {
                                    transform: hover
                                        ? `translateX(${shift}px)`
                                        : "translateX(0)",
                                    transition: "transform 0.5s linear",
                                }, children: [course.subject, " ", course.classLevel] }) }), _jsx("span", { className: `course-card__badge ${formatBadgeColor[course.format]}`, children: course.format })] }), _jsxs("div", { className: "course-card__students", children: [_jsx(FaMapMarkerAlt, { className: "icon" }), _jsx("span", { children: course.address })] }), _jsxs("div", { className: "course-card__rating", children: [renderStars(course.rating), _jsxs("span", { className: "course-card__reviews", children: ["(", course.reviews, " \u0111\u00E1nh gi\u00E1)"] })] }), _jsxs("div", { className: "course-card__students", children: [_jsx(FaUsers, { className: "icon" }), _jsxs("span", { children: [course.students, " h\u1ECDc vi\u00EAn \u0111\u00E3 \u0111\u0103ng k\u00FD"] })] }), _jsxs("div", { className: "course-card__date", children: ["B\u1EAFt \u0111\u1EA7u: ", format(course.startDate, "dd/MM/yyyy")] }), _jsxs("div", { className: "course-card__footer", children: [_jsx("div", { className: "course-card__price", children: _jsxs("span", { className: "course-card__current-price", children: [course.price.toLocaleString(), "\u0111 / th\u00E1ng"] }) }), _jsx("button", { className: "pr-btn course-card__btn", children: "\u0110\u0103ng k\u00FD ngay" })] })] }) }));
};
export default CourseDetaiTutorCard;
