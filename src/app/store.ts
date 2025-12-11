import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import reducer, { type RootState } from "./reducer";

// Auto-fix: Clear old cache nếu có keys không hợp lệ
if (typeof window !== "undefined") {
    try {
        const persistedState = localStorage.getItem("persist:root");
        if (persistedState) {
            const parsed = JSON.parse(persistedState);
            // Nếu có lessonMaterials hoặc videoAnalysis trong cache cũ, clear nó
            if (parsed.lessonMaterials || parsed.videoAnalysis) {
                console.log("🧹 Clearing old Redux cache...");
                const newState: any = {};
                // Chỉ giữ lại auth
                if (parsed.auth) {
                    newState.auth = parsed.auth;
                }
                localStorage.setItem("persist:root", JSON.stringify(newState));
                console.log("✅ Cache cleared successfully");
                // Force reload để load code mới
                console.log("🔄 Reloading page to apply changes...");
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        }
    } catch (e) {
        // Ignore errors
        console.warn("Cache cleanup error:", e);
    }
}

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["auth"], // Chỉ persist auth, không persist lessonMaterials và videoAnalysis
    blacklist: ["lessonMaterials", "videoAnalysis"], // Đảm bảo không persist 2 keys này
    version: 13, // Tăng version để force clear old cache
};
const persistedReducer = persistReducer(persistConfig, reducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
