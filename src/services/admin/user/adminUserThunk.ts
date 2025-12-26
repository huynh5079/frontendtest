import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import { banUserApi, unbanUserApi, type BanUserParams, type UnbanUserParams } from "./adminUserApi";

const BAN_USER = "BAN_USER";
const UNBAN_USER = "UNBAN_USER";

export const banUserApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { userId: string; params: BanUserParams }
>(BAN_USER, async (payload, { rejectWithValue }) => {
    try {
        const response = await banUserApi(payload.userId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const unbanUserApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { userId: string; params: UnbanUserParams }
>(UNBAN_USER, async (payload, { rejectWithValue }) => {
    try {
        const response = await unbanUserApi(payload.userId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

