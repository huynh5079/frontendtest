import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { csvToArray } from "../../utils/helper";
// const StarRating: FC<{ rating: number }> = ({ rating }) => {
//     return (
//         <div className="star-rating">
//             {[...Array(5)].map((_, index) => (
//                 <FaStar
//                     key={index}
//                     className={
//                         index < Math.floor(rating) ? "star filled" : "star"
//                     }
//                 />
//             ))}
//         </div>
//     );
// };
const TutorCard = ({ tutor, handeleToDetailTutor }) => {
    const subjects = csvToArray(tutor?.teachingSubjects || "");
    return (_jsxs("div", { className: "tutor-card-container", children: [_jsx("div", { className: "ttc-image", children: _jsx("img", { src: tutor.avatarUrl, alt: tutor.username, loading: "lazy", onError: (e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
                    } }) }), _jsxs("div", { className: "ttc-info", children: [_jsx("h3", { className: "ttci-name", children: tutor.username }), _jsx("div", { className: "ttci-specialties", children: subjects.map((subject, index) => (_jsx("p", { className: "ttci-specialty", children: subject }, index))) })] }), _jsx("button", { className: "ttc-btn", onClick: () => handeleToDetailTutor(tutor.tutorId), children: "Xem th\u00F4ng tin" })] }));
};
export default TutorCard;
