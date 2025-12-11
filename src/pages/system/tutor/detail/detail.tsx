import { useEffect, useMemo, useState, type FC } from "react";
import { TutorDetailBannerImage } from "../../../../assets/images";
import { FaHeart } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { fakeDataCourses } from "../../../../utils/fakeData";
import { CourseDetaiTutorCard } from "../../../../components/card";
import { LoadingSpinner } from "../../../../components/elements";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectCheckFavoriteTutor,
    selectIsAuthenticated,
    selectPublicTutor,
    selectUserLogin,
} from "../../../../app/selector";
import { publicGetDetailTutorApiThunk } from "../../../../services/public/tutor/tutorThunk";
import {
    csvToArray,
    useDocumentTitle,
    USER_PARENT,
    USER_STUDENT,
} from "../../../../utils/helper";
import { RemindLoginModal } from "../../../../components/modal";
import { toast } from "react-toastify";
import { get } from "lodash";
import {
    checkFavoriteTutorApiThunk,
    deleteFavoriteTutorApiThunk,
    favoriteTutorApiThunk,
} from "../../../../services/favoriteTutor/favoriteTutorThunk";
import { TutorFeedback } from "../../../../components/tutor/detail";

const DetailTutorPage: FC = () => {
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
    const subjects = useMemo(
        () => csvToArray(tutor?.teachingSubjects || ""),
        [tutor?.teachingSubjects],
    );

    const teachingLevels = useMemo(
        () => csvToArray(tutor?.teachingLevel || ""),
        [tutor?.teachingLevel],
    );

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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        navigate(`?tab=${tab}`, { replace: true });
    };

    /** ============ BOOKING ============== */
    const handleBooking = (tutorId: string) => {
        if (!isAuthenticated) return setOpenRemindLogin(true);

        if (user?.role === USER_STUDENT) {
            navigateHook(routes.student.tutor.book.replace(":id", tutorId));
        } else if (user?.role === USER_PARENT) {
            navigateHook(routes.parent.tutor.book.replace(":id", tutorId));
        }
    };

    /** ============ FAVORITE / UNFAVORITE ============== */
    const toggleFavorite = (tutorProfileId: string) => {
        if (!isAuthenticated) return setOpenRemindLogin(true);

        setLoadingFavorite(true);

        const action = isFavorited?.isFavorited
            ? deleteFavoriteTutorApiThunk
            : favoriteTutorApiThunk;

        dispatch(action(tutorProfileId))
            .unwrap()
            .then((res) => {
                toast.success(
                    get(
                        res,
                        "data.message",
                        isFavorited?.isFavorited
                            ? "Đã xoá khỏi danh sách ưu thích"
                            : "Đã lưu vào danh sách ưu thích",
                    ),
                );
                dispatch(checkFavoriteTutorApiThunk(tutorProfileId));
            })
            .catch((err) => {
                toast.error(get(err, "data.message", "Có lỗi xảy ra"));
            })
            .finally(() => setLoadingFavorite(false));
    };

    /** ============ PAGE TITLE ============== */
    useDocumentTitle(`Gia sư ${tutor?.username}`);

    /** ============ JSX ============== */
    return (
        <section id="detail-tutor-section">
            <div className="dts-container">
                {/* Banner */}
                <div className="dtscr1">
                    <img src={TutorDetailBannerImage} alt="" />
                </div>

                {/* Main Content */}
                <div className="dtscr2">
                    {/* ======= HEADER THÔNG TIN GIA SƯ ======= */}
                    <div className="dtscr2c1">
                        <img src={tutor?.avatarUrl} className="avatar" />
                        <div className="info">
                            <h3 className="name">{tutor?.username}</h3>
                            <p className="rating">⭐ 4.8 (120 đánh giá)</p>
                        </div>

                        <div className="action">
                            <button
                                className={
                                    loadingFavorite
                                        ? "disable-btn"
                                        : isFavorited?.isFavorited
                                        ? "delete-btn"
                                        : "sc-btn"
                                }
                                onClick={() =>
                                    toggleFavorite(
                                        String(tutor?.tutorProfileId),
                                    )
                                }
                            >
                                {loadingFavorite ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <FaHeart className="icon" />
                                        {isFavorited?.isFavorited
                                            ? "Bỏ ưu thích"
                                            : "Ưu thích"}
                                    </>
                                )}
                            </button>

                            <button
                                className="pr-btn"
                                onClick={() =>
                                    handleBooking(String(tutor?.tutorId))
                                }
                            >
                                Đặt lịch
                            </button>
                        </div>
                    </div>

                    {/* ======= TAB ======= */}
                    <div className="dtscr2c2">
                        <div className="tabs">
                            {[
                                { key: "gioithieu", label: "Giới thiệu" },
                                { key: "lophoc", label: "Lớp học của gia sư" },
                                { key: "danhgia", label: "Đánh giá" },
                            ].map((tab) => (
                                <div
                                    key={tab.key}
                                    className={`tabs-item ${
                                        activeTab === tab.key
                                            ? "tabs-item-actived"
                                            : ""
                                    }`}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    {tab.label}
                                </div>
                            ))}
                        </div>

                        {/* ===== TAB GIỚI THIỆU ===== */}
                        {activeTab === "gioithieu" && (
                            <>
                                <div className="tabs-content">
                                    <h4>Giới thiệu bản thân</h4>
                                    <p>{tutor?.bio}</p>
                                </div>

                                <div className="tabs-content">
                                    <h4>Học vấn</h4>
                                    <p>
                                        <span>Trường:</span>
                                        {"   "}
                                        {tutor?.educationLevel}{" "}
                                        {tutor?.university}
                                    </p>
                                    <p>
                                        <span>Chuyên ngành:</span>
                                        {"   "}
                                        {tutor?.major}
                                    </p>
                                    <p>
                                        <span>Kinh nghiệm giảng dạy:</span>
                                        {"   "}
                                        {tutor?.teachingExperienceYears} năm
                                    </p>
                                </div>

                                <div className="tabs-content">
                                    <h4>Cấp bậc dạy học</h4>
                                    {teachingLevels.map((item, i) => (
                                        <p key={i}>{item}</p>
                                    ))}
                                </div>

                                <div className="tabs-content">
                                    <h4>Môn dạy</h4>
                                    {subjects.map((item, i) => (
                                        <p key={i}>{item}</p>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ===== TAB LỚP HỌC ===== */}
                        {activeTab === "lophoc" && (
                            <div className="tabs-content">
                                <h4>Danh sách lớp học</h4>
                                <div className="list">
                                    {fakeDataCourses.map((course) => (
                                        <CourseDetaiTutorCard
                                            key={course.id}
                                            course={course}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ===== TAB ĐÁNH GIÁ ===== */}
                        {activeTab === "danhgia" && (
                            <div className="tabs-content">
                                <TutorFeedback
                                    tutorId={String(tutor?.tutorId)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RemindLoginModal
                isOpen={openRemindLogin}
                setIsOpen={setOpenRemindLogin}
            />
        </section>
    );
};

export default DetailTutorPage;
