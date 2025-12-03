import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { FaBook, FaUsers } from "react-icons/fa";
import { format } from "date-fns";
import { routes } from "../../routes/routeName";
import { navigateHook } from "../../routes/routeApp";
import { selectIsAuthenticated, selectUserLogin } from "../../app/selector";
import { useAppSelector } from "../../app/store";
import { USER_PARENT, USER_STUDENT } from "../../utils/helper";
const CourseCard = ({ course }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    // const renderStars = (rating: number) => {
    //     return [...Array(5)].map((_, index) => (
    //         <FaStar
    //             key={index}
    //             className={index < Math.floor(rating) ? "star active" : "star"}
    //         />
    //     ));
    // };
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
    }, [course.title]);
    const formatBadgeColor = {
        Online: "badge-online",
        Offline: "badge-offline",
    };
    const handleViewDetail = (classId) => {
        if (!isAuthenticated) {
            navigateHook(routes.course.detail.replace(":id", classId));
            return;
        }
        if (user?.role === USER_STUDENT) {
            navigateHook(routes.student.course.detail.replace(":id", classId));
            return;
        }
        if (user?.role === USER_PARENT) {
            navigateHook(routes.parent.course.detail.replace(":id", classId));
            return;
        }
    };
    return (_jsx("div", { className: "course-card", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), children: _jsxs("div", { className: "course-card__content", children: [_jsxs("div", { className: "course-card__header", children: [_jsx("div", { className: "course-card__title-wrapper", ref: wrapperRef, children: _jsx("h2", { ref: textRef, className: "course-card__title", style: {
                                    transform: hover
                                        ? `translateX(${shift}px)`
                                        : "translateX(0)",
                                    transition: "transform 0.5s linear",
                                }, children: course.title }) }), _jsx("span", { className: `course-card__badge ${formatBadgeColor[course.mode]}`, children: course.mode })] }), _jsxs("div", { className: "course-card__students", children: [_jsx(FaBook, { className: "icon" }), _jsxs("span", { children: [course.subject, " ", course.educationLevel] })] }), _jsxs("div", { className: "course-card__students", children: [_jsx(FaUsers, { className: "icon" }), _jsxs("span", { children: [course.studentLimit, " su\u1EA5t \u0111\u0103ng k\u00FD"] })] }), _jsxs("div", { className: "course-card__students", children: [_jsx(FaUsers, { className: "icon" }), _jsxs("span", { children: [course.currentStudentCount, " h\u1ECDc vi\u00EAn \u0111\u00E3 \u0111\u0103ng k\u00FD"] })] }), _jsxs("div", { className: "course-card__date", children: ["B\u1EAFt \u0111\u1EA7u: ", format(course.classStartDate, "dd/MM/yyyy")] }), _jsxs("div", { className: "course-card__footer", children: [_jsx("div", { className: "course-card__price", children: _jsxs("span", { className: "course-card__current-price", children: [course.price.toLocaleString(), "\u0111 / th\u00E1ng"] }) }), _jsx("button", { className: "pr-btn course-card__btn", onClick: () => {
                                handleViewDetail(course.id);
                            }, children: "\u0110\u0103ng k\u00FD ngay" })] })] }) }));
};
export default CourseCard;
