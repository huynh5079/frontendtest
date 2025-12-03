import { useState, useRef, useEffect, type FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { logout } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectIsAuthenticated,
    selectNotifications,
    selectUserLogin,
} from "../../../app/selector";
import connection, {
    startConnection,
} from "../../../signalR/signalRNotification";
import { toast } from "react-toastify";
import { addNotification } from "../../../services/notification/notificationSlice";
import * as signalR from "@microsoft/signalr";
import { CiBellOn } from "react-icons/ci";
import type { NotificationResponseItem } from "../../../types/notification";
import { getMyNotificationsApiThunk } from "../../../services/notification/notificationThunk";

const HeaderStudentButton: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificateOpen, setIsNotificateOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const notificateRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);
    const notifications = useAppSelector(selectNotifications);
    const countNotificationUnread = notifications.filter(
        (n) => n.status !== "Read",
    ).length;

    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return n.status !== "Read";
        if (activeTab === "read") return n.status === "Read";
        return true;
    });

    const handleClickSubMenu = (route: string) => {
        navigateHook(route);
        setIsMenuOpen(false);
        setIsNotificateOpen(false);
    };

    // Notification SignalR
    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(getMyNotificationsApiThunk({ pageNumber: 1, pageSize: 5 }));

        const initConnection = async () => {
            if (connection.state !== signalR.HubConnectionState.Connected) {
                await startConnection();
            }
            connection.on("ReceiveNotification", handleNewNotification);
        };

        initConnection();

        return () => {
            connection.off("ReceiveNotification", handleNewNotification);
        };
    }, [isAuthenticated]);

    const handleNewNotification = (notification: NotificationResponseItem) => {
        dispatch(addNotification(notification));
        toast.info(`🔔 ${notification.message}`);
    };

    // Click outside để đóng menu/notification
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
            if (
                notificateRef.current &&
                !notificateRef.current.contains(event.target as Node)
            ) {
                setIsNotificateOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="hs-button">
            <button className="pr-btn">Yêu cầu tìm gia sư</button>
            <p className="welcome">Xin chào người dùng</p>

            <div ref={notificateRef} className="notification-wrapper">
                <CiBellOn
                    className="icon"
                    onClick={() => setIsNotificateOpen(!isNotificateOpen)}
                />
                {isNotificateOpen && (
                    <div className="sub-notification">
                        <h4>Thông báo</h4>
                        <div className="tabs">
                            <div
                                className={`tab ${
                                    activeTab === "all" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("all")}
                            >
                                Tất cả
                                <span
                                    className={`underline left ${
                                        activeTab === "all" ? "full" : ""
                                    }`}
                                />
                                <span
                                    className={`underline right ${
                                        activeTab === "all" ? "full" : ""
                                    }`}
                                />
                            </div>
                            <div
                                className={`tab ${
                                    activeTab === "unread" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("unread")}
                            >
                                Chưa đọc{" "}
                                {countNotificationUnread > 0 &&
                                    `(${countNotificationUnread})`}
                                <span
                                    className={`underline left ${
                                        activeTab === "unread" ? "full" : ""
                                    }`}
                                />
                                <span
                                    className={`underline right ${
                                        activeTab === "unread" ? "full" : ""
                                    }`}
                                />
                            </div>
                            <div
                                className={`tab ${
                                    activeTab === "read" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("read")}
                            >
                                Đã đọc
                                <span
                                    className={`underline left ${
                                        activeTab === "read" ? "full" : ""
                                    }`}
                                />
                                <span
                                    className={`underline right ${
                                        activeTab === "read" ? "full" : ""
                                    }`}
                                />
                            </div>
                        </div>
                        <ul>
                            {filteredNotifications.length === 0 && (
                                <div>Không có thông báo</div>
                            )}
                            {filteredNotifications.map((n) => (
                                <li
                                    key={n.id}
                                    className={
                                        n.status === "Read" ? "" : "n-unread"
                                    }
                                >
                                    {n.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div ref={menuRef} className="menu-wrapper">
                <img
                    src={userLogin?.avatarUrl}
                    className="avatar"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                />

                {isMenuOpen && (
                    <div className="sub-menu">
                        <ul>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.student.information +
                                            "?tab=profile",
                                    )
                                }
                            >
                                Thông tin cá nhân
                            </li>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.student.information +
                                            "?tab=change-password",
                                    )
                                }
                            >
                                Đổi mật khẩu
                            </li>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.student.information +
                                            "?tab=wallet",
                                    )
                                }
                            >
                                Ví của tôi
                            </li>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.student.information +
                                            "?tab=schedule",
                                    )
                                }
                            >
                                Lịch học
                            </li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderStudentButton;
