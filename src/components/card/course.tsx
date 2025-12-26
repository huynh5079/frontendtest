import React, { useRef, useState, useEffect } from "react";
import { FaBook, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { format } from "date-fns";
import type { PublicClass } from "../../types/public";
import { routes } from "../../routes/routeName";
import { navigateHook } from "../../routes/routeApp";
import { selectIsAuthenticated, selectUserLogin } from "../../app/selector";
import { useAppSelector } from "../../app/store";
import { USER_PARENT, USER_STUDENT } from "../../utils/helper";

interface CourseCardProps {
    course: PublicClass;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [shift, setShift] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (wrapperRef.current && textRef.current) {
            const wrapperWidth = wrapperRef.current.offsetWidth;
            const textWidth = textRef.current.scrollWidth;

            if (textWidth > wrapperWidth) {
                setShift(wrapperWidth - textWidth);
            } else {
                setShift(0);
            }
        }
    }, [course.title]);

    const formatBadgeColor: Record<PublicClass["mode"], string> = {
        Online: "badge-online",
        Offline: "badge-offline",
    };

    const handleViewDetail = (classId: string) => {
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

    return (
        <div
            className="course-card"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="course-card__content">
                <div className="course-card__header">
                    <div
                        className="course-card__title-wrapper"
                        ref={wrapperRef}
                    >
                        <h2
                            ref={textRef}
                            className="course-card__title"
                            style={{
                                transform: hover
                                    ? `translateX(${shift}px)`
                                    : "translateX(0)",
                                transition: "transform 0.5s linear",
                            }}
                        >
                            {course.title}
                        </h2>
                    </div>

                    <span
                        className={`course-card__badge ${
                            formatBadgeColor[course.mode]
                        }`}
                    >
                        {course.mode === "Online"
                            ? "Trực tuyến"
                            : "Tại lớp học"}
                    </span>
                </div>

                <div className="course-card__students">
                    <FaBook className="icon" />
                    <span>
                        {course.subject} {course.educationLevel}
                    </span>
                </div>

                {course.mode === "Offline" && course.location && (
                    <div className="course-card__location">
                        <FaMapMarkerAlt className="icon" />
                        <span>{course.location}</span>
                    </div>
                )}

                {/* <div className="course-card__rating">
                    {renderStars(course.rating)}
                    <span className="course-card__reviews">
                        ({course.reviews} đánh giá)
                    </span>
                </div> */}

                <div className="course-card__students">
                    <FaUsers className="icon" />
                    <span>{course.studentLimit} suất đăng ký</span>
                </div>

                <div className="course-card__students">
                    <FaUsers className="icon" />
                    <span>
                        {course.currentStudentCount} học viên đã đăng ký
                    </span>
                </div>

                <div className="course-card__date">
                    Bắt đầu: {format(course.classStartDate, "dd/MM/yyyy")}
                </div>

                <div className="course-card__footer">
                    <div className="course-card__price">
                        <span className="course-card__current-price">
                            {course.price.toLocaleString()}đ / tháng
                        </span>
                    </div>
                    <button
                        className="pr-btn course-card__btn"
                        onClick={() => {
                            handleViewDetail(course.id);
                        }}
                    >
                        Đăng ký ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
