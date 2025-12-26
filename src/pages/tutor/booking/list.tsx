import { useEffect, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListBookingForTutor } from "../../../app/selector";
import { getAllBookingForTutorApiThunk } from "../../../services/tutor/booking/bookingThunk";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import {
    formatDate,
    getStatusText,
    useDocumentTitle,
} from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import {
    MdCancel,
    MdCheckCircle,
    MdListAlt,
    MdPendingActions,
} from "react-icons/md";

const ListTutorBookingPage: FC = () => {
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectListBookingForTutor);

    const pendingBookings =
        bookings?.filter((b) => b.status === "Pending") || [];
    const approvedBookings =
        bookings?.filter((b) => b.status === "Approved") || [];
    const rejectedBookings =
        bookings?.filter((b) => b.status === "Rejected") || [];

    // 🔥 Filter State
    const [filterStatus, setFilterStatus] = useState<
        "All" | "Pending" | "Approved" | "Rejected"
    >("All");

    // 🔥 Data được lọc theo filterStatus
    const filteredData =
        filterStatus === "All"
            ? bookings
            : bookings?.filter((b) => b.status === filterStatus);

    useEffect(() => {
        dispatch(getAllBookingForTutorApiThunk());
    }, [dispatch]);

    const handleViewDetail = (id: string) => {
        const url = routes.tutor.booking.detail.replace(":id", id);
        navigateHook(url);
    };

    useDocumentTitle("Danh sách lịch đặt");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Tổng số trang
    const totalPages = filteredData
        ? Math.ceil(filteredData.length / itemsPerPage)
        : 1;

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData?.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // reset khi đổi filter
    }, [filterStatus]);

    return (
        <section id="list-tutor-booking-section">
            <div className="ltbs-container">
                <div className="ltbscr1">
                    <h4>Danh sách</h4>
                    <p>
                        Trang tổng quát <span>Lịch đặt</span>
                    </p>
                </div>

                {/* 🔥 FILTER UI */}
                <div className="ltbscr2">
                    {/* ALL */}
                    <div
                        className={`ltbscr2-item ${
                            filterStatus === "All" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("All")}
                    >
                        <MdListAlt className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{bookings?.length || 0} đơn</p>
                        </div>
                    </div>

                    {/* Pending */}
                    <div
                        className={`ltbscr2-item ${
                            filterStatus === "Pending" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("Pending")}
                    >
                        <MdPendingActions className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Đợi xử lí</h5>
                            <p>{pendingBookings.length} đơn</p>
                        </div>
                    </div>

                    {/* Approved */}
                    <div
                        className={`ltbscr2-item ${
                            filterStatus === "Approved" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("Approved")}
                    >
                        <MdCheckCircle className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã chấp thuận</h5>
                            <p>{approvedBookings.length} đơn</p>
                        </div>
                    </div>

                    {/* Rejected */}
                    <div
                        className={`ltbscr2-item ${
                            filterStatus === "Rejected" ? "active" : ""
                        }`}
                        onClick={() => setFilterStatus("Rejected")}
                    >
                        <MdCancel className="ltbscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã từ chối</h5>
                            <p>{rejectedBookings.length} đơn</p>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="ltbscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Tên người đặt
                                </th>
                                <th className="table-head-cell">Môn học</th>
                                <th className="table-head-cell">Cấp bậc học</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian gửi
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="table-body">
                            {paginatedData && paginatedData.length > 0 ? (
                                paginatedData.map((booking) => (
                                    <tr
                                        className="table-body-row"
                                        key={booking.id}
                                    >
                                        <td className="table-body-cell">
                                            {booking.studentName}
                                        </td>
                                        <td className="table-body-cell">
                                            {booking.subject}
                                        </td>
                                        <td className="table-body-cell">
                                            {booking.educationLevel}
                                        </td>
                                        <td className="table-body-cell">
                                            {getStatusText(booking.status)}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDate(booking.createdAt)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="pr-btn"
                                                onClick={() =>
                                                    handleViewDetail(booking.id)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-body-row">
                                    <td
                                        className="table-body-cell no-data"
                                        colSpan={6}
                                    >
                                        Không có dữ liệu
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

export default ListTutorBookingPage;
