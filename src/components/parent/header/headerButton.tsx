import { useState, useRef, useEffect, type FC, JSX } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { logout, timeAgo } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectIsAuthenticated,
    selectNotifications,
    selectUserLogin,
    selectChatUnreadCount,
    selectOnlineUsers,
} from "../../../app/selector";
import { getMyNotificationsApiThunk } from "../../../services/notification/notificationThunk";
import * as signalR from "@microsoft/signalr";
import connection, {
    startConnection,
} from "../../../signalR/signalRNotification";
import type { NotificationResponseItem } from "../../../types/notification";
import { addNotification } from "../../../services/notification/notificationSlice";
import {
    getUnreadCountApiThunk,
    getConversationsApiThunk,
    markConversationAsReadApiThunk,
    getOnlineUsersApiThunk,
} from "../../../services/chat/chatThunk";
import { selectConversations } from "../../../app/selector";
import chatConnection, {
    startChatConnection,
} from "../../../signalR/signalRChat";
import {
    addMessage,
    setCurrentConversation,
} from "../../../services/chat/chatSlice";
import type { MessageDto, ConversationDto } from "../../../types/chat";
import { ChatModal } from "../../chat";
import { toast } from "react-toastify";
import { CiBellOn } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import {
    AiOutlineCheckCircle,
    AiOutlineClockCircle,
    AiOutlineCloseCircle,
    AiOutlineStop, // AccountBlocked
    AiOutlineSafetyCertificate, // TutorApproved
    AiOutlineNotification, // SystemAnnouncement
} from "react-icons/ai";

import {
    MdAccountBalanceWallet,
    MdArrowDownward,
    MdArrowUpward,
    MdPayment,
    MdPersonAddAlt,
    MdCancel,
    MdLibraryAdd,
    MdAssignmentTurnedIn,
    MdAssignmentLate,
    MdAssignment,
    MdDoneAll,
    MdFactCheck,
    MdSchedule,
} from "react-icons/md";

import {
    FaHandHoldingUsd,
    FaWallet,
    FaUndo,
    FaMoneyCheck,
} from "react-icons/fa";

import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";

import {
    RiMailSendLine,
    RiMailCheckLine,
    RiMailCloseLine,
} from "react-icons/ri";

import { MdRateReview } from "react-icons/md";

export const notificationIconMap: Record<string, JSX.Element> = {
    // 1. Auth & System
    AccountVerified: <AiOutlineCheckCircle className="noti-icon" />,
    AccountBlocked: <AiOutlineStop className="noti-icon" />,
    TutorApproved: <AiOutlineSafetyCertificate className="noti-icon" />,
    TutorRejected: <AiOutlineCloseCircle className="noti-icon" />,
    SystemAnnouncement: <AiOutlineNotification className="noti-icon" />,

    // 2. Wallet & Payment
    WalletDeposit: <MdAccountBalanceWallet className="noti-icon" />,
    WalletWithdraw: <MdAccountBalanceWallet className="noti-icon" />,
    WalletTransferIn: <MdArrowDownward className="noti-icon" />,
    WalletTransferOut: <MdArrowUpward className="noti-icon" />,
    PaymentFailed: <MdPayment className="noti-icon" />,

    // 3. Escrow
    EscrowPaid: <FaMoneyCheck className="noti-icon" />,
    EscrowReleased: <FaHandHoldingUsd className="noti-icon" />,
    EscrowRefunded: <FaUndo className="noti-icon" />,
    PayoutReceived: <FaWallet className="noti-icon" />,

    // 4. Class & Enrollment
    ClassCancelled: <MdCancel className="noti-icon" />,
    ClassEnrollmentSuccess: <MdPersonAddAlt className="noti-icon" />,
    StudentEnrolledInClass: <MdPersonAddAlt className="noti-icon" />,
    ClassCreatedFromRequest: <MdLibraryAdd className="noti-icon" />,

    // 5. Tutor Deposit
    TutorDepositRefunded: <GiReceiveMoney className="noti-icon" />,
    TutorDepositForfeited: <GiPayMoney className="noti-icon" />,

    // 6. Tutor Application
    TutorApplicationReceived: <MdAssignment className="noti-icon" />,
    TutorApplicationAccepted: <MdAssignmentTurnedIn className="noti-icon" />,
    TutorApplicationRejected: <MdAssignmentLate className="noti-icon" />,

    // 7. Class Request
    ClassRequestReceived: <RiMailSendLine className="noti-icon" />,
    ClassRequestAccepted: <RiMailCheckLine className="noti-icon" />,
    ClassRequestRejected: <RiMailCloseLine className="noti-icon" />,

    // 8. Lesson & Attendance
    LessonCompleted: <MdDoneAll className="noti-icon" />,
    AttendanceMarked: <MdFactCheck className="noti-icon" />,

    // 9. Reschedule Lessons
    LessonRescheduleRequest: <MdSchedule className="noti-icon" />,
    LessonRescheduleAccepted: <MdSchedule className="noti-icon" />,
    LessonRescheduleRejected: <MdSchedule className="noti-icon" />,

    // 10. Feedback
    FeedbackCreated: <MdRateReview className="noti-icon" />,
};

const HeaderParentButton: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificateOpen, setIsNotificateOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] =
        useState<ConversationDto | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const menuRef = useRef<HTMLDivElement | null>(null);
    const notificateRef = useRef<HTMLDivElement | null>(null);
    const chatRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);
    const notifications = useAppSelector(selectNotifications);
    const chatUnreadCount = useAppSelector(selectChatUnreadCount);
    const conversations = useAppSelector(selectConversations);
    const onlineUsers = useAppSelector(selectOnlineUsers);
    const unReadNotifications = notifications.filter(
        (n) => n.status !== "Read"
    );
    const countNotificationUnread = unReadNotifications.length;

    const handleClickSubMenu = (route: string) => {
        navigateHook(route);
        setIsMenuOpen(false);
        setIsNotificateOpen(false);
        setIsChatOpen(false);
    };

    const handleChatIconClick = () => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen) {
            dispatch(getConversationsApiThunk());
            dispatch(getOnlineUsersApiThunk());
        }
    };

    const handleConversationClick = async (conv: ConversationDto) => {
        dispatch(setCurrentConversation(conv));
        setSelectedConversation(conv);
        setIsChatModalOpen(true);
        setIsChatOpen(false);

        // Mark conversation as read
        if (conv.otherUserId) {
            dispatch(markConversationAsReadApiThunk(conv.otherUserId));
        }

        // Refresh unread count
        dispatch(getUnreadCountApiThunk());
        dispatch(getConversationsApiThunk());
    };

    const handleNewMessage = (message: MessageDto) => {
        dispatch(addMessage(message));
        dispatch(getConversationsApiThunk());
        toast.info(`💬 Tin nhắn mới từ ${message.senderName}`);
    };

    // Notification SignalR
    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(getMyNotificationsApiThunk({ pageNumber: 1, pageSize: 5 }));
        dispatch(getUnreadCountApiThunk());
        dispatch(getConversationsApiThunk());
        dispatch(getOnlineUsersApiThunk());

        const initConnection = async () => {
            if (connection.state !== signalR.HubConnectionState.Connected) {
                await startConnection();
            }
            connection.on("ReceiveNotification", handleNewNotification);
        };

        const initChatConnection = async () => {
            await startChatConnection();
            chatConnection.on("ReceiveMessage", handleNewMessage);
        };

        initConnection();
        initChatConnection();

        return () => {
            connection.off("ReceiveNotification", handleNewNotification);
            chatConnection.off("ReceiveMessage", handleNewMessage);
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
            if (
                chatRef.current &&
                !chatRef.current.contains(event.target as Node)
            ) {
                setIsChatOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="hp-button">
            <button className="pr-btn">Yêu cầu tìm gia sư</button>
            <p className="welcome">Xin chào người dùng</p>

            {/* CHAT */}
            <div
                ref={chatRef}
                className="notification-wrapper chat-icon-wrapper"
            >
                <IoChatbubbleEllipsesOutline
                    className="icon"
                    onClick={handleChatIconClick}
                />
                {chatUnreadCount > 0 && (
                    <div className="noti-number">{chatUnreadCount}</div>
                )}

                {isChatOpen && (
                    <div className="sub-chat">
                        <div className="chat-header">
                            <h4>Tin nhắn</h4>
                        </div>

                        {/* Conversations List */}
                        <ul>
                            {conversations.length === 0 && (
                                <div className="no-conversation">
                                    Chưa có cuộc trò chuyện nào
                                </div>
                            )}

                            {conversations.slice(0, 6).map((conv) => (
                                <li
                                    key={conv.id}
                                    onClick={() =>
                                        handleConversationClick(conv)
                                    }
                                    className="chat-content"
                                >
                                    <div className="chat-img">
                                        <img
                                            src={
                                                conv.otherUserAvatarUrl ||
                                                "/default-avatar.png"
                                            }
                                            alt={conv.otherUserName || "User"}
                                            className="img"
                                        />
                                        {conv.otherUserId &&
                                            onlineUsers.includes(
                                                conv.otherUserId
                                            ) && <span title="Đang online" />}
                                    </div>
                                    <div className="chat-info">
                                        <div className="chat-name">
                                            {conv.otherUserName || conv.title}
                                        </div>
                                        <div className="chat-message">
                                            {conv.lastMessageContent ||
                                                "Chưa có tin nhắn"}

                                            <span className="chat-dot" />

                                            {conv.lastMessageAt && (
                                                <span className="chat-time">
                                                    {timeAgo(
                                                        conv.lastMessageAt
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        {/* Force re-render when currentTime changes */}
                                        {currentTime && null}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span>{conv.unreadCount}</span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="button-container">
                            <button
                                className="pr-btn"
                                onClick={() => {
                                    handleClickSubMenu(routes.student.chat);
                                }}
                            >
                                Xem tất cả
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Modal */}
            {isChatModalOpen && selectedConversation && (
                <ChatModal
                    conversationId={selectedConversation.id}
                    isOpen={isChatModalOpen}
                    onClose={() => {
                        setIsChatModalOpen(false);
                        setSelectedConversation(null);
                        dispatch(setCurrentConversation(null));
                    }}
                />
            )}

            {/* NOTIFICATION */}
            <div ref={notificateRef} className="notification-wrapper">
                <CiBellOn
                    className="icon"
                    onClick={() => setIsNotificateOpen(!isNotificateOpen)}
                />
                {countNotificationUnread > 0 && (
                    <div className="noti-number">{countNotificationUnread}</div>
                )}

                {isNotificateOpen && (
                    <div className="sub-notification">
                        <div className="noti-header">
                            <h4>Thông báo</h4>
                            {countNotificationUnread > 0 && (
                                <p>{countNotificationUnread} thông báo mới</p>
                            )}
                        </div>
                        {/* Notification List */}
                        <ul>
                            {unReadNotifications.length === 0 && (
                                <div>Không có thông báo</div>
                            )}

                            {unReadNotifications.slice(0, 5).map((n) => (
                                <li key={n.id}>
                                    <div className="noti-item">
                                        {notificationIconMap[n.type]}
                                        <div className="noti-info">
                                            <h5>{n.title}</h5>
                                            <p>{timeAgo(n.createdAt)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="button-container">
                            <button
                                className="pr-btn"
                                onClick={() => {
                                    navigateHook(
                                        routes.student.information +
                                            "?tab=notification"
                                    );
                                    setIsNotificateOpen(false);
                                }}
                            >
                                Xem tất cả
                            </button>
                        </div>
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
                                        routes.parent.information +
                                            "?tab=profile"
                                    )
                                }
                            >
                                Thông tin cá nhân
                            </li>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.parent.information +
                                            "?tab=change-password"
                                    )
                                }
                            >
                                Đổi mật khẩu
                            </li>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.parent.information +
                                            "?tab=wallet"
                                    )
                                }
                            >
                                Ví của tôi
                            </li>
                            <li
                                onClick={() =>
                                    handleClickSubMenu(
                                        routes.parent.information +
                                            "?tab=schedule"
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

export default HeaderParentButton;
