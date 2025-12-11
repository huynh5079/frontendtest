import { useEffect, useState, useRef, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
    selectCurrentConversation,
    selectMessages,
    selectUserLogin,
    selectOnlineUsers,
} from "../../app/selector";
import {
    getMessagesByConversationIdApiThunk,
    sendMessageApiThunk,
    markConversationAsReadApiThunk,
    getOrCreateOneToOneConversationApiThunk,
    getUnreadCountApiThunk,
    getConversationsApiThunk,
    getOnlineUsersApiThunk,
} from "../../services/chat/chatThunk";
import { setCurrentConversation, addMessage } from "../../services/chat/chatSlice";
import chatConnection from "../../signalR/signalRChat";
import { toast } from "react-toastify";
import { formatDate, timeAgo } from "../../utils/helper";
import type { ConversationDto, MessageDto } from "../../types/chat";
import { IoClose, IoPaperPlaneOutline, IoSend, IoImageOutline, IoAttachOutline } from "react-icons/io5";
import { LoadingSpinner } from "../elements";

interface ChatModalProps {
    conversationId?: string;
    otherUserId?: string;
    isOpen: boolean;
    onClose: () => void;
}

const ChatModal: FC<ChatModalProps> = ({
    conversationId,
    otherUserId,
    isOpen,
    onClose,
}) => {
    const dispatch = useAppDispatch();
    const currentConversation = useAppSelector(selectCurrentConversation);
    const messages = useAppSelector(selectMessages);
    const userLogin = useAppSelector(selectUserLogin);
    const onlineUsers = useAppSelector(selectOnlineUsers);

    // Check if the other user is online
    const isOtherUserOnline = currentConversation?.otherUserId
        ? onlineUsers.includes(currentConversation.otherUserId)
        : false;

    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Load conversation and messages when modal opens
    useEffect(() => {
        if (!isOpen) return;

        const loadConversation = async () => {
            setIsLoading(true);
            try {
                let targetConversationId = conversationId;

                // Use currentConversation.id if conversationId is not provided
                if (!targetConversationId && currentConversation?.id) {
                    targetConversationId = currentConversation.id;
                }

                if (targetConversationId) {
                    // Load existing conversation messages
                    console.log("Loading messages for conversation:", targetConversationId);
                    await dispatch(
                        getMessagesByConversationIdApiThunk({
                            conversationId: targetConversationId,
                            page: 1,
                            pageSize: 50,
                        })
                    );
                } else if (otherUserId) {
                    // Get or create one-to-one conversation
                    const result = await dispatch(
                        getOrCreateOneToOneConversationApiThunk(otherUserId)
                    ).unwrap();
                    if (result?.data?.id) {
                        targetConversationId = result.data.id;
                        await dispatch(
                            getMessagesByConversationIdApiThunk({
                                conversationId: targetConversationId,
                                page: 1,
                                pageSize: 50,
                            })
                        );
                    }
                }

                // Mark as read
                const targetUserId = currentConversation?.otherUserId || otherUserId;
                if (targetUserId) {
                    dispatch(
                        markConversationAsReadApiThunk(targetUserId)
                    );
                }
            } catch (error) {
                console.error("Error loading conversation:", error);
                toast.error("Không thể tải cuộc trò chuyện");
            } finally {
                setIsLoading(false);
            }
        };

        loadConversation();
    }, [isOpen, conversationId, otherUserId, currentConversation?.id, currentConversation?.otherUserId, dispatch]);

    // Auto-update time every minute for "hoạt động X phút trước"
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Listen for new messages
    useEffect(() => {
        if (!isOpen) return;

        const handleNewMessage = (message: MessageDto) => {
            if (
                message.conversationId === conversationId ||
                message.conversationId === currentConversation?.id
            ) {
                dispatch(addMessage(message));
            }
        };

        chatConnection.on("ReceiveMessage", handleNewMessage);

        return () => {
            chatConnection.off("ReceiveMessage", handleNewMessage);
        };
    }, [isOpen, conversationId, currentConversation?.id, dispatch]);

    // Auto-update time every minute for "hoạt động X phút trước"
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async () => {
        const targetConversationId = conversationId || currentConversation?.id;
        if (!messageInput.trim() || !targetConversationId) return;

        setIsSending(true);
        try {
            const result = await dispatch(
                sendMessageApiThunk({
                    conversationId: targetConversationId,
                    content: messageInput.trim(),
                })
            ).unwrap();

            // Add message to local state immediately
            if (result?.data) {
                dispatch(addMessage(result.data));
            }

            // Refresh conversations and unread count
            dispatch(getConversationsApiThunk());
            dispatch(getUnreadCountApiThunk());

            setMessageInput("");
        } catch (error: any) {
            toast.error(error?.errorMessage || "Gửi tin nhắn thất bại");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const targetConversationId = conversationId || currentConversation?.id;
        if (!file || !targetConversationId) return;

        setIsSending(true);
        try {
            const result = await dispatch(
                sendMessageApiThunk({
                    conversationId: targetConversationId,
                    file: file,
                })
            ).unwrap();

            // Add message to local state immediately
            if (result?.data) {
                dispatch(addMessage(result.data));
            }

            // Refresh conversations and unread count
            dispatch(getConversationsApiThunk());
            dispatch(getUnreadCountApiThunk());
        } catch (error: any) {
            toast.error(error?.errorMessage || "Gửi file thất bại");
        } finally {
            setIsSending(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (!isOpen) return null;

    const displayName =
        currentConversation?.otherUserName || currentConversation?.title || "User";
    const displayAvatar =
        currentConversation?.otherUserAvatarUrl || "/default-avatar.png";

    return (
        <>
            {/* Overlay */}
            <div
                className="chat-modal-overlay"
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9998,
                }}
            />

            {/* Chat Modal */}
            <div
                className="chat-modal"
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    width: "400px",
                    height: "600px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 9999,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "16px",
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ position: "relative" }}>
                            <img
                                src={displayAvatar}
                                alt={displayName}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />
                            {isOtherUserOnline && (
                                <span
                                    style={{
                                        position: "absolute",
                                        bottom: "0",
                                        right: "0",
                                        width: "12px",
                                        height: "12px",
                                        background: "#4CAF50",
                                        border: "2px solid white",
                                        borderRadius: "50%",
                                    }}
                                    title="Đang online"
                                />
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: "600", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                {displayName}
                                {isOtherUserOnline && (
                                    <span style={{ fontSize: "12px", color: "#4CAF50", fontWeight: "normal" }}>
                                        Đang online
                                    </span>
                                )}
                            </div>
                            {!isOtherUserOnline && currentConversation?.lastMessageAt && (
                                <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
                                    Hoạt động {timeAgo(currentConversation.lastMessageAt)}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        title="Đóng"
                        aria-label="Đóng"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px",
                        background: "#f5f5f5",
                    }}
                >
                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <LoadingSpinner />
                        </div>
                    ) : messages.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                color: "#666",
                                padding: "20px",
                            }}
                        >
                            Chưa có tin nhắn nào
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => {
                                const isOwnMessage = message.senderId === userLogin?.id;
                                const prevMessage = messages[index - 1];
                                const showDate =
                                    !prevMessage ||
                                    new Date(message.createdAt || "").getDate() !==
                                    new Date(prevMessage.createdAt || "").getDate();

                                return (
                                    <div key={message.id}>
                                        {showDate && message.createdAt && (
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    margin: "16px 0",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        background: "#e0e0e0",
                                                        padding: "4px 12px",
                                                        borderRadius: "12px",
                                                        fontSize: "12px",
                                                        color: "#666",
                                                    }}
                                                >
                                                    {formatDate(message.createdAt)}
                                                </span>
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: isOwnMessage
                                                    ? "flex-end"
                                                    : "flex-start",
                                                marginBottom: "12px",
                                            }}
                                        >
                                            {!isOwnMessage && (
                                                <img
                                                    src={
                                                        message.senderAvatarUrl ||
                                                        "/default-avatar.png"
                                                    }
                                                    alt={message.senderName || "User"}
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        borderRadius: "50%",
                                                        marginRight: "8px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            )}
                                            <div
                                                style={{
                                                    maxWidth: "70%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                {!isOwnMessage && (
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            marginBottom: "4px",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {message.senderName}
                                                    </div>
                                                )}
                                                <div
                                                    style={{
                                                        padding: "10px 14px",
                                                        borderRadius: "18px",
                                                        background: isOwnMessage
                                                            ? "#007bff"
                                                            : "white",
                                                        color: isOwnMessage
                                                            ? "white"
                                                            : "#333",
                                                        boxShadow:
                                                            "0 1px 2px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                >
                                                    {message.messageType === "Image" &&
                                                        message.fileUrl ? (
                                                        <img
                                                            src={message.fileUrl}
                                                            alt="Image"
                                                            style={{
                                                                maxWidth: "100%",
                                                                borderRadius: "8px",
                                                            }}
                                                        />
                                                    ) : message.messageType === "File" &&
                                                        message.fileUrl ? (
                                                        <a
                                                            href={message.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: isOwnMessage
                                                                    ? "white"
                                                                    : "#007bff",
                                                                textDecoration: "underline",
                                                            }}
                                                        >
                                                            📎 {message.fileName || "File"}
                                                        </a>
                                                    ) : (
                                                        <div>{message.content}</div>
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "10px",
                                                        color: "#999",
                                                        marginTop: "4px",
                                                        paddingLeft: "4px",
                                                    }}
                                                >
                                                    {message.createdAt && (
                                                        <>
                                                            {new Date(
                                                                message.createdAt
                                                            ).toLocaleTimeString("vi-VN", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                            <span style={{ marginLeft: "4px", opacity: 0.7 }}>
                                                                ({timeAgo(message.createdAt)})
                                                            </span>
                                                        </>
                                                    )}
                                                    {message.isEdited && " (đã sửa)"}
                                                </div>
                                            </div>
                                            {isOwnMessage && (
                                                <img
                                                    src={
                                                        userLogin?.avatarUrl ||
                                                        "/default-avatar.png"
                                                    }
                                                    alt={userLogin?.username || "You"}
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        borderRadius: "50%",
                                                        marginLeft: "8px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div
                    style={{
                        padding: "12px 16px",
                        borderTop: "1px solid #e0e0e0",
                        background: "white",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "flex-end",
                        }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                            title="Chọn file"
                            aria-label="Chọn file để gửi"
                            style={{ display: "none" }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSending || !(conversationId || currentConversation?.id)}
                            style={{
                                padding: "10px",
                                background: "none",
                                border: "none",
                                cursor: isSending || !(conversationId || currentConversation?.id)
                                    ? "not-allowed"
                                    : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#666",
                                opacity: isSending || !(conversationId || currentConversation?.id) ? 0.5 : 1,
                            }}
                            title="Đính kèm file"
                        >
                            <IoAttachOutline size={20} />
                        </button>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Your message"
                            disabled={isSending || !(conversationId || currentConversation?.id)}
                            style={{
                                flex: 1,
                                padding: "10px 14px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "20px",
                                outline: "none",
                                fontSize: "14px",
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={
                                !messageInput.trim() ||
                                isSending ||
                                !(conversationId || currentConversation?.id)
                            }
                            style={{
                                padding: "10px 14px",
                                background:
                                    !messageInput.trim() || isSending
                                        ? "#ccc"
                                        : "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                cursor:
                                    !messageInput.trim() || isSending
                                        ? "not-allowed"
                                        : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "40px",
                                height: "40px",
                            }}
                            title="Gửi tin nhắn"
                        >
                            {isSending ? (
                                <LoadingSpinner />
                            ) : (
                                <IoSend size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatModal;

