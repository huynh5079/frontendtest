import type { AuthResponse, AuthState } from "../../types/auth";
import { loginApiThunk } from "./authThunk";
import { get } from "lodash";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfoLogin } from "../../types/user";
import type { ResponseFromServer } from "../../types/app";

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    userInfoLogin: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string|null>) => {
            state.token = action.payload;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setUserLogin: (state, action: PayloadAction<UserInfoLogin|null>) => {
            state.userInfoLogin = action.payload;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(loginApiThunk.fulfilled, (state, action: PayloadAction<ResponseFromServer<AuthResponse>>) => {
            let token = get(action, 'payload.data.token', null);
            let userInfoLogin = get(action, 'payload.data.user', null);
            
            state.token = token;
            state.isAuthenticated = true;
            state.userInfoLogin = userInfoLogin;
        })
    },
});

export const { setToken, setUserLogin, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;