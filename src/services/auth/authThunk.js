import { createAsyncThunk } from "@reduxjs/toolkit";
import { changePasswordApi, forgotPassswordApi, loginApi, registerParentApi, registerStudentApi, verifyEmailApi, verifyEmailForgotPasswordApi, verifyOtpApi, verifyOtpForgotPasswordApi, } from "./authApi";
import request from "../request";
const LOGIN_EMAIL = "LOGIN_EMAIL";
const VERIFY_EMAIL = "VERIFY_EMAIL";
const VERIFY_OTP = "VERIFY_OTP";
const REGISTER_STUDENT = "REGISTER_STUDENT";
const REGISTER_PARENT = "REGISTER_PARENT";
const REGISTER_TUTOR = "REGISTER_TUTOR";
const VERIFY_EMAIL_FORGOT_PASSWORD = "VERIFY_EMAIL_FORGOT_PASSWORD";
const VERIFY_OTP_FORGOT_PASSWORD = "VERIFY_OTP_FORGOT_PASSWORD";
const FORGOT_PASSWORD = "FORGOT_PASSWORD";
const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const loginApiThunk = createAsyncThunk(LOGIN_EMAIL, async (payload, { rejectWithValue }) => {
    try {
        const response = await loginApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const verifyEmailApiThunk = createAsyncThunk(VERIFY_EMAIL, async (payload, { rejectWithValue }) => {
    try {
        const response = await verifyEmailApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const verifyOtpApiThunk = createAsyncThunk(VERIFY_OTP, async (payload, { rejectWithValue }) => {
    try {
        const response = await verifyOtpApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const registerStudentApiThunk = createAsyncThunk(REGISTER_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await registerStudentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const registerParentApiThunk = createAsyncThunk(REGISTER_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await registerParentApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const registerTutorApiThunk = createAsyncThunk(REGISTER_TUTOR, async (data, { rejectWithValue }) => {
    try {
        const res = await request.post("/auth/register/tutor", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data);
    }
});
export const verifyEmailForgotPasswordApiThunk = createAsyncThunk(VERIFY_EMAIL_FORGOT_PASSWORD, async (payload, { rejectWithValue }) => {
    try {
        const response = await verifyEmailForgotPasswordApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const verifyOtpForgotPasswordApiThunk = createAsyncThunk(VERIFY_OTP_FORGOT_PASSWORD, async (payload, { rejectWithValue }) => {
    try {
        const response = await verifyOtpForgotPasswordApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const forgotPassswordApiThunk = createAsyncThunk(FORGOT_PASSWORD, async (payload, { rejectWithValue }) => {
    try {
        const response = await forgotPassswordApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const changePasswordApiThunk = createAsyncThunk(CHANGE_PASSWORD, async (payload, { rejectWithValue }) => {
    try {
        const response = await changePasswordApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
