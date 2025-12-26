import { FC, useState, useMemo } from "react";
import { FaBell, FaEnvelope, FaEnvelopeOpenText } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectNotifications } from "../../../app/selector";
import { timeAgo, getStatusText } from "../../../utils/helper";
import { NotificationResponseItem } from "../../../types/notification";
import {
    getMyNotificationsApiThunk,
    readNotificationApiThunk,
} from "../../../services/notification/notificationThunk";
import { Modal } from "../../../components/modal";

const TutorListNotificationPage: FC = () => {
    const notifications = useAppSelector(selectNotifications);
    const dispatch = useAppDispatch();

    const [activeFilter, setActiveFilter] = useState<"all" | "read" | "unread">(
        "all",
    );
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 6;

    // --- Lọc thông báo ---
    const filteredNotifications = useMemo(() => {
        if (activeFilter === "read")
            return notifications.filter((n) => n.status === "Read");
        if (activeFilter === "unread")
            return notifications.filter((n) => n.status === "Unread");
        return notifications;
    }, [notifications, activeFilter]);

    // --- Tổng số trang ---
    const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

    // --- Lấy dữ liệu theo trang ---
    const paginatedNotifications = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredNotifications, currentPage]);

    // --- Khi đổi filter thì reset page về 1 ---
    const handleFilterChange = (filter: "all" | "read" | "unread") => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] =
        useState<NotificationResponseItem | null>(null);

    const handleReadNotification = (notificationId: string) => {
        dispatch(readNotificationApiThunk(notificationId))
            .unwrap()
            .finally(() => {
                dispatch(
                    getMyNotificationsApiThunk({
                        pageNumber: 1,
                        pageSize: 200,
                    }),
                );
            });
    };

    const handleViewDetail = (notification: NotificationResponseItem) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        handleReadNotification(notification.id);
    };

    return (
        <section id="tutor-list-notification-section">
            <div className="tlns-container">
                <div className="tlnscr1">
                    <h4>Danh sách</h4>
                    <p>
                        Trang tổng quát <span>Thông báo</span>
                    </p>
                </div>

                {/* --- Bộ lọc --- */}
                <div className="tlnscr2">
                    <div
                        className={`tlnscr2-item ${
                            activeFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => handleFilterChange("all")}
                    >
                        <FaBell className="tlnscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{notifications.length} thông báo</p>
                        </div>
                    </div>

                    <div
                        className={`tlnscr2-item ${
                            activeFilter === "read" ? "active" : ""
                        }`}
                        onClick={() => handleFilterChange("read")}
                    >
                        <FaEnvelopeOpenText className="tlnscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã đọc</h5>
                            <p>
                                {
                                    notifications.filter(
                                        (n) => n.status === "Read",
                                    ).length
                                }{" "}
                                thông báo
                            </p>
                        </div>
                    </div>

                    <div
                        className={`tlnscr2-item ${
                            activeFilter === "unread" ? "active" : ""
                        }`}
                        onClick={() => handleFilterChange("unread")}
                    >
                        <FaEnvelope className="tlnscr2-item-icon" />
                        <div className="amount">
                            <h5>Chưa đọc</h5>
                            <p>
                                {
                                    notifications.filter(
                                        (n) => n.status === "Unread",
                                    ).length
                                }{" "}
                                thông báo
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Danh sách thông báo --- */}
                <div className="tlnscr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Tiêu đề</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">Thời gian</th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="table-body">
                            {paginatedNotifications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="no-data">
                                        Không có thông báo
                                    </td>
                                </tr>
                            )}

                            {paginatedNotifications.map((notification) => (
                                <tr
                                    className="table-body-row"
                                    key={notification.id}
                                >
                                    <td className="table-body-cell">
                                        {notification.title}
                                    </td>
                                    <td className="table-body-cell">
                                        {getStatusText(notification.status)}
                                    </td>
                                    <td className="table-body-cell">
                                        {timeAgo(notification.createdAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleViewDetail(notification)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* --- Phân trang --- */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                className={
                                    currentPage === 1 ? "disable-btn" : "sc-btn"
                                }
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                            >
                                Trang trước
                            </button>

                            <span>
                                {currentPage}/{totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                className={
                                    currentPage === totalPages
                                        ? "disable-btn"
                                        : "sc-btn"
                                }
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} setIsOpen={() => setIsModalOpen(false)}>
                <section id="detail-notification-modal">
                    <h3>{selectedNotification?.title}</h3>
                    <p>{selectedNotification?.message}</p>
                </section>
            </Modal>
        </section>
    );
};

export default TutorListNotificationPage;
