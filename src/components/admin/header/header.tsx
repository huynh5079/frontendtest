import { useEffect, useRef, useState, type FC } from "react";
import { PiBellRingingBold } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectIsAuthenticated,
    selectNotifications,
    selectUserLogin,
} from "../../../app/selector";
import { getMyNotificationsApiThunk } from "../../../services/notification/notificationThunk";
import connection, {
    startConnection,
} from "../../../signalR/signalRNotification";
import * as signalR from "@microsoft/signalr";
import type { NotificationResponseItem } from "../../../types/notification";
import { addNotification } from "../../../services/notification/notificationSlice";
import { toast } from "react-toastify";

const HeaderAdmin: FC = () => {
    const [isNotificateOpen, setIsNotificateOpen] = useState(false);
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
        <header id="admin-header">
            <div className="ah-conatiner">
                <div ref={notificateRef} className="notification-wrapper">
                    <PiBellRingingBold
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
                                            n.status === "Read"
                                                ? ""
                                                : "n-unread"
                                        }
                                    >
                                        {n.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <img className="avatar" src={userLogin?.avatarUrl} alt="" />
            </div>
        </header>
    );
};

export default HeaderAdmin;
