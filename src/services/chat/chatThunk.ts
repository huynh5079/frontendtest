import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    sendMessageApi,
    sendMessageLegacyApi,
    getMessagesByConversationIdApi,
    editMessageApi,
    deleteMessageApi,
    markMessagesAsReadApi,
    markConversationAsReadApi,
    getUnreadCountApi,
    getOrCreateOneToOneConversationApi,
    getOrCreateClassConversationApi,
    getOrCreateClassRequestConversationApi,
    getConversationsApi,
    getConversationByIdApi,
    getOnlineUsersApi,
    getUserOnlineStatusApi,
    checkUsersOnlineStatusApi,
} from "./chatApi";
import type {
    MessageDto,
    ConversationDto,
    SendMessageDto,
    EditMessageDto,
    DeleteMessageDto,
    ApiResponse,
    PaginationResponse,
} from "../../types/chat";

const SEND_MESSAGE = "SEND_MESSAGE";
const SEND_MESSAGE_LEGACY = "SEND_MESSAGE_LEGACY";
const GET_MESSAGES_BY_CONVERSATION = "GET_MESSAGES_BY_CONVERSATION";
const EDIT_MESSAGE = "EDIT_MESSAGE";
const DELETE_MESSAGE = "DELETE_MESSAGE";
const MARK_MESSAGES_AS_READ = "MARK_MESSAGES_AS_READ";
const MARK_CONVERSATION_AS_READ = "MARK_CONVERSATION_AS_READ";
const GET_UNREAD_COUNT = "GET_UNREAD_COUNT";
const GET_OR_CREATE_ONE_TO_ONE_CONVERSATION = "GET_OR_CREATE_ONE_TO_ONE_CONVERSATION";
const GET_OR_CREATE_CLASS_CONVERSATION = "GET_OR_CREATE_CLASS_CONVERSATION";
const GET_OR_CREATE_CLASS_REQUEST_CONVERSATION = "GET_OR_CREATE_CLASS_REQUEST_CONVERSATION";
const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const GET_CONVERSATION_BY_ID = "GET_CONVERSATION_BY_ID";
const GET_ONLINE_USERS = "GET_ONLINE_USERS";
const GET_USER_ONLINE_STATUS = "GET_USER_ONLINE_STATUS";
const CHECK_USERS_ONLINE_STATUS = "CHECK_USERS_ONLINE_STATUS";

export const sendMessageApiThunk = createAsyncThunk<
    ApiResponse<MessageDto>,
    SendMessageDto
>(SEND_MESSAGE, async (payload, { rejectWithValue }) => {
    try {
        const response = await sendMessageApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const sendMessageLegacyApiThunk = createAsyncThunk<
    ApiResponse<MessageDto>,
    { receiverId: string; content: string }
>(SEND_MESSAGE_LEGACY, async (payload, { rejectWithValue }) => {
    try {
        const response = await sendMessageLegacyApi(
            payload.receiverId,
            payload.content
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getMessagesByConversationIdApiThunk = createAsyncThunk<
    PaginationResponse<MessageDto>,
    { conversationId: string; page?: number; pageSize?: number }
>(GET_MESSAGES_BY_CONVERSATION, async (payload, { rejectWithValue }) => {
    try {
        const response = await getMessagesByConversationIdApi(
            payload.conversationId,
            payload.page || 1,
            payload.pageSize || 50
        );
        return response.data;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const editMessageApiThunk = createAsyncThunk<
    ApiResponse<MessageDto>,
    { messageId: string; dto: EditMessageDto }
>(EDIT_MESSAGE, async (payload, { rejectWithValue }) => {
    try {
        const response = await editMessageApi(payload.messageId, payload.dto);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const deleteMessageApiThunk = createAsyncThunk<
    ApiResponse<{ deleted: boolean }>,
    { messageId: string; dto?: DeleteMessageDto }
>(DELETE_MESSAGE, async (payload, { rejectWithValue }) => {
    try {
        const response = await deleteMessageApi(payload.messageId, payload.dto);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const markMessagesAsReadApiThunk = createAsyncThunk<
    ApiResponse<null>,
    string[]
>(MARK_MESSAGES_AS_READ, async (messageIds, { rejectWithValue }) => {
    try {
        const response = await markMessagesAsReadApi(messageIds);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const markConversationAsReadApiThunk = createAsyncThunk<
    ApiResponse<null>,
    string
>(MARK_CONVERSATION_AS_READ, async (otherUserId, { rejectWithValue }) => {
    try {
        const response = await markConversationAsReadApi(otherUserId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getUnreadCountApiThunk = createAsyncThunk<
    ApiResponse<{ count: number }>,
    void
>(GET_UNREAD_COUNT, async (_, { rejectWithValue }) => {
    try {
        const response = await getUnreadCountApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getOrCreateOneToOneConversationApiThunk = createAsyncThunk<
    ApiResponse<ConversationDto>,
    string
>(GET_OR_CREATE_ONE_TO_ONE_CONVERSATION, async (otherUserId, { rejectWithValue }) => {
    try {
        const response = await getOrCreateOneToOneConversationApi(otherUserId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getOrCreateClassConversationApiThunk = createAsyncThunk<
    ApiResponse<ConversationDto>,
    string
>(GET_OR_CREATE_CLASS_CONVERSATION, async (classId, { rejectWithValue }) => {
    try {
        const response = await getOrCreateClassConversationApi(classId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getOrCreateClassRequestConversationApiThunk = createAsyncThunk<
    ApiResponse<ConversationDto>,
    string
>(GET_OR_CREATE_CLASS_REQUEST_CONVERSATION, async (classRequestId, { rejectWithValue }) => {
    try {
        const response = await getOrCreateClassRequestConversationApi(classRequestId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getConversationsApiThunk = createAsyncThunk<
    ApiResponse<ConversationDto[]>,
    void
>(GET_CONVERSATIONS, async (_, { rejectWithValue }) => {
    try {
        const response = await getConversationsApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getConversationByIdApiThunk = createAsyncThunk<
    ApiResponse<ConversationDto>,
    string
>(GET_CONVERSATION_BY_ID, async (conversationId, { rejectWithValue }) => {
    try {
        const response = await getConversationByIdApi(conversationId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getOnlineUsersApiThunk = createAsyncThunk<
    ApiResponse<{ userIds: string[] }>,
    void
>(GET_ONLINE_USERS, async (_, { rejectWithValue }) => {
    try {
        const response = await getOnlineUsersApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getUserOnlineStatusApiThunk = createAsyncThunk<
    ApiResponse<{ userId: string; isOnline: boolean }>,
    string
>(GET_USER_ONLINE_STATUS, async (userId, { rejectWithValue }) => {
    try {
        const response = await getUserOnlineStatusApi(userId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const checkUsersOnlineStatusApiThunk = createAsyncThunk<
    ApiResponse<{ userIds: string[] }>,
    string[]
>(CHECK_USERS_ONLINE_STATUS, async (userIds, { rejectWithValue }) => {
    try {
        const response = await checkUsersOnlineStatusApi(userIds);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

