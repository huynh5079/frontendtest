import request from "../request";
export const loginApi = async (params) => {
    const data = await request.post("auth/login", params);
    return data.data;
};
export const verifyEmailApi = async (params) => {
    const data = await request.post("auth/verify_email", params);
    return data.data;
};
export const verifyOtpApi = async (params) => {
    const data = await request.post("auth/verify_otp", params);
    return data.data;
};
export const registerStudentApi = async (params) => {
    const data = await request.post("auth/register/student", params);
    return data.data;
};
export const registerParentApi = async (params) => {
    const data = await request.post("auth/register/parent", params);
    return data.data;
};
export const verifyEmailForgotPasswordApi = async (params) => {
    const data = await request.post("auth/forgot_password/send_otp", params);
    return data.data;
};
export const verifyOtpForgotPasswordApi = async (params) => {
    const data = await request.post("auth/forgot_password/verify_otp", params);
    return data.data;
};
export const forgotPassswordApi = async (params) => {
    const data = await request.post("auth/forgot_password", params);
    return data.data;
};
export const changePasswordApi = async (params) => {
    const data = await request.post("auth/change_password", params);
    return data.data;
};
