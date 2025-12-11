import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    sendMessageApiThunk,
    getMessagesByConversationIdApiThunk,
    editMessageApiThunk,
    deleteMessageApiThunk,
    markMessagesAsReadApiThunk,
    markConversationAsReadApiThunk,
    getUnreadCountApiThunk,
    getOrCreateOneToOneConversationApiThunk,
    getConversationsApiThunk,
    getConversationByIdApiThunk,
    getOnlineUsersApiThunk,
} from "./chatThunk";
import type {
    ChatState,
    MessageDto,
    ConversationDto,
    ApiResponse,
    PaginationResponse,
} from "../../types/chat";

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    isConnected: false,
    typingUsers: {},
    onlineUsers: [],
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentConversation: (
            state,
            action: PayloadAction<ConversationDto | null>
        ) => {
            state.currentConversation = action.payload;
        },
        addMessage: (state, action: PayloadAction<MessageDto>) => {
            // Kiểm tra xem message đã tồn tại chưa (tránh duplicate)
            const existingIndex = state.messages.findIndex(
                (m) => m.id === action.payload.id
            );
            if (existingIndex === -1) {
                state.messages.push(action.payload);
            } else {
                // Update message nếu đã tồn tại
                state.messages[existingIndex] = action.payload;
            }
            // Sort messages theo createdAt (cũ → mới)
            state.messages.sort((a, b) => {
                const timeA = new Date(a.createdAt || 0).getTime();
                const timeB = new Date(b.createdAt || 0).getTime();
                return timeA - timeB;
            });
        },
        updateMessage: (state, action: PayloadAction<MessageDto>) => {
            const index = state.messages.findIndex(
                (m) => m.id === action.payload.id
            );
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(
                (m) => m.id !== action.payload
            );
        },
        updateConversation: (state, action: PayloadAction<ConversationDto>) => {
            const index = state.conversations.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) {
                state.conversations[index] = action.payload;
            } else {
                state.conversations.unshift(action.payload);
            }
            // Update current conversation nếu đang active
            if (
                state.currentConversation?.id === action.payload.id
            ) {
                state.currentConversation = action.payload;
            }
        },
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },
        clearError: (state) => {
            state.error = null;
        },
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setTypingUser: (
            state,
            action: PayloadAction<{ conversationId: string; userId: string }>
        ) => {
            const { conversationId, userId } = action.payload;
            if (!state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = [];
            }
            if (!state.typingUsers[conversationId].includes(userId)) {
                state.typingUsers[conversationId].push(userId);
            }
        },
        removeTypingUser: (
            state,
            action: PayloadAction<{ conversationId: string; userId: string }>
        ) => {
            const { conversationId, userId } = action.payload;
            if (state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = state.typingUsers[
                    conversationId
                ].filter((id) => id !== userId);
            }
        },
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action: PayloadAction<string>) => {
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },
        removeOnlineUser: (state, action: PayloadAction<string>) => {
            state.onlineUsers = state.onlineUsers.filter(
                (id) => id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Message
            .addCase(sendMessageApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                sendMessageApiThunk.fulfilled,
                (state, action: PayloadAction<ApiResponse<MessageDto>>) => {
                    state.isLoading = false;
                    const message = action.payload.data;
                    const existingIndex = state.messages.findIndex(
                        (m) => m.id === message.id
                    );
                    if (existingIndex === -1) {
                        state.messages.push(message);
                    }
                }
            )
            .addCase(sendMessageApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Gửi tin nhắn thất bại";
            })
            // Get Messages
            .addCase(getMessagesByConversationIdApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getMessagesByConversationIdApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<PaginationResponse<MessageDto>>
                ) => {
                    state.isLoading = false;
                    // Sort messages theo createdAt (cũ → mới)
                    state.messages = action.payload.items.sort((a, b) => {
                        const timeA = new Date(a.createdAt || 0).getTime();
                        const timeB = new Date(b.createdAt || 0).getTime();
                        return timeA - timeB;
                    });
                }
            )
            .addCase(
                getMessagesByConversationIdApiThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error =
                        action.error.message || "Lấy tin nhắn thất bại";
                }
            )
            // Get Conversations
            .addCase(getConversationsApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getConversationsApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ApiResponse<ConversationDto[]>>
                ) => {
                    state.isLoading = false;
                    state.conversations = action.payload.data;
                }
            )
            .addCase(getConversationsApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || "Lấy danh sách chat thất bại";
            })
            // Get Unread Count
            .addCase(getUnreadCountApiThunk.fulfilled, (state, action) => {
                if (action.payload?.data?.count !== undefined) {
                    state.unreadCount = action.payload.data.count;
                }
            })
            // Get Conversation By ID
            .addCase(
                getConversationByIdApiThunk.fulfilled,
                (state, action: PayloadAction<ApiResponse<ConversationDto>>) => {
                    state.currentConversation = action.payload.data;
                }
            )
            // Get or Create One-to-One Conversation
            .addCase(
                getOrCreateOneToOneConversationApiThunk.fulfilled,
                (state, action: PayloadAction<ApiResponse<ConversationDto>>) => {
                    state.currentConversation = action.payload.data;
                    // Thêm vào danh sách nếu chưa có
                    const index = state.conversations.findIndex(
                        (c) => c.id === action.payload.data.id
                    );
                    if (index === -1) {
                        state.conversations.unshift(action.payload.data);
                    }
                }
            )
            // Get Online Users
            .addCase(
                getOnlineUsersApiThunk.fulfilled,
                (state, action: PayloadAction<ApiResponse<{ userIds: string[] }>>) => {
                    state.onlineUsers = action.payload.data.userIds;
                }
            );
    },
});

export const {
    setCurrentConversation,
    addMessage,
    updateMessage,
    removeMessage,
    updateConversation,
    incrementUnreadCount,
    clearError,
    setConnectionStatus,
    setTypingUser,
    removeTypingUser,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
} = chatSlice.actions;

export default chatSlice.reducer;

