import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListFavoriteTutor } from "../../../app/selector";
import { getAllFavoriteTutorApiThunk } from "../../../services/favoriteTutor/favoriteTutorThunk";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";
import { useDocumentTitle } from "../../../utils/helper";

const ITEMS_PER_PAGE = 6;

const StudentFavoriteTutor: FC = () => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(selectListFavoriteTutor);

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil((favorites?.length || 0) / ITEMS_PER_PAGE);
    const paginatedItems = favorites?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        dispatch(getAllFavoriteTutorApiThunk());
    }, [dispatch]);

    const handleViewDetail = (id: string) => {
        const url = routes.student.tutor.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách gia sư yêu thích");

    return (
        <div className="student-favorite-tutor">
            <div className="sftr1">
                <h3>Danh sách gia sư yêu thích</h3>
            </div>

            <table className="table">
                <thead className="table-head">
                    <tr className="table-head-row">
                        <th className="table-head-cell">Hình đại diện</th>
                        <th className="table-head-cell">Tên gia sư</th>
                        <th className="table-head-cell">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="table-body">
                    {paginatedItems && paginatedItems.length > 0 ? (
                        paginatedItems.map((item) => (
                            <tr key={item.id}>
                                <td className="table-body-cell">
                                    <img
                                        src={item.tutorAvatar}
                                        alt={item.tutorName}
                                        className="w-10 h-10 rounded-full object-cover mx-auto"
                                    />
                                </td>
                                <td className="table-body-cell">
                                    {item.tutorName}
                                </td>
                                <td className="table-body-cell">
                                    <button
                                        className="pr-btn"
                                        onClick={() =>
                                            handleViewDetail(item.tutorUserId)
                                        }
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="table-body-cell no-data">
                                Chưa có gia sư nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="sc-btn"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="sc-btn"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentFavoriteTutor;
