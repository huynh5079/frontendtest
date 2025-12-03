import type { AuthState } from "../../types/auth";
import { type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfoLogin } from "../../types/user";
export declare const authSlice: import("@reduxjs/toolkit").Slice<AuthState, {
    setToken: (state: import("immer").WritableDraft<AuthState>, action: PayloadAction<string | null>) => void;
    setIsAuthenticated: (state: import("immer").WritableDraft<AuthState>, action: PayloadAction<boolean>) => void;
    setUserLogin: (state: import("immer").WritableDraft<AuthState>, action: PayloadAction<UserInfoLogin | null>) => void;
}, "auth", "auth", import("@reduxjs/toolkit").SliceSelectors<AuthState>>;
export declare const setToken: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "auth/setToken">, setUserLogin: import("@reduxjs/toolkit").ActionCreatorWithPayload<UserInfoLogin | null, "auth/setUserLogin">, setIsAuthenticated: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "auth/setIsAuthenticated">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
