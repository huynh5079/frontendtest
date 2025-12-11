import { FC, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectNotifications } from "../../../app/selector";
import { getStatusText, timeAgo } from "../../../utils/helper";
import { Modal } from "../../modal";
import { NotificationResponseItem } from "../../../types/notification";
import {
    getMyNotificationsApiThunk,
    readNotificationApiThunk,
} from "../../../services/notification/notificationThunk";

const StudentNotifilcation: FC = () => {
    const notifications = useAppSelector(selectNotifications);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useAppDispatch();

    const ITEMS_PER_PAGE = 6;

    // --- Tổng số trang ---
    const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);

    // --- Lấy dữ liệu theo trang ---
    const paginatedNotifications = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return notifications.slice(start, start + ITEMS_PER_PAGE);
    }, [notifications, currentPage]);

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
        <div className="student-notification">
            <h3>Danh sách thông báo</h3>
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
                            <td colSpan={4} className="empty">
                                Không có thông báo
                            </td>
                        </tr>
                    )}

                    {paginatedNotifications.map((notification) => (
                        <tr className="table-body-row" key={notification.id}>
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
                        className={currentPage === 1 ? "disable-btn" : "sc-btn"}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
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
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Trang sau
                    </button>
                </div>
            )}
            <Modal isOpen={isModalOpen} setIsOpen={() => setIsModalOpen(false)}>
                <section id="detail-notification-modal">
                    <h3>{selectedNotification?.title}</h3>
                    <p>{selectedNotification?.message}</p>
                </section>
            </Modal>
        </div>
    );
};

export default StudentNotifilcation;
