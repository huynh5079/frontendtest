import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { PiBellRingingBold } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectIsAuthenticated, selectNotifications, selectUserLogin, } from "../../../app/selector";
import { getMyNotificationsApiThunk } from "../../../services/notification/notificationThunk";
import connection, { startConnection, } from "../../../signalR/signalRNotification";
import * as signalR from "@microsoft/signalr";
import { addNotification } from "../../../services/notification/notificationSlice";
import { toast } from "react-toastify";
const HeaderAdmin = () => {
    const [isNotificateOpen, setIsNotificateOpen] = useState(false);
    const notificateRef = useRef(null);
    const [activeTab, setActiveTab] = useState("all");
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);
    const notifications = useAppSelector(selectNotifications);
    const countNotificationUnread = notifications.filter((n) => n.status !== "Read").length;
    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all")
            return true;
        if (activeTab === "unread")
            return n.status !== "Read";
        if (activeTab === "read")
            return n.status === "Read";
        return true;
    });
    // Notification SignalR
    useEffect(() => {
        if (!isAuthenticated)
            return;
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
    const handleNewNotification = (notification) => {
        dispatch(addNotification(notification));
        toast.info(`🔔 ${notification.message}`);
    };
    // Click outside để đóng menu/notification
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificateRef.current &&
                !notificateRef.current.contains(event.target)) {
                setIsNotificateOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (_jsx("header", { id: "admin-header", children: _jsxs("div", { className: "ah-conatiner", children: [_jsxs("div", { ref: notificateRef, className: "notification-wrapper", children: [_jsx(PiBellRingingBold, { className: "icon", onClick: () => setIsNotificateOpen(!isNotificateOpen) }), isNotificateOpen && (_jsxs("div", { className: "sub-notification", children: [_jsx("h4", { children: "Th\u00F4ng b\u00E1o" }), _jsxs("div", { className: "tabs", children: [_jsxs("div", { className: `tab ${activeTab === "all" ? "active" : ""}`, onClick: () => setActiveTab("all"), children: ["T\u1EA5t c\u1EA3", _jsx("span", { className: `underline left ${activeTab === "all" ? "full" : ""}` }), _jsx("span", { className: `underline right ${activeTab === "all" ? "full" : ""}` })] }), _jsxs("div", { className: `tab ${activeTab === "unread" ? "active" : ""}`, onClick: () => setActiveTab("unread"), children: ["Ch\u01B0a \u0111\u1ECDc", " ", countNotificationUnread > 0 &&
                                                    `(${countNotificationUnread})`, _jsx("span", { className: `underline left ${activeTab === "unread" ? "full" : ""}` }), _jsx("span", { className: `underline right ${activeTab === "unread" ? "full" : ""}` })] }), _jsxs("div", { className: `tab ${activeTab === "read" ? "active" : ""}`, onClick: () => setActiveTab("read"), children: ["\u0110\u00E3 \u0111\u1ECDc", _jsx("span", { className: `underline left ${activeTab === "read" ? "full" : ""}` }), _jsx("span", { className: `underline right ${activeTab === "read" ? "full" : ""}` })] })] }), _jsxs("ul", { children: [filteredNotifications.length === 0 && (_jsx("div", { children: "Kh\u00F4ng c\u00F3 th\u00F4ng b\u00E1o" })), filteredNotifications.map((n) => (_jsx("li", { className: n.status === "Read"
                                                ? ""
                                                : "n-unread", children: n.title }, n.id)))] })] }))] }), _jsx("img", { className: "avatar", src: userLogin?.avatarUrl, alt: "" })] }) }));
};
export default HeaderAdmin;
