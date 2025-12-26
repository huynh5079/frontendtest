import { JSX, useEffect, useRef, useState, type FC } from "react";
import { PiBellRingingBold } from "react-icons/pi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectIsAuthenticated,
    selectNotifications,
    selectProfileTutor,
    selectUserLogin,
    selectChatUnreadCount,
} from "../../../app/selector";
import { navigateHook } from "../../../routes/routeApp";
import { getMyNotificationsApiThunk } from "../../../services/notification/notificationThunk";
import connection, {
    startConnection,
} from "../../../signalR/signalRNotification";
import * as signalR from "@microsoft/signalr";
import type { NotificationResponseItem } from "../../../types/notification";
import { addNotification } from "../../../services/notification/notificationSlice";
import {
    getUnreadCountApiThunk,
    getConversationsApiThunk,
    markConversationAsReadApiThunk,
    getOnlineUsersApiThunk,
    getConversationByIdApiThunk,
    deleteConversationApiThunk,
} from "../../../services/chat/chatThunk";
import { selectConversations, selectOnlineUsers, selectCurrentConversation } from "../../../app/selector";
import chatConnection, {
    startChatConnection,
} from "../../../signalR/signalRChat";
import {
    addMessage,
    setCurrentConversation,
    updateConversation,
    incrementUnreadCount,
} from "../../../services/chat/chatSlice";
import type { MessageDto, ConversationDto } from "../../../types/chat";
import { ChatModal } from "../../chat";
import { toast } from "react-toastify";
import { routes } from "../../../routes/routeName";
import { logout, timeAgo } from "../../../utils/helper";
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

const HeaderTutor: FC = () => {
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
    const tutorProfile = useAppSelector(selectProfileTutor);

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const notifications = useAppSelector(selectNotifications);
    const userLogin = useAppSelector(selectUserLogin);
    const chatUnreadCount = useAppSelector(selectChatUnreadCount);
    const conversations = useAppSelector(selectConversations);
    const onlineUsers = useAppSelector(selectOnlineUsers);
    const currentConversation = useAppSelector(selectCurrentConversation);
    const unreadNotifications = notifications.filter(
        (n) => n.status !== "Read"
    );
    const countNotificationUnread = unreadNotifications.length;

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
        dispatch(getOnlineUsersApiThunk());
    };

    const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation(); // Ngăn chặn click vào conversation item
        if (window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?")) {
            try {
                await dispatch(deleteConversationApiThunk(conversationId)).unwrap();
                toast.success("Đã xóa cuộc trò chuyện");
                // Refresh conversations list
                dispatch(getConversationsApiThunk());
            } catch (error: any) {
                toast.error(error?.errorMessage || "Xóa cuộc trò chuyện thất bại");
            }
        }
    };

    const handleNewMessage = (message: MessageDto) => {
        console.log("=== handleNewMessage called ===", message);
        console.log("Current chatUnreadCount before:", chatUnreadCount);
        console.log("Message senderId:", message.senderId, "UserLogin id:", userLogin?.id);

        dispatch(addMessage(message));

        // Update conversation with new last message immediately
        if (message.conversationId) {
            // Find the conversation in current state
            const currentConv = conversations.find(c => c.id === message.conversationId);
            console.log("Current conversation found:", currentConv);

            if (currentConv) {
                const lastMessageContent = message.content ||
                    (message.messageType === "Image" ? "Đã gửi một hình ảnh" :
                        message.messageType === "File" ? "Đã gửi một file" : "");

                // Check if user is currently viewing this conversation in ChatModal
                const isViewingConversation = currentConversation?.id === message.conversationId;

                const updatedConv: ConversationDto = {
                    ...currentConv,
                    lastMessageContent: lastMessageContent,
                    lastMessageAt: message.createdAt || new Date().toISOString(),
                    lastMessageType: message.messageType,
                    // Don't update unreadCount here - server already updated it, and we'll sync from server
                    // Only update lastMessage info for immediate UI update
                };

                console.log("Updating conversation:", updatedConv);
                dispatch(updateConversation(updatedConv));
            } else {
                // Conversation not in state, fetch it from server
                console.log("Conversation not in state, fetching from server...");
                dispatch(getConversationByIdApiThunk(message.conversationId)).then((result) => {
                    if (getConversationByIdApiThunk.fulfilled.match(result)) {
                        const fetchedConv = result.payload.data;
                        console.log("Fetched conversation from server:", fetchedConv);

                        // Update with last message info
                        const lastMessageContent = message.content ||
                            (message.messageType === "Image" ? "Đã gửi một hình ảnh" :
                                message.messageType === "File" ? "Đã gửi một file" : "");

                        // Check if user is currently viewing this conversation in ChatModal
                        const isViewingConversation = currentConversation?.id === message.conversationId;

                        const updatedConv: ConversationDto = {
                            ...fetchedConv,
                            lastMessageContent: lastMessageContent,
                            lastMessageAt: message.createdAt || new Date().toISOString(),
                            lastMessageType: message.messageType,
                            // Don't update unreadCount here - server already updated it
                            // Only update lastMessage info for immediate UI update
                        };

                        console.log("Updating fetched conversation:", updatedConv);
                        dispatch(updateConversation(updatedConv));
                    }
                }).catch((error) => {
                    console.error("Error fetching conversation:", error);
                });
            }
        }

        // Update global unread count immediately (only if not viewing the conversation)
        const isViewingConversation = currentConversation?.id === message.conversationId;
        console.log("isViewingConversation:", isViewingConversation, "currentConversation?.id:", currentConversation?.id, "message.conversationId:", message.conversationId);
        console.log("message.senderId:", message.senderId, "userLogin?.id:", userLogin?.id, "areEqual:", message.senderId === userLogin?.id);

        if (message.senderId !== userLogin?.id && !isViewingConversation) {
            // Increment global unread count immediately for instant UI update
            console.log("Dispatching incrementUnreadCount...");
            dispatch(incrementUnreadCount());
            console.log("Incremented unread count for message from:", message.senderName);
        } else {
            console.log("Message is from current user or viewing conversation, skipping unread count increment", {
                isFromCurrentUser: message.senderId === userLogin?.id,
                isViewing: isViewingConversation
            });
        }

        // Refresh unread count from server to sync (but keep local increment if higher)
        // Delay to give server time to update
        setTimeout(() => {
            console.log("Refreshing unread count from server...");
            dispatch(getUnreadCountApiThunk());
        }, 500);

        // Refresh conversations to get latest data (including unread counts)
        setTimeout(() => {
            console.log("Refreshing conversations from server...");
            dispatch(getConversationsApiThunk());
        }, 1000);

    };

    // Notification SignalR
    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(getMyNotificationsApiThunk({ pageNumber: 1, pageSize: 50 }));
        dispatch(getUnreadCountApiThunk());
        dispatch(getConversationsApiThunk());

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
    }, [isAuthenticated, dispatch, userLogin]);

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
        <header id="tutor-header">
            <div className="th-conatiner">
                <div className="status-wrapper">
                    {tutorProfile?.reviewStatus === "Pending" && (
                        <div className="pending">
                            <AiOutlineClockCircle className="icon" />
                            Chờ xét duyệt
                        </div>
                    )}
                    {tutorProfile?.reviewStatus === "Approved" && (
                        <div className="approved">
                            <AiOutlineCheckCircle className="icon" />
                            Đã được phê duyệt
                        </div>
                    )}
                    {tutorProfile?.reviewStatus === "Rejected" && (
                        <div className="rejected">
                            <AiOutlineCloseCircle className="icon" />
                            Đã bị từ chối
                        </div>
                    )}
                </div>
                {/* CHAT */}
                <div
                    ref={chatRef}
                    className="notification-wrapper chat-icon-wrapper"
                >
                    <IoChatbubbleEllipsesOutline
                        className="icon-bell"
                        onClick={handleChatIconClick}
                    />

                    {chatUnreadCount > 0 && (
                        <div className="noti-number" title={`${chatUnreadCount} tin nhắn chưa đọc`}>
                            {chatUnreadCount}
                        </div>
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
                                        style={{ position: "relative" }}
                                    >
                                        <div className="chat-img">
                                            <img
                                                src={
                                                    conv.otherUserAvatarUrl ||
                                                    "/default-avatar.png"
                                                }
                                                alt={
                                                    conv.otherUserName || "User"
                                                }
                                                className="img"
                                            />
                                            {conv.otherUserId &&
                                                onlineUsers.includes(
                                                    conv.otherUserId
                                                ) && (
                                                    <span title="Đang online" />
                                                )}
                                        </div>
                                        <div className="chat-info">
                                            {(() => {
                                                const baseName =
                                                    conv.otherUserName ||
                                                    conv.title ||
                                                    "Cuộc trò chuyện";
                                                const suffix = conv.id
                                                    ? ` • ${conv.id.slice(-4)}`
                                                    : "";
                                                return (
                                                    <div
                                                        className="chat-name"
                                                        title={`${baseName}${suffix}`}
                                                    >
                                                        {baseName}
                                                        {suffix}
                                                    </div>
                                                );
                                            })()}
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
                                            <span className="chat-unread-badge">{conv.unreadCount}</span>
                                        )}
                                        <button
                                            onClick={(e) => handleDeleteConversation(e, conv.id)}
                                            aria-label="Xóa cuộc trò chuyện"
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                right: "8px",
                                                background: "#ff4444",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "24px",
                                                height: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                color: "white",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                lineHeight: "1",
                                                zIndex: 10,
                                            }}
                                            title="Xóa cuộc trò chuyện"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="button-container">
                                <button
                                    className="pr-btn"
                                    onClick={() => {
                                        handleClickSubMenu(routes.tutor.chat);
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

                <div ref={notificateRef} className="notification-wrapper">
                    <PiBellRingingBold
                        className="icon-bell"
                        onClick={() => setIsNotificateOpen(!isNotificateOpen)}
                    />
                    {countNotificationUnread > 0 && (
                        <div className="noti-number">
                            {countNotificationUnread}
                        </div>
                    )}
                    {isNotificateOpen && (
                        <div className="sub-notification">
                            <div className="noti-header">
                                <h4>Thông báo</h4>
                                {countNotificationUnread > 0 && (
                                    <p>
                                        {countNotificationUnread} thông báo mới
                                    </p>
                                )}
                            </div>
                            <ul>
                                {unreadNotifications.length === 0 && (
                                    <div>Không có thông báo</div>
                                )}
                                {unreadNotifications.slice(0, 5).map((n) => (
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
                                            routes.tutor.notification.list
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
                                            routes.tutor.information
                                        )
                                    }
                                >
                                    Thông tin cá nhân
                                </li>
                                <li
                                    onClick={() =>
                                        handleClickSubMenu(
                                            routes.tutor.change_password
                                        )
                                    }
                                >
                                    Đổi mật khẩu
                                </li>
                                <li
                                    onClick={() =>
                                        handleClickSubMenu(routes.tutor.wallet)
                                    }
                                >
                                    Ví của tôi
                                </li>
                                <li
                                    onClick={() =>
                                        handleClickSubMenu(
                                            routes.tutor.schedule
                                        )
                                    }
                                >
                                    Lịch dạy
                                </li>
                                <li onClick={logout}>Đăng xuất</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderTutor;
