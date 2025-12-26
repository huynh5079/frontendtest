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
    deleteConversationApiThunk,
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
        removeConversation: (state, action: PayloadAction<string>) => {
            state.conversations = state.conversations.filter(
                (c) => c.id !== action.payload
            );
            // Clear current conversation nếu đang xóa conversation đó
            if (state.currentConversation?.id === action.payload) {
                state.currentConversation = null;
            }
        },
        incrementUnreadCount: (state) => {
            const oldCount = state.unreadCount;
            state.unreadCount += 1;
        },
        decrementUnreadCount: (state, action: PayloadAction<number>) => {
            const oldCount = state.unreadCount;
            const decrementBy = action.payload || 1;
            state.unreadCount = Math.max(0, state.unreadCount - decrementBy);
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
                    const newMessages = action.payload.items || [];

                    if (newMessages.length === 0) {
                        // No messages, nothing to do
                        return;
                    }

                    // Get conversationId from the first message (all messages should have same conversationId)
                    const conversationId = newMessages[0].conversationId;

                    if (!conversationId) {
                        console.warn("Messages loaded without conversationId");
                        return;
                    }

                    // Remove old messages from this conversation only
                    state.messages = state.messages.filter(m => m.conversationId !== conversationId);

                    // Add new messages
                    state.messages.push(...newMessages);

                    // Sort messages theo createdAt (cũ → mới)
                    state.messages.sort((a, b) => {
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
                    const serverConversations = action.payload.data || [];

                    // Merge server data with local updates (preserve local lastMessage updates)
                    serverConversations.forEach(serverConv => {
                        const localIndex = state.conversations.findIndex(c => c.id === serverConv.id);
                        if (localIndex !== -1) {
                            const localConv = state.conversations[localIndex];
                            // Keep local lastMessage if it's newer than server's OR if local has content but server doesn't
                            const localLastMessageAt = localConv.lastMessageAt ? new Date(localConv.lastMessageAt).getTime() : 0;
                            const serverLastMessageAt = serverConv.lastMessageAt ? new Date(serverConv.lastMessageAt).getTime() : 0;

                            // Check if local has newer message or has content when server doesn't
                            const hasLocalMessage = localConv.lastMessageContent && localConv.lastMessageContent !== "Chưa có tin nhắn";
                            const hasServerMessage = serverConv.lastMessageContent && serverConv.lastMessageContent !== "Chưa có tin nhắn";
                            const shouldKeepLocal = localLastMessageAt > serverLastMessageAt ||
                                (hasLocalMessage && !hasServerMessage) ||
                                (localLastMessageAt === serverLastMessageAt && hasLocalMessage);

                            if (shouldKeepLocal) {
                                // Keep local lastMessage but update other fields from server
                                state.conversations[localIndex] = {
                                    ...serverConv,
                                    lastMessageContent: localConv.lastMessageContent,
                                    lastMessageAt: localConv.lastMessageAt,
                                    lastMessageType: localConv.lastMessageType,
                                    // Use server's unreadCount (backend is source of truth)
                                    unreadCount: serverConv.unreadCount || 0,
                                };
                            } else {
                                // Use server data (backend is source of truth)
                                state.conversations[localIndex] = serverConv;
                            }
                        } else {
                            // New conversation from server
                            state.conversations.push(serverConv);
                        }
                    });

                    // Remove conversations that no longer exist on server (but keep recently updated ones)
                    // Sort by lastMessageAt to keep most recent at top
                    state.conversations.sort((a, b) => {
                        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                        return timeB - timeA; // Newest first
                    });

                    // Recalculate global unread count from all conversations
                    const totalUnreadCount = state.conversations.reduce(
                        (sum, conv) => sum + (conv.unreadCount || 0),
                        0
                    );
                    // Keep the higher value between local and calculated to avoid losing local increments
                    // This ensures that if we incremented locally but server hasn't updated yet, we keep the local value
                    const oldCount = state.unreadCount;
                    const newCount = Math.max(oldCount, totalUnreadCount);
                    state.unreadCount = newCount;
                }
            )
            .addCase(getConversationsApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || "Lấy danh sách chat thất bại";
            })
            // Delete Conversation
            .addCase(deleteConversationApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                deleteConversationApiThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    if (action.payload?.data?.deleted) {
                        // Remove conversation from list
                        const conversationId = action.meta.arg;
                        state.conversations = state.conversations.filter(
                            (c) => c.id !== conversationId
                        );
                        // Clear current conversation nếu đang xóa conversation đó
                        if (state.currentConversation?.id === conversationId) {
                            state.currentConversation = null;
                        }
                    }
                }
            )
            .addCase(deleteConversationApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || "Xóa cuộc trò chuyện thất bại";
            })
            // Get Unread Count
            .addCase(getUnreadCountApiThunk.fulfilled, (state, action) => {
                if (action.payload?.data?.count !== undefined) {
                    const serverCount = action.payload.data.count;
                    const localCount = state.unreadCount;
                    // Use the higher value between local and server to avoid losing local increments
                    // This ensures that if we incremented locally but server hasn't updated yet, we keep the local value
                    state.unreadCount = Math.max(localCount, serverCount);
                }
            })
            // Get Conversation By ID
            .addCase(
                getConversationByIdApiThunk.fulfilled,
                (state, action: PayloadAction<ApiResponse<ConversationDto>>) => {
                    state.currentConversation = action.payload.data;
                    // Thêm vào danh sách nếu chưa có, hoặc merge với local updates
                    const index = state.conversations.findIndex(
                        (c) => c.id === action.payload.data.id
                    );
                    if (index === -1) {
                        state.conversations.unshift(action.payload.data);
                    } else {
                        // Merge: keep local lastMessage if newer, keep higher unreadCount
                        const localConv = state.conversations[index];
                        const serverConv = action.payload.data;

                        const localLastMessageAt = localConv.lastMessageAt ? new Date(localConv.lastMessageAt).getTime() : 0;
                        const serverLastMessageAt = serverConv.lastMessageAt ? new Date(serverConv.lastMessageAt).getTime() : 0;

                        const hasLocalMessage = localConv.lastMessageContent && localConv.lastMessageContent !== "Chưa có tin nhắn";
                        const hasServerMessage = serverConv.lastMessageContent && serverConv.lastMessageContent !== "Chưa có tin nhắn";
                        const shouldKeepLocal = localLastMessageAt > serverLastMessageAt ||
                            (hasLocalMessage && !hasServerMessage) ||
                            (localLastMessageAt === serverLastMessageAt && hasLocalMessage);

                        if (shouldKeepLocal) {
                            // Keep local lastMessage but update other fields from server
                            state.conversations[index] = {
                                ...serverConv,
                                lastMessageContent: localConv.lastMessageContent,
                                lastMessageAt: localConv.lastMessageAt,
                                lastMessageType: localConv.lastMessageType,
                                // Keep higher unreadCount
                                unreadCount: Math.max(localConv.unreadCount || 0, serverConv.unreadCount || 0),
                            };
                        } else {
                            // Use server data but keep higher unreadCount
                            state.conversations[index] = {
                                ...serverConv,
                                unreadCount: Math.max(localConv.unreadCount || 0, serverConv.unreadCount || 0),
                            };
                        }
                    }
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
            )
            // Mark Conversation As Read
            .addCase(
                markConversationAsReadApiThunk.fulfilled,
                (state, action) => {
                    // Find conversation by otherUserId and reset unreadCount
                    const otherUserId = action.meta.arg;
                    const convIndex = state.conversations.findIndex(
                        (c) => c.otherUserId === otherUserId
                    );
                    if (convIndex !== -1) {
                        const oldUnreadCount = state.conversations[convIndex].unreadCount || 0;
                        state.conversations[convIndex].unreadCount = 0;
                        // Decrement global unread count by the conversation's unread count
                        if (oldUnreadCount > 0) {
                            state.unreadCount = Math.max(0, state.unreadCount - oldUnreadCount);
                        }
                    }
                }
            )
            // Mark Messages As Read
            .addCase(
                markMessagesAsReadApiThunk.fulfilled,
                (state, action) => {
                    // Messages are marked as read, but we don't know which conversation
                    // So we just refresh unread count from server
                    // The actual decrement will be handled by getUnreadCountApiThunk
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
    decrementUnreadCount,
    clearError,
    setConnectionStatus,
    setTypingUser,
    removeTypingUser,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
} = chatSlice.actions;

export default chatSlice.reducer;

