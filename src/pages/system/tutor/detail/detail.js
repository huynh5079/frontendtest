import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { TutorDetailBannerImage } from "../../../../assets/images";
import { FaHeart } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { fakeDataCourses } from "../../../../utils/fakeData";
import { CourseDetaiTutorCard } from "../../../../components/card";
import { FeedbackTutor, LoadingSpinner } from "../../../../components/elements";
import { MdFeedback } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectCheckFavoriteTutor, selectIsAuthenticated, selectPublicTutor, selectUserLogin, } from "../../../../app/selector";
import { publicGetDetailTutorApiThunk } from "../../../../services/public/tutor/tutorThunk";
import { csvToArray, useDocumentTitle, USER_PARENT, USER_STUDENT, } from "../../../../utils/helper";
import { RemindLoginModal } from "../../../../components/modal";
import { createFeedbackInTutorProfileApiThunk, getAllFeedbackInTutorProfileApiThunk, } from "../../../../services/feedback/feedbackThunk";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get } from "lodash";
import { checkFavoriteTutorApiThunk, deleteFavoriteTutorApiThunk, favoriteTutorApiThunk, } from "../../../../services/favoriteTutor/favoriteTutorThunk";
const DetailTutorPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const tutor = useAppSelector(selectPublicTutor);
    const user = useAppSelector(selectUserLogin);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isFavorited = useAppSelector(selectCheckFavoriteTutor);
    const [openRemindLogin, setOpenRemindLogin] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    /** ============ MEMO HOÁ DỮ LIỆU ============== */
    const subjects = useMemo(() => csvToArray(tutor?.teachingSubjects || ""), [tutor?.teachingSubjects]);
    const teachingLevels = useMemo(() => csvToArray(tutor?.teachingLevel || ""), [tutor?.teachingLevel]);
    /** ============ FETCH TUTOR DETAIL ============== */
    useEffect(() => {
        dispatch(publicGetDetailTutorApiThunk(String(id)));
    }, [id]);
    /** ============ CHECK FAVORITE ============== */
    useEffect(() => {
        if (tutor?.tutorProfileId && isAuthenticated) {
            dispatch(checkFavoriteTutorApiThunk(tutor.tutorProfileId));
        }
    }, [tutor?.tutorProfileId, isAuthenticated]);
    /** ============ TAB HANDLE ============== */
    const getActiveTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab") || "gioithieu";
    };
    const [activeTab, setActiveTab] = useState(getActiveTabFromURL());
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`?tab=${tab}`, { replace: true });
    };
    /** ============ BOOKING ============== */
    const handleBooking = (tutorId) => {
        if (!isAuthenticated)
            return setOpenRemindLogin(true);
        if (user?.role === USER_STUDENT) {
            navigateHook(routes.student.tutor.book.replace(":id", tutorId));
        }
        else if (user?.role === USER_PARENT) {
            navigateHook(routes.parent.tutor.book.replace(":id", tutorId));
        }
    };
    /** ============ FAVORITE / UNFAVORITE ============== */
    const toggleFavorite = (tutorProfileId) => {
        if (!isAuthenticated)
            return setOpenRemindLogin(true);
        setLoadingFavorite(true);
        const action = isFavorited?.isFavorited
            ? deleteFavoriteTutorApiThunk
            : favoriteTutorApiThunk;
        dispatch(action(tutorProfileId))
            .unwrap()
            .then((res) => {
            toast.success(get(res, "data.message", isFavorited?.isFavorited
                ? "Đã xoá khỏi danh sách ưu thích"
                : "Đã lưu vào danh sách ưu thích"));
            dispatch(checkFavoriteTutorApiThunk(tutorProfileId));
        })
            .catch((err) => {
            toast.error(get(err, "data.message", "Có lỗi xảy ra"));
        })
            .finally(() => setLoadingFavorite(false));
    };
    /** ============ PAGE TITLE ============== */
    useDocumentTitle(`Gia sư ${tutor?.username}`);
    /** ============ STAR COMPONENT ============== */
    const StarRating = ({ value, onChange }) => {
        return (_jsx("div", { className: "rating-stars", children: [1, 2, 3, 4, 5].map((star) => (_jsx("span", { onClick: () => onChange(star), style: {
                    cursor: "pointer",
                    color: star <= value ? "#FFD700" : "#ccc",
                    fontSize: "40px",
                    marginRight: "8px",
                }, children: "\u2605" }, star))) }));
    };
    /** ============ JSX ============== */
    return (_jsxs("section", { id: "detail-tutor-section", children: [_jsxs("div", { className: "dts-container", children: [_jsx("div", { className: "dtscr1", children: _jsx("img", { src: TutorDetailBannerImage, alt: "" }) }), _jsxs("div", { className: "dtscr2", children: [_jsxs("div", { className: "dtscr2c1", children: [_jsx("img", { src: tutor?.avatarUrl, className: "avatar" }), _jsxs("div", { className: "info", children: [_jsx("h3", { className: "name", children: tutor?.username }), _jsx("p", { className: "rating", children: "\u2B50 4.8 (120 \u0111\u00E1nh gi\u00E1)" })] }), _jsxs("div", { className: "action", children: [_jsx("button", { className: loadingFavorite
                                                    ? "disable-btn"
                                                    : isFavorited?.isFavorited
                                                        ? "delete-btn"
                                                        : "sc-btn", onClick: () => toggleFavorite(String(tutor?.tutorProfileId)), children: loadingFavorite ? (_jsx(LoadingSpinner, {})) : (_jsxs(_Fragment, { children: [_jsx(FaHeart, { className: "icon" }), isFavorited?.isFavorited
                                                            ? "Bỏ ưu thích"
                                                            : "Ưu thích"] })) }), _jsx("button", { className: "pr-btn", onClick: () => handleBooking(String(tutor?.tutorId)), children: "\u0110\u1EB7t l\u1ECBch" })] })] }), _jsxs("div", { className: "dtscr2c2", children: [_jsx("div", { className: "tabs", children: [
                                            { key: "gioithieu", label: "Giới thiệu" },
                                            { key: "lophoc", label: "Lớp học của gia sư" },
                                            { key: "danhgia", label: "Đánh giá" },
                                        ].map((tab) => (_jsx("div", { className: `tabs-item ${activeTab === tab.key
                                                ? "tabs-item-actived"
                                                : ""}`, onClick: () => handleTabChange(tab.key), children: tab.label }, tab.key))) }), activeTab === "gioithieu" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "tabs-content", children: [_jsx("h4", { children: "Gi\u1EDBi thi\u1EC7u b\u1EA3n th\u00E2n" }), _jsx("p", { children: tutor?.bio })] }), _jsxs("div", { className: "tabs-content", children: [_jsx("h4", { children: "H\u1ECDc v\u1EA5n" }), _jsxs("p", { children: ["Tr\u01B0\u1EDDng: ", tutor?.educationLevel, " ", tutor?.university] }), _jsxs("p", { children: ["Chuy\u00EAn ng\u00E0nh: ", tutor?.major] }), _jsxs("p", { children: ["Kinh nghi\u1EC7m gi\u1EA3ng d\u1EA1y:", " ", tutor?.teachingExperienceYears, " n\u0103m"] })] }), _jsxs("div", { className: "tabs-content", children: [_jsx("h4", { children: "C\u1EA5p b\u1EADc d\u1EA1y h\u1ECDc" }), teachingLevels.map((item, i) => (_jsx("p", { children: item }, i)))] }), _jsxs("div", { className: "tabs-content", children: [_jsx("h4", { children: "M\u00F4n d\u1EA1y" }), subjects.map((item, i) => (_jsx("p", { children: item }, i)))] })] })), activeTab === "lophoc" && (_jsxs("div", { className: "tabs-content", children: [_jsx("h4", { children: "Danh s\u00E1ch l\u1EDBp h\u1ECDc" }), _jsx("div", { className: "list", children: fakeDataCourses.map((course) => (_jsx(CourseDetaiTutorCard, { course: course }, course.id))) })] })), activeTab === "danhgia" && (_jsxs("div", { className: "tabs-content", children: [_jsx(Formik, { initialValues: {
                                                    comment: "",
                                                    rating: 0,
                                                }, validationSchema: Yup.object({
                                                    comment: Yup.string()
                                                        .required("Vui lòng nhập đánh giá")
                                                        .min(10, "Đánh giá phải ít nhất 10 ký tự"),
                                                    rating: Yup.number()
                                                        .min(1, "Vui lòng chọn số sao")
                                                        .required("Vui lòng chọn số sao"),
                                                }), onSubmit: (values, { resetForm }) => {
                                                    if (!isAuthenticated) {
                                                        setOpenRemindLogin(true);
                                                        return;
                                                    }
                                                    dispatch(createFeedbackInTutorProfileApiThunk({
                                                        tutorUserId: id,
                                                        params: values,
                                                    }))
                                                        .unwrap()
                                                        .then((res) => {
                                                        toast.success(get(res, "data.message", "Đánh giá thành công"));
                                                        dispatch(getAllFeedbackInTutorProfileApiThunk({
                                                            tutorUserId: id,
                                                            page: 1,
                                                            pageSize: 10,
                                                        }));
                                                        resetForm();
                                                    })
                                                        .catch((err) => {
                                                        toast.error(get(err, "data.message", "Có lỗi xảy ra"));
                                                    });
                                                }, children: ({ values, setFieldValue, isSubmitting, }) => (_jsxs(Form, { className: "form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: "\u0110\u00E1nh gi\u00E1" }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdFeedback, { className: "form-input-icon" }), _jsx(Field, { name: "comment", type: "text", className: "form-input", placeholder: "H\u00E3y \u0111\u1EC3 l\u1EA1i \u0111\u00E1nh gi\u00E1" })] }), _jsx(ErrorMessage, { name: "comment", component: "p", className: "text-error" })] }), _jsxs("div", { className: "form-field", children: [_jsx(StarRating, { value: values.rating, onChange: (star) => setFieldValue("rating", star) }), _jsx(ErrorMessage, { name: "rating", component: "p", className: "text-error" })] }), _jsx("button", { type: "submit", className: isSubmitting
                                                                ? "disable-btn"
                                                                : "pr-btn", children: isSubmitting ? (_jsx(LoadingSpinner, {})) : ("Đánh giá") })] })) }), _jsx(FeedbackTutor, { tutorId: id })] }))] })] })] }), _jsx(RemindLoginModal, { isOpen: openRemindLogin, setIsOpen: setOpenRemindLogin })] }));
};
export default DetailTutorPage;
