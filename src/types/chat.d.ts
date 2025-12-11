export interface MessageDto {
    id: string;
    senderId: string;
    senderName?: string;
    senderAvatarUrl?: string;
    receiverId?: string;
    receiverName?: string;
    receiverAvatarUrl?: string;
    conversationId?: string;
    content?: string;
    messageType: "Text" | "Image" | "File";
    fileUrl?: string;
    fileName?: string;
    mediaType?: string;
    fileSize?: number;
    status?: string;
    isRead: boolean;
    isEdited: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ConversationDto {
    id: string;
    title: string;
    type: "OneToOne" | "Class" | "ClassRequest";
    otherUserId?: string;
    otherUserName?: string;
    otherUserAvatarUrl?: string;
    classId?: string;
    classTitle?: string;
    classRequestId?: string;
    lastMessageContent?: string;
    lastMessageType?: "Text" | "Image" | "File";
    lastMessageAt?: string;
    unreadCount: number;
    participants?: ParticipantDto[];
}

export interface ParticipantDto {
    userId: string;
    userName?: string;
    avatarUrl?: string;
    role: string;
}

export interface SendMessageDto {
    receiverId?: string;
    conversationId?: string;
    content?: string;
    file?: File;
}

export interface EditMessageDto {
    content: string;
}

export interface DeleteMessageDto {
    deleteForEveryone: boolean;
}

export interface ChatState {
    conversations: ConversationDto[];
    currentConversation: ConversationDto | null;
    messages: MessageDto[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean; // SignalR connection status
    typingUsers: { [conversationId: string]: string[] }; // Users đang gõ trong conversation
    onlineUsers: string[]; // Danh sách user online
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface PaginationResponse<T> {
    items: T[];
    page: number;
    size: number;
    total: number;
}

