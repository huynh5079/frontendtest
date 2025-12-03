import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { logout } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectIsAuthenticated, selectNotifications, selectUserLogin, } from "../../../app/selector";
import { getMyNotificationsApiThunk } from "../../../services/notification/notificationThunk";
import * as signalR from "@microsoft/signalr";
import connection, { startConnection, } from "../../../signalR/signalRNotification";
import { addNotification } from "../../../services/notification/notificationSlice";
import { toast } from "react-toastify";
import { CiBellOn } from "react-icons/ci";
const HeaderParentButton = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificateOpen, setIsNotificateOpen] = useState(false);
    const menuRef = useRef(null);
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
    const handleClickSubMenu = (route) => {
        navigateHook(route);
        setIsMenuOpen(false);
        setIsNotificateOpen(false);
    }; // Notification SignalR
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
            if (menuRef.current &&
                !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
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
    return (_jsxs("div", { className: "hp-button", children: [_jsx("button", { className: "pr-btn", children: "Y\u00EAu c\u1EA7u t\u00ECm gia s\u01B0" }), _jsx("p", { className: "welcome", children: "Xin ch\u00E0o ng\u01B0\u1EDDi d\u00F9ng" }), _jsxs("div", { ref: notificateRef, className: "notification-wrapper", children: [_jsx(CiBellOn, { className: "icon", onClick: () => setIsNotificateOpen(!isNotificateOpen) }), isNotificateOpen && (_jsxs("div", { className: "sub-notification", children: [_jsx("h4", { children: "Th\u00F4ng b\u00E1o" }), _jsxs("div", { className: "tabs", children: [_jsxs("div", { className: `tab ${activeTab === "all" ? "active" : ""}`, onClick: () => setActiveTab("all"), children: ["T\u1EA5t c\u1EA3", _jsx("span", { className: `underline left ${activeTab === "all" ? "full" : ""}` }), _jsx("span", { className: `underline right ${activeTab === "all" ? "full" : ""}` })] }), _jsxs("div", { className: `tab ${activeTab === "unread" ? "active" : ""}`, onClick: () => setActiveTab("unread"), children: ["Ch\u01B0a \u0111\u1ECDc", " ", countNotificationUnread > 0 &&
                                                `(${countNotificationUnread})`, _jsx("span", { className: `underline left ${activeTab === "unread" ? "full" : ""}` }), _jsx("span", { className: `underline right ${activeTab === "unread" ? "full" : ""}` })] }), _jsxs("div", { className: `tab ${activeTab === "read" ? "active" : ""}`, onClick: () => setActiveTab("read"), children: ["\u0110\u00E3 \u0111\u1ECDc", _jsx("span", { className: `underline left ${activeTab === "read" ? "full" : ""}` }), _jsx("span", { className: `underline right ${activeTab === "read" ? "full" : ""}` })] })] }), _jsxs("ul", { children: [filteredNotifications.length === 0 && (_jsx("div", { children: "Kh\u00F4ng c\u00F3 th\u00F4ng b\u00E1o" })), filteredNotifications.map((n) => (_jsx("li", { className: n.status === "Read" ? "" : "n-unread", children: n.title }, n.id)))] })] }))] }), _jsxs("div", { ref: menuRef, className: "menu-wrapper", children: [_jsx("img", { src: userLogin?.avatarUrl, className: "avatar", onClick: () => setIsMenuOpen(!isMenuOpen) }), isMenuOpen && (_jsx("div", { className: "sub-menu", children: _jsxs("ul", { children: [_jsx("li", { onClick: () => handleClickSubMenu(routes.parent.information +
                                        "?tab=profile"), children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), _jsx("li", { onClick: () => handleClickSubMenu(routes.parent.information +
                                        "?tab=change-password"), children: "\u0110\u1ED5i m\u1EADt kh\u1EA9u" }), _jsx("li", { onClick: () => handleClickSubMenu(routes.parent.information +
                                        "?tab=wallet"), children: "V\u00ED c\u1EE7a t\u00F4i" }), _jsx("li", { onClick: () => handleClickSubMenu(routes.parent.information +
                                        "?tab=schedule"), children: "L\u1ECBch h\u1ECDc" }), _jsx("li", { onClick: logout, children: "\u0110\u0103ng xu\u1EA5t" })] }) }))] })] }));
};
export default HeaderParentButton;
