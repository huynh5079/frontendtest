import { useEffect, useState, type FC } from "react";
import { FaListUl } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useDocumentTitle, formatDate } from "../../../../utils/helper";
import { LoadingSpinner } from "../../../../components/elements";
import { useNavigate } from "react-router-dom";
import {
    adminGetNotificationsHistoryApi,
    type NotificationHistoryItem,
} from "../../../../services/admin/notification/adminNotificationApi";
import { toast } from "react-toastify";
import { get } from "lodash";
import "../../../../assets/scss/admin/manage/notification/admin_list_notification.scss";

interface NotificationItem {
    id: string;
    title: string;
    content: string;
    recipientType: "Student" | "Parent" | "Tutor" | "All";
    sentDate: string;
    recipientCount?: number;
}

const AdminListNotificationPage: FC = () => {
    useDocumentTitle("Danh sách thông báo");
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [tabActive, setTabActive] = useState<
        "all" | "student" | "parent" | "tutor" | "allRecipient"
    >("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPageClient = 6;

    // Fetch notifications from API
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await adminGetNotificationsHistoryApi(1, 100); // Lấy 100 items đầu tiên
                const items = get(
                    response,
                    "items",
                    [],
                ) as NotificationHistoryItem[];
                const mappedItems: NotificationItem[] = items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    recipientType: item.recipientType as any,
                    sentDate: item.sentDate,
                    recipientCount: item.recipientCount,
                }));
                setNotifications(mappedItems);
            } catch (error: any) {
                const errorMessage = get(
                    error,
                    "response.data.message",
                    get(
                        error,
                        "message",
                        "Có lỗi xảy ra khi tải danh sách thông báo",
                    ),
                );
                toast.error(errorMessage);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getRecipientTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            Student: "Học viên",
            Parent: "Phụ huynh",
            Tutor: "Gia sư",
            All: "Tất cả",
        };
        return typeMap[type] || type;
    };

    const filteredNotifications = notifications.filter((n) => {
        if (tabActive === "all") return true;
        if (tabActive === "student") return n.recipientType === "Student";
        if (tabActive === "parent") return n.recipientType === "Parent";
        if (tabActive === "tutor") return n.recipientType === "Tutor";
        if (tabActive === "allRecipient") return n.recipientType === "All";
        return true;
    });

    const countByType = (type: string) =>
        notifications.filter((n) =>
            type === "all"
                ? true
                : type === "allRecipient"
                ? n.recipientType === "All"
                : n.recipientType.toLowerCase() === type,
        ).length;

    // Client-side pagination for display (show 10 items per page)
    const totalPages = Math.ceil(
        filteredNotifications.length / itemsPerPageClient,
    );

    const startIndex = (currentPage - 1) * itemsPerPageClient;

    const paginatedNotifications = filteredNotifications.slice(
        startIndex,
        startIndex + itemsPerPageClient,
    );

    // Reset client page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [tabActive]);

    return (
        <section id="admin-list-notification-section">
            <div className="alns-container">
                <div className="alnscr1">
                    <div className="alnscr1-header">
                        <div>
                            <h4>Thông báo</h4>
                        </div>
                        <button
                            className="btn-send-notification"
                            onClick={() => navigate("/admin/notification/send")}
                        >
                            <MdAdd />
                            Gửi thông báo
                        </button>
                    </div>
                </div>
                <div className="tabs">
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "student", label: "Học viên" },
                        { key: "parent", label: "Phụ huynh" },
                        { key: "tutor", label: "Gia sư" },
                        { key: "allRecipient", label: "Tất cả người dùng" },
                    ].map((t) => (
                        <div
                            key={t.key}
                            className={`tab ${
                                tabActive === t.key ? "active" : ""
                            }`}
                            onClick={() => {
                                setTabActive(t.key as any);
                                setCurrentPage(1);
                            }}
                        >
                            {t.label} ({countByType(t.key)})
                        </div>
                    ))}
                </div>

                <div className="alnscr3">
                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner />
                            <p>Đang tải danh sách thông báo...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="no-data">
                            <p>
                                {tabActive === "all"
                                    ? "Chưa có thông báo nào"
                                    : "Không có thông báo phù hợp"}
                            </p>
                        </div>
                    ) : (
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-head-row">
                                    <th className="table-head-cell">Tiêu đề</th>
                                    <th className="table-head-cell">
                                        Nội dung
                                    </th>
                                    <th className="table-head-cell">
                                        Loại người nhận
                                    </th>
                                    <th className="table-head-cell">
                                        Ngày gửi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {paginatedNotifications.length === 0 ? (
                                    <tr className="table-body-row">
                                        <td
                                            className="table-body-cell"
                                            colSpan={4}
                                        >
                                            Không có thông báo nào
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedNotifications.map(
                                        (notification) => (
                                            <tr
                                                className="table-body-row"
                                                key={notification.id}
                                            >
                                                <td className="table-body-cell">
                                                    <div className="notification-title">
                                                        {notification.title}
                                                    </div>
                                                </td>
                                                <td className="table-body-cell">
                                                    <div className="notification-content">
                                                        {notification.content}
                                                    </div>
                                                    {notification.recipientCount && (
                                                        <small
                                                            style={{
                                                                display:
                                                                    "block",
                                                                marginTop:
                                                                    "0.5rem",
                                                                color: "#666",
                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            Đã gửi cho{" "}
                                                            {
                                                                notification.recipientCount
                                                            }{" "}
                                                            người
                                                        </small>
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    <span
                                                        className={`recipient-type-badge recipient-${notification.recipientType.toLowerCase()}`}
                                                    >
                                                        {getRecipientTypeLabel(
                                                            notification.recipientType,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(
                                                        notification.sentDate,
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    )}

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
        </section>
    );
};

export default AdminListNotificationPage;
