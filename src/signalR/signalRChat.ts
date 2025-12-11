import * as signalR from "@microsoft/signalr";
import type { MessageDto } from "../types/chat";
import { store } from "../app/store";
import {
    setConnectionStatus,
    addOnlineUser,
    removeOnlineUser,
} from "../services/chat/chatSlice";

// Lấy token từ localStorage
const getToken = () => {
    try {
        const persistData = localStorage.getItem("persist:root");
        return persistData
            ? JSON.parse(JSON.parse(persistData).auth).token
            : null;
    } catch (error) {
        return null;
    }
};

const chatConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}chathub`, {
        accessTokenFactory: () => getToken() || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Listen to connection state changes
chatConnection.onclose(() => {
    store.dispatch(setConnectionStatus(false));
    console.log("❌ Chat Hub disconnected");
});

chatConnection.onreconnecting(() => {
    store.dispatch(setConnectionStatus(false));
    console.log("🔄 Chat Hub reconnecting...");
});

chatConnection.onreconnected(() => {
    store.dispatch(setConnectionStatus(true));
    console.log("✅ Chat Hub reconnected");
});

// Listen to online/offline events
chatConnection.on("UserOnline", (userId: string) => {
    console.log(`🟢 User online: ${userId}`);
    store.dispatch(addOnlineUser(userId));
});

chatConnection.on("UserOffline", (userId: string) => {
    console.log(`🔴 User offline: ${userId}`);
    store.dispatch(removeOnlineUser(userId));
});

export const startChatConnection = async () => {
    if (chatConnection.state === signalR.HubConnectionState.Connected) {
        store.dispatch(setConnectionStatus(true));
        return;
    }

    try {
        await chatConnection.start();
        store.dispatch(setConnectionStatus(true));
        console.log("✅ Chat Hub connected");
    } catch (err) {
        store.dispatch(setConnectionStatus(false));
        console.error("❌ Chat Hub connection error:", err);
        setTimeout(() => startChatConnection(), 5000);
    }
};

export default chatConnection;

