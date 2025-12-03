import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
const LandingTopTutors = () => {
    const tutors = [
        {
            id: 1,
            name: "TS. Nguyễn Thị Lan",
            specialty: ["Toán", "Vật lí"],
            rating: 4.9,
            totalReviews: 128,
            profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
            id: 2,
            name: "ThS. Trần Minh Quang",
            specialty: ["Tin học"],
            rating: 4.7,
            totalReviews: 95,
            profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        },
        {
            id: 3,
            name: "TS. Lê Hoàng Anh",
            specialty: ["Sinh học", "Hóa học"],
            rating: 4.8,
            totalReviews: 156,
            profileImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
        },
    ];
    const RatingStars = ({ rating }) => (_jsxs("div", { className: "rating-stars", children: [[...Array(5)].map((_, index) => (_jsx("span", { children: index < Math.floor(rating) ? (_jsx(FaStar, { className: "star filled" })) : (_jsx(FaRegStar, { className: "star" })) }, index))), _jsx("span", { className: "rating-value", children: rating })] }));
    const TutorCard = ({ tutor }) => {
        const [imageError, setImageError] = useState(false);
        return (_jsxs("div", { className: "tutor-card", children: [_jsx("div", { className: "tutor-image", children: _jsx("img", { src: imageError
                            ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
                            : tutor.profileImage, alt: tutor.name, onError: () => setImageError(true), loading: "lazy" }) }), _jsx("h3", { className: "tutor-name", children: tutor.name }), _jsx("p", { className: "tutor-specialty", children: tutor.specialty }), _jsxs("div", { className: "tutor-rating", children: [_jsx(RatingStars, { rating: tutor.rating }), _jsxs("p", { className: "review-count", children: [tutor.totalReviews, " \u0111\u00E1nh gi\u00E1"] })] }), _jsx("button", { className: "view-details-btn", "aria-label": `View details for ${tutor.name}`, children: "Xem th\u00F4ng tin" })] }));
    };
    return (_jsx("div", { className: "top-rated-tutors", children: tutors.length > 0 ? (_jsx("div", { className: "tutors-grid", children: tutors.map((tutor) => (_jsx(TutorCard, { tutor: tutor }, tutor.id))) })) : (_jsx("div", { className: "no-tutors", children: "Hi\u00EAn t\u1EA1i kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u kh\u1EA3 thi" })) }));
};
export default LandingTopTutors;
