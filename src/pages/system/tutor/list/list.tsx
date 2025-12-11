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

    const tutors = useAppSelector(selectListPublicTutors)?.items || [];
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);

    const [filters, setFilters] = useState({
        name: "",
        level: "",
        subjects: [] as string[],
    });

    // Lọc FE
    const filteredTutors = filterTutors(tutors, filters);

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
                </div>
            </div>
        </section>
    );
};

export default ListTutorPage;
