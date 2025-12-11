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
} from "../../../services/chat/chatThunk";
import {
    setCurrentConversation,
    addMessage,
} from "../../../services/chat/chatSlice";
import chatConnection, { startChatConnection } from "../../../signalR/signalRChat";
import { toast } from "react-toastify";
import type { MessageDto, ConversationDto } from "../../../types/chat";
import { LoadingSpinner } from "../../../components/elements";
import { formatDate } from "../../../utils/helper";

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
                    markConversationAsReadApiThunk(currentConversation.otherUserId)
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
        <div className="chat-page" style={{ display: "flex", height: "100vh" }}>
            {/* Conversation List */}
            <div
                className="chat-sidebar"
                style={{
                    width: "300px",
                    borderRight: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <div style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
                    <h2>Tin nhắn</h2>
                    {unreadCount > 0 && (
                        <span
                            style={{
                                background: "#ff4444",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                            }}
                        >
                            {unreadCount} chưa đọc
                        </span>
                    )}
                </div>
                <div>
                    {conversations.length === 0 ? (
                        <p style={{ padding: "1rem", textAlign: "center" }}>
                            Chưa có cuộc trò chuyện nào
                        </p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv)}
                                style={{
                                    padding: "1rem",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                    backgroundColor:
                                        currentConversation?.id === conv.id
                                            ? "#f0f0f0"
                                            : "white",
                                }}
                            >
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <img
                                        src={
                                            conv.otherUserAvatarUrl ||
                                            "/default-avatar.png"
                                        }
                                        alt={conv.otherUserName || "User"}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {conv.otherUserName || conv.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#666",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {conv.lastMessageContent || "Chưa có tin nhắn"}
                                        </div>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span
                                            style={{
                                                background: "#ff4444",
                                                color: "white",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10px",
                                            }}
                                        >
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div
                className="chat-main"
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
                {currentConversation ? (
                    <>
                        {/* Header */}
                        <div
                            style={{
                                padding: "1rem",
                                borderBottom: "1px solid #ddd",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <img
                                src={
                                    currentConversation.otherUserAvatarUrl ||
                                    "/default-avatar.png"
                                }
                                alt={currentConversation.otherUserName || "User"}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                }}
                            />
                            <div>
                                <div style={{ fontWeight: "bold" }}>
                                    {currentConversation.otherUserName ||
                                        currentConversation.title}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "1rem",
                            }}
                        >
                            {messages.length === 0 ? (
                                <p style={{ textAlign: "center", color: "#666" }}>
                                    Chưa có tin nhắn nào
                                </p>
                            ) : (
                                messages.map((message) => {
                                    const isOwnMessage =
                                        message.senderId === userLogin?.id;
                                    return (
                                        <div
                                            key={message.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: isOwnMessage
                                                    ? "flex-end"
                                                    : "flex-start",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: "70%",
                                                    padding: "8px 12px",
                                                    borderRadius: "12px",
                                                    backgroundColor: isOwnMessage
                                                        ? "#007bff"
                                                        : "#f0f0f0",
                                                    color: isOwnMessage
                                                        ? "white"
                                                        : "black",
                                                }}
                                            >
                                                {!isOwnMessage && (
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {message.senderName}
                                                    </div>
                                                )}
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
                                                        }}
                                                    >
                                                        📎 {message.fileName || "File"}
                                                    </a>
                                                ) : (
                                                    <div>{message.content}</div>
                                                )}
                                                <div
                                                    style={{
                                                        fontSize: "10px",
                                                        marginTop: "4px",
                                                        opacity: 0.7,
                                                    }}
                                                >
                                                    {message.createdAt &&
                                                        formatDate(message.createdAt)}
                                                    {message.isEdited && " (đã sửa)"}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                padding: "1rem",
                                borderTop: "1px solid #ddd",
                                display: "flex",
                                gap: "10px",
                            }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: "8px 12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                📎
                            </button>
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                                disabled={isSending}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || isSending}
                                style={{
                                    padding: "8px 20px",
                                    background: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor:
                                        !messageInput.trim() || isSending
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        !messageInput.trim() || isSending ? 0.5 : 1,
                                }}
                            >
                                {isSending ? "Đang gửi..." : "Gửi"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;

