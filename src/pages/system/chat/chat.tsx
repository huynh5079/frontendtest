import { useEffect, useState, useRef, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectConversations,
    selectCurrentConversation,
    selectMessages,
    selectChatUnreadCount,
    selectUserLogin,
    selectIsAuthenticated,
} from "../../../app/selector";
import {
    getConversationsApiThunk,
    getOrCreateOneToOneConversationApiThunk,
    getMessagesByConversationIdApiThunk,
    sendMessageApiThunk,
    markConversationAsReadApiThunk,
    deleteConversationApiThunk,
} from "../../../services/chat/chatThunk";
import {
    setCurrentConversation,
    addMessage,
} from "../../../services/chat/chatSlice";
import chatConnection, {
    startChatConnection,
} from "../../../signalR/signalRChat";
import { toast } from "react-toastify";
import type { MessageDto, ConversationDto } from "../../../types/chat";
import { LoadingSpinner } from "../../../components/elements";
import { formatDate, timeAgo } from "../../../utils/helper";

const ChatPage: FC = () => {
    const dispatch = useAppDispatch();
    const conversations = useAppSelector(selectConversations);
    const currentConversation = useAppSelector(selectCurrentConversation);
    const messages = useAppSelector(selectMessages);
    const unreadCount = useAppSelector(selectChatUnreadCount);
    const userLogin = useAppSelector(selectUserLogin);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize SignalR connection
    useEffect(() => {
        if (!isAuthenticated) return;

        const initConnection = async () => {
            await startChatConnection();

            // Listen for new messages
            chatConnection.on("ReceiveMessage", (message: MessageDto) => {
                dispatch(addMessage(message));
                toast.info(`💬 Tin nhắn mới từ ${message.senderName}`);
            });
        };

        initConnection();

        return () => {
            chatConnection.off("ReceiveMessage");
        };
    }, [isAuthenticated, dispatch]);

    // Load conversations on mount
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getConversationsApiThunk());
        }
    }, [isAuthenticated, dispatch]);

    // Load messages when conversation changes
    useEffect(() => {
        if (currentConversation?.id) {
            dispatch(
                getMessagesByConversationIdApiThunk({
                    conversationId: currentConversation.id,
                    page: 1,
                    pageSize: 50,
                })
            );
            // Mark as read
            if (currentConversation.otherUserId) {
                dispatch(
                    markConversationAsReadApiThunk(
                        currentConversation.otherUserId
                    )
                );
            }
        }
    }, [currentConversation?.id, dispatch]);

    const handleSelectConversation = (conversation: ConversationDto) => {
        dispatch(setCurrentConversation(conversation));
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !currentConversation) return;

        setIsSending(true);
        try {
            await dispatch(
                sendMessageApiThunk({
                    conversationId: currentConversation.id,
                    content: messageInput.trim(),
                })
            ).unwrap();
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
        if (!file || !currentConversation) return;

        setIsSending(true);
        try {
            await dispatch(
                sendMessageApiThunk({
                    conversationId: currentConversation.id,
                    file: file,
                })
            ).unwrap();
        } catch (error: any) {
            toast.error(error?.errorMessage || "Gửi file thất bại");
        } finally {
            setIsSending(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
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

    if (!isAuthenticated) {
        return (
            <div className="chat-page">
                <div className="chat-container">
                    <p>Vui lòng đăng nhập để sử dụng chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page">
            {/* Conversation List */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2 className="chat-sidebar-title">Tin nhắn</h2>
                    {unreadCount > 0 && (
                        <span className="unread-count">
                            {unreadCount} chưa đọc
                        </span>
                    )}
                </div>
                <div className="chat-list">
                    {conversations.length === 0 ? (
                        <p className="no-chat">Chưa có tin nhắn</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv)}
                                className={`chat-item ${conv.id === currentConversation?.id
                                        ? "active"
                                        : ""
                                    }`}
                                style={{ position: "relative" }}
                            >
                                <div className="chat-item-content">
                                    <img
                                        src={
                                            conv.otherUserAvatarUrl ||
                                            "/default-avatar.png"
                                        }
                                        alt={conv.otherUserName || "User"}
                                        className="chat-avatar"
                                    />
                                    <div className="chat-item-info">
                                        <div className="chat-item-name">
                                            {conv.otherUserName || conv.title}
                                        </div>
                                        <div className="chat-item-message">
                                            {conv.lastMessageContent ||
                                                "Chưa có tin nhắn"}
                                        </div>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className="unread-count">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
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
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="chat-main">
                {currentConversation ? (
                    <>
                        <div className="chat-main-header">
                            <img
                                src={
                                    currentConversation.otherUserAvatarUrl ||
                                    "/default-avatar.png"
                                }
                                alt={
                                    currentConversation.otherUserName || "User"
                                }
                                className="chat-main-avatar"
                            />
                            <div className="chat-main-header-info">
                                <div className="chat-main-header-name">
                                    {currentConversation.otherUserName ||
                                        currentConversation.title}
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <p className="no-message">
                                    Chưa có tin nhắn nào
                                </p>
                            ) : (
                                messages.map((message) => {
                                    const isOwnMessage =
                                        message.senderId === userLogin?.id;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`chat-message ${isOwnMessage ? "own" : "other"
                                                }`}
                                        >
                                            <div>
                                                {!isOwnMessage && (
                                                    <div className="sender-name">
                                                        {message.senderName}
                                                    </div>
                                                )}

                                                {message.messageType ===
                                                    "Image" &&
                                                    message.fileUrl ? (
                                                    <img
                                                        src={message.fileUrl}
                                                        alt="Image"
                                                        className="chat-image"
                                                    />
                                                ) : message.messageType ===
                                                    "File" &&
                                                    message.fileUrl ? (
                                                    <a
                                                        href={message.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="chat-file"
                                                    >
                                                        📎{" "}
                                                        {message.fileName ||
                                                            "File"}
                                                    </a>
                                                ) : (
                                                    <div className="chat-message-content">
                                                        {message.content}
                                                    </div>
                                                )}

                                                <div className="message-time">
                                                    {message.createdAt &&
                                                        timeAgo(
                                                            message.createdAt
                                                        )}
                                                    {message.isEdited &&
                                                        " (đã sửa)"}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} className="chat-end" />
                        </div>

                        <div className="chat-input">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="chat-file-input"
                                aria-label="Chọn file để gửi"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="chat-file-button"
                            >
                                📎
                            </button>
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) =>
                                    setMessageInput(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                disabled={isSending}
                                className="chat-input-field"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || isSending}
                                className="chat-send-button"
                            >
                                {isSending ? "Đang gửi..." : "Gửi"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation">
                        <p className="no-conversation-text">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
