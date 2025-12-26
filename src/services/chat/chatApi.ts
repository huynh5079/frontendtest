import request from "../request";
import type {
    MessageDto,
    ConversationDto,
    SendMessageDto,
    EditMessageDto,
    DeleteMessageDto,
    PaginationResponse,
} from "../../types/chat";

// Gửi tin nhắn (hỗ trợ file)
export const sendMessageApi = async (dto: SendMessageDto) => {
    const formData = new FormData();

    if (dto.receiverId) {
        formData.append("ReceiverId", dto.receiverId);
    }
    if (dto.conversationId) {
        formData.append("ConversationId", dto.conversationId);
    }
    if (dto.content) {
        formData.append("Content", dto.content);
    }
    if (dto.file) {
        formData.append("File", dto.file);
    }

    const res = await request.post("/chats/messages", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// Gửi tin nhắn (text only - backward compatible)
export const sendMessageLegacyApi = async (
    receiverId: string,
    content: string
) => {
    const res = await request.post(`/chats/${receiverId}/messages`, {
        ReceiverId: receiverId,
        Content: content,
    });
    return res.data;
};

// Lấy tin nhắn theo ConversationId
export const getMessagesByConversationIdApi = async (
    conversationId: string,
    page: number = 1,
    pageSize: number = 50
) => {
    const res = await request.get(
        `/chats/conversations/${conversationId}/messages?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
};

// Sửa tin nhắn
export const editMessageApi = async (
    messageId: string,
    dto: EditMessageDto
) => {
    const res = await request.put(`/chats/messages/${messageId}`, dto);
    return res.data;
};

// Xóa tin nhắn
export const deleteMessageApi = async (
    messageId: string,
    dto?: DeleteMessageDto
) => {
    const res = await request.delete(`/chats/messages/${messageId}`, {
        data: dto,
    });
    return res.data;
};

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsReadApi = async (messageIds: string[]) => {
    const res = await request.put("/chats/messages/read", {
        MessageIds: messageIds,
    });
    return res.data;
};

// Đánh dấu conversation đã đọc
export const markConversationAsReadApi = async (otherUserId: string) => {
    const res = await request.put(`/chats/${otherUserId}/read`);
    return res.data;
};

// Lấy số tin nhắn chưa đọc
export const getUnreadCountApi = async () => {
    const res = await request.get("/chats/unread-count");
    return res.data;
};

// Lấy hoặc tạo conversation 1-1
export const getOrCreateOneToOneConversationApi = async (
    otherUserId: string
) => {
    const res = await request.get(
        `/chats/conversations/one-to-one/${otherUserId}`
    );
    return res.data;
};

// Lấy hoặc tạo conversation cho lớp học
export const getOrCreateClassConversationApi = async (classId: string) => {
    const res = await request.get(`/chats/conversations/class/${classId}`);
    return res.data;
};

// Lấy hoặc tạo conversation cho ClassRequest
export const getOrCreateClassRequestConversationApi = async (
    classRequestId: string
) => {
    const res = await request.get(
        `/chats/conversations/class-request/${classRequestId}`
    );
    return res.data;
};

// Lấy tất cả conversations của user
export const getConversationsApi = async () => {
    const res = await request.get("/chats/conversations");
    return res.data;
};

// Lấy conversation theo ID
export const getConversationByIdApi = async (conversationId: string) => {
    const res = await request.get(`/chats/conversations/${conversationId}`);
    return res.data;
};

// Xóa conversation (user remove khỏi conversation)
export const deleteConversationApi = async (conversationId: string) => {
    const res = await request.delete(`/chats/conversations/${conversationId}`);
    return res.data;
};

// Lấy danh sách users online
export const getOnlineUsersApi = async () => {
    const res = await request.get("/chats/online-users");
    return res.data;
};

// Kiểm tra user có online không
export const getUserOnlineStatusApi = async (userId: string) => {
    const res = await request.get(`/chats/users/${userId}/online-status`);
    return res.data;
};

// Kiểm tra nhiều users có online không
export const checkUsersOnlineStatusApi = async (userIds: string[]) => {
    const res = await request.post("/chats/online-users/check", {
        UserIds: userIds,
    });
    return res.data;
};

