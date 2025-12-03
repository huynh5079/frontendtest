import React, { useRef, useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaUsers } from "react-icons/fa";
import { format } from "date-fns";
import { Course } from "../../types/course";

interface CourseDetaiTutorCardProps {
    course: Course;
}

const CourseDetaiTutorCard: React.FC<CourseDetaiTutorCardProps> = ({
    course,
}) => {
    const formatBadgeColor: Record<Course["format"], string> = {
        "Trực tuyến": "badge-online",
        "Tại lớp học": "badge-offline",
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={index < Math.floor(rating) ? "star active" : "star"}
            />
        ));
    };

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
    }, [course.subject]);

    return (
        <div
            className="course-card course-detail-tutor-card"
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
                            {course.subject} {course.classLevel}
                        </h2>
                    </div>

                    <span
                        className={`course-card__badge ${
                            formatBadgeColor[course.format]
                        }`}
                    >
                        {course.format}
                    </span>
                </div>

                <div className="course-card__students">
                    <FaMapMarkerAlt className="icon" />
                    <span>{course.address}</span>
                </div>

                <div className="course-card__rating">
                    {renderStars(course.rating)}
                    <span className="course-card__reviews">
                        ({course.reviews} đánh giá)
                    </span>
                </div>

                <div className="course-card__students">
                    <FaUsers className="icon" />
                    <span>{course.students} học viên đã đăng ký</span>
                </div>

                <div className="course-card__date">
                    Bắt đầu: {format(course.startDate, "dd/MM/yyyy")}
                </div>

                <div className="course-card__footer">
                    <div className="course-card__price">
                        <span className="course-card__current-price">
                            {course.price.toLocaleString()}đ / tháng
                        </span>
                    </div>
                    <button className="pr-btn course-card__btn">
                        Đăng ký ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetaiTutorCard;
