import { useEffect, type FC } from "react";
import { FiterTutor } from "../../../../components/tutor/list";
import { TutorCard } from "../../../../components/card";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    selectIsAuthenticated,
    selectListPublicTutors,
    selectUserLogin,
} from "../../../../app/selector";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../../routes/routeName";
import { publicGetAllTutorsApiThunk } from "../../../../services/public/tutor/tutorThunk";
import { useDocumentTitle, USER_PARENT, USER_STUDENT } from "../../../../utils/helper";

const ListTutorPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const tutors = useAppSelector(selectListPublicTutors)?.items || [];
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);

    // ==========================
    //  Điều hướng vào trang detail
    // ==========================
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

    // ==========================
    //  Lấy page từ URL
    // ==========================
    const query = new URLSearchParams(location.search);
    const pageParam = query.get("page");
    const pageNumber = Number(pageParam);

    // ==========================
    //  Xử lý redirect + call API
    // ==========================
    useEffect(() => {
        // Chờ user load xong (tình trạng login xong user.role chưa có)
        if (isAuthenticated && !user) return;

        // Validate page
        const isInvalid = !pageParam || isNaN(pageNumber) || pageNumber < 1;

        if (isInvalid) {
            let redirectUrl = "/tutor?page=1";

            if (isAuthenticated && user?.role === USER_STUDENT) {
                redirectUrl = "/student/tutor?page=1";
            } else if (isAuthenticated && user?.role === USER_PARENT) {
                redirectUrl = "/parent/tutor?page=1";
            }

            navigate(redirectUrl, { replace: true });
            return;
        }

        // Page hợp lệ -> gọi API
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
                        <FiterTutor />
                    </div>

                    <div className="ltscr2c2">
                        {tutors.map((tutor) => (
                            <TutorCard
                                key={tutor.tutorId}
                                tutor={tutor}
                                handeleToDetailTutor={handleToDetail}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListTutorPage;
