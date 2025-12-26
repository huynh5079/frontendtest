import { useEffect, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectListPublicTutors,
    selectIsAuthenticated,
    selectUserLogin,
} from "../../../../app/selector";
import { routes } from "../../../../routes/routeName";
import { publicGetAllTutorsApiThunk } from "../../../../services/public/tutor/tutorThunk";
import {
    useDocumentTitle,
    USER_PARENT,
    USER_STUDENT,
} from "../../../../utils/helper";
import { TutorCard } from "../../../../components/card";
import FilterTutor, {
    filterTutors,
} from "../../../../components/tutor/list/fiterTutor";

const ListTutorPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);

    const tutorsResponse = useAppSelector(selectListPublicTutors);

    const tutors = tutorsResponse?.items || [];
    const currentPage = tutorsResponse?.page || 1;
    const pageSize = tutorsResponse?.size || 6;
    const totalItems = tutorsResponse?.total || 0;

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const [filters, setFilters] = useState({
        name: "",
        level: "",
        subjects: [] as string[],
        address: "",
    });

    const filteredTutors = filterTutors(tutors, filters)
        .slice()
        .sort((a, b) => {
            const aHasRating = a.rating !== null;
            const bHasRating = b.rating !== null;

            // cả 2 cùng có hoặc cùng không → giữ nguyên thứ tự
            if (aHasRating === bHasRating) return 0;

            // tutor có đánh giá → lên trước
            return aHasRating ? -1 : 1;
        });

    // Điều hướng vào trang detail
    const handleToDetail = (tutorId: string) => {
        if (!isAuthenticated) {
            navigate(routes.tutor.detail.replace(":id", tutorId));
            return;
        }
        if (user?.role === USER_STUDENT) {
            navigate(routes.student.tutor.detail.replace(":id", tutorId));
            return;
        }
        if (user?.role === USER_PARENT) {
            navigate(routes.parent.tutor.detail.replace(":id", tutorId));
            return;
        }
    };

    // Lấy page từ URL + gọi API
    const query = new URLSearchParams(location.search);
    const pageParam = query.get("page");
    const pageNumber = Number(pageParam);

    useEffect(() => {
        if (isAuthenticated && !user) return;

        const isInvalid = !pageParam || isNaN(pageNumber) || pageNumber < 1;
        if (isInvalid) {
            let redirectUrl = "/tutor?page=1";
            if (isAuthenticated && user?.role === USER_STUDENT)
                redirectUrl = "/student/tutor?page=1";
            else if (isAuthenticated && user?.role === USER_PARENT)
                redirectUrl = "/parent/tutor?page=1";

            navigate(redirectUrl, { replace: true });
            return;
        }

        dispatch(publicGetAllTutorsApiThunk(pageNumber));
    }, [pageParam, pageNumber, isAuthenticated, user, dispatch, navigate]);

    const handleChangePage = (page: number) => {
        let basePath = "/tutor";

        if (isAuthenticated && user?.role === USER_STUDENT)
            basePath = "/student/tutor";
        else if (isAuthenticated && user?.role === USER_PARENT)
            basePath = "/parent/tutor";

        navigate(`${basePath}?page=${page}`);
    };

    useDocumentTitle("Danh sách gia sư");

    return (
        <section id="list-tutor-section">
            <div className="lts-container">
                <div className="ltscr1">
                    <h2>Danh sách gia sư</h2>
                </div>

                <div className="ltscr2">
                    <div className="ltscr2c1">
                        <FilterTutor onFilterChange={setFilters} />
                    </div>

                    <div className="ltscr2c2">
                        <div className="ltscr2c2-tutors">
                            {filteredTutors.length > 0 ? (
                                filteredTutors.map((tutor) => (
                                    <TutorCard
                                        key={tutor.tutorId}
                                        tutor={tutor}
                                        handeleToDetailTutor={() =>
                                            handleToDetail(tutor.tutorId)
                                        }
                                    />
                                ))
                            ) : (
                                <p>Không tìm thấy gia sư phù hợp.</p>
                            )}
                        </div>

                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                className={
                                    currentPage === 1 ? "disable-btn" : "sc-btn"
                                }
                                onClick={() =>
                                    handleChangePage(currentPage - 1)
                                }
                            >
                                Trang trước
                            </button>

                            <span>
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                className={
                                    currentPage === totalPages
                                        ? "disable-btn"
                                        : "sc-btn"
                                }
                                onClick={() =>
                                    handleChangePage(currentPage + 1)
                                }
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListTutorPage;
