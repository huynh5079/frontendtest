import { FC, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListReschedule, selectUserLogin } from "../../../app/selector";
import { getAllRescheduleApiThunk } from "../../../services/reschedule/rescheduleThunk";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { getStatusText } from "../../../utils/helper";

const ITEMS_PER_PAGE = 6;

const TutorListReschedulePage: FC = () => {
    const dispatch = useAppDispatch();

    const userLogin = useAppSelector(selectUserLogin);
    const reschedules = useAppSelector(selectListReschedule);

    const totalAll = reschedules?.length || 0;
    const totalPersonal =
        reschedules?.filter(
            (item) => item.requesterName === userLogin?.username,
        ).length || 0;

    const totalStudent =
        reschedules?.filter(
            (item) => item.requesterName !== userLogin?.username,
        ).length || 0;

    const [currentPage, setCurrentPage] = useState(1);
    const [tabActive, setTabActive] = useState("all");

    const filteredReschedules = useMemo(() => {
        if (!reschedules || !userLogin) return [];

        switch (tabActive) {
            case "personal":
                return reschedules.filter(
                    (item) => item.requesterName === userLogin.username,
                );
            case "student":
                return reschedules.filter(
                    (item) => item.requesterName !== userLogin.username,
                );
            default:
                return reschedules;
        }
    }, [reschedules, tabActive, userLogin]);

    useEffect(() => {
        dispatch(getAllRescheduleApiThunk());
    }, [dispatch]);

    /* Pagination */
    const totalPages = Math.ceil(
        (filteredReschedules.length || 0) / ITEMS_PER_PAGE,
    );

    const paginatedItems = filteredReschedules.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handleChangeTab = (tab: string) => {
        setTabActive(tab);
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.reschedule.detail.replace(":id", id);
        navigateHook(url);
    };

    return (
        <section id="tutor-list-reschedule-section">
            <div className="tlrs-container">
                <div className="tlrscr1">
                    <h4>Danh sánh</h4>
                    <p>
                        Trang tổng quát <span>Đơn dời lịch dạy</span>
                    </p>
                </div>
                <div className="tlrscr2">
                    <div
                        className={`tlrscr2-item ${
                            tabActive === "all" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("all")}
                    >
                        <FaListUl className="tlrscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{totalAll} đơn</p>
                        </div>
                    </div>

                    <div
                        className={`tlrscr2-item ${
                            tabActive === "personal" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("personal")}
                    >
                        <FaArrowCircleUp className="tlrscr2-item-icon" />
                        <div className="amount">
                            <h5>Bản thân</h5>
                            <p>{totalPersonal} đơn</p>
                        </div>
                    </div>

                    <div
                        className={`tlrscr2-item ${
                            tabActive === "student" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("student")}
                    >
                        <FaArrowCircleDown className="tlrscr2-item-icon" />
                        <div className="amount">
                            <h5>Học viên</h5>
                            <p>{totalStudent} đơn</p>
                        </div>
                    </div>
                </div>

                <div className="tlrscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Người gửi yêu cầu
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedItems && paginatedItems.length > 0 ? (
                                paginatedItems.map((reschedule) => (
                                    <tr key={reschedule.id}>
                                        <td className="table-body-cell">
                                            {reschedule.requesterName}
                                        </td>
                                        <td className="table-body-cell">
                                            {getStatusText(reschedule.status)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="pr-btn"
                                                onClick={() =>
                                                    handleViewDetail(
                                                        reschedule.id,
                                                    )
                                                }
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="table-body-cell no-data"
                                    >
                                        Chưa có yêu cầu dời lịch nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination mt-4">
                            <button
                                className="sc-btn mr-2"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                className="sc-btn ml-2"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TutorListReschedulePage;
