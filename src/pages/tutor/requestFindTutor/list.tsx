import { useEffect, useMemo, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListRequestFindTutorForTutor } from "../../../app/selector";
import { getAllRequestFindTutorForTutorApiThunk } from "../../../services/tutor/requestFindTutor/requestFindTutorThunk";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
import {
    FaListUl, // Tất cả
    FaClock, // Đợi xử lí
    FaCheckCircle, // Đã ứng tuyển
    FaTimesCircle, // Đã từ chối
} from "react-icons/fa";

const ListReuqestFindtutorForTutorPage: FC = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector(selectListRequestFindTutorForTutor);

    const totalAll = requests?.length || 0;
    const totalPending =
        requests?.filter((r) => r.status === "Pending").length || 0;
    const totalApplied =
        requests?.filter((r) => r.status === "Applied").length || 0;
    const totalRejected =
        requests?.filter((r) => r.status === "Rejected").length || 0;

    const [tabActive, setTabActive] = useState<
        "all" | "pending" | "applied" | "rejected"
    >("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredRequests = useMemo(() => {
        if (!requests) return [];

        switch (tabActive) {
            case "pending":
                return requests.filter((r) => r.status === "Pending");
            case "applied":
                return requests.filter((r) => r.status === "Applied");
            case "rejected":
                return requests.filter((r) => r.status === "Rejected");
            default:
                return requests;
        }
    }, [requests, tabActive]);

    const totalPages = Math.ceil((filteredRequests.length || 0) / itemsPerPage);

    const paginatedData = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    useEffect(() => {
        setCurrentPage(1); // reset khi đổi filter
    }, [requests]);

    useEffect(() => {
        dispatch(getAllRequestFindTutorForTutorApiThunk());
    }, [dispatch]);

    const handleChangeTab = (tab: typeof tabActive) => {
        setTabActive(tab);
        setCurrentPage(1);
    };

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.request.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách đơn tìm gia sư");

    return (
        <section id="list-request-find-tutor-for-tutor-section">
            <div className="lrftfts-container">
                <div className="lrftftscr1">
                    <h4>Danh sánh</h4>
                    <p>
                        Trang tổng quát <span>Đơn tìm gia sư</span>
                    </p>
                </div>
                <div className="lrftftscr2">
                    <div
                        className={`lrftftscr2-item ${
                            tabActive === "all" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("all")}
                    >
                        <FaListUl className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{totalAll} đơn</p>
                        </div>
                    </div>

                    <div
                        className={`lrftftscr2-item ${
                            tabActive === "pending" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("pending")}
                    >
                        <FaClock className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Đợi xử lí</h5>
                            <p>{totalPending} đơn</p>
                        </div>
                    </div>

                    <div
                        className={`lrftftscr2-item ${
                            tabActive === "applied" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("applied")}
                    >
                        <FaCheckCircle className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã ứng tuyển</h5>
                            <p>{totalApplied} đơn</p>
                        </div>
                    </div>

                    <div
                        className={`lrftftscr2-item ${
                            tabActive === "rejected" ? "active" : ""
                        }`}
                        onClick={() => handleChangeTab("rejected")}
                    >
                        <FaTimesCircle className="lrftftscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã từ chối</h5>
                            <p>{totalRejected} đơn</p>
                        </div>
                    </div>
                </div>

                <div className="lrftftscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Tên người đặt
                                </th>
                                <th className="table-head-cell">Môn học</th>
                                <th className="table-head-cell">Cấp bậc học</th>
                                <th className="table-head-cell">
                                    Thời gian gửi
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedData && paginatedData.length > 0 ? (
                                paginatedData.map((request) => (
                                    <tr
                                        className="table-body-row"
                                        key={request.id}
                                    >
                                        <td className="table-body-cell">
                                            {request.studentName}
                                        </td>
                                        <td className="table-body-cell">
                                            {request.subject}
                                        </td>
                                        <td className="table-body-cell">
                                            {request.educationLevel}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="pr-btn"
                                                onClick={() =>
                                                    handleViewDetail(request.id)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="table-body-cell no-data"
                                    >
                                        Chưa có yêu cầu nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="sc-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Trang trước
                            </button>

                            <span>
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                className="sc-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ListReuqestFindtutorForTutorPage;
