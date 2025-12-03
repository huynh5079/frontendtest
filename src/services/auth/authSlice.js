import { loginApiThunk } from "./authThunk";
import { get } from "lodash";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated: false,
    token: null,
    userInfoLogin: null
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setUserLogin: (state, action) => {
            state.userInfoLogin = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginApiThunk.fulfilled, (state, action) => {
            let token = get(action, 'payload.data.token', null);
            let userInfoLogin = get(action, 'payload.data.user', null);
            state.token = token;
            state.isAuthenticated = true;
            state.userInfoLogin = userInfoLogin;
        });
    },
});
export const { setToken, setUserLogin, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
