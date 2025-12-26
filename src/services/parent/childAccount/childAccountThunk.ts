import type { ResponseFromServer } from "../../../types/app";
import type {
    ChildAccount,
    ChildAccounts,
    CreateChildAccountParams,
    LinkExistingChildRequest,
    UpdateChildRequest,
} from "../../../types/parent";
import {
    createChildAccountApi,
    getAllChildAccountApi,
    getDetailChildAccountApi,
    linkChildAccountApi,
    updateChildAccountApi,
    unlinkChildAccountApi,
} from "./childAccountApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const CREATE_CHILD_ACCOUNT = "CREATE_CHILD_ACCOUNT";
const GET_ALL_CHILD_ACCOUNT = "GET_ALL_CHILD_ACCOUNT";
const GET_DETAIL_CHILD_ACCOUNT = "GET_DETAIL_CHILD_ACCOUNT";

export const createChildAccountApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    CreateChildAccountParams
>(CREATE_CHILD_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await createChildAccountApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllChildAccountApiThunk = createAsyncThunk<
    ResponseFromServer<ChildAccounts[]>
>(GET_ALL_CHILD_ACCOUNT, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllChildAccountApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

// ... preexisting code ...
export const getDetailChildAccountApiThunk = createAsyncThunk<
    ResponseFromServer<ChildAccount>,
    string
>(GET_DETAIL_CHILD_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailChildAccountApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

const LINK_CHILD_ACCOUNT = "LINK_CHILD_ACCOUNT";
const UPDATE_CHILD_ACCOUNT = "UPDATE_CHILD_ACCOUNT";
const UNLINK_CHILD_ACCOUNT = "UNLINK_CHILD_ACCOUNT";

export const linkChildAccountApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    LinkExistingChildRequest
>(LINK_CHILD_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await linkChildAccountApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const updateChildAccountApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { studentId: string; params: UpdateChildRequest }
>(UPDATE_CHILD_ACCOUNT, async ({ studentId, params }, { rejectWithValue }) => {
    try {
        const response = await updateChildAccountApi(studentId, params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const unlinkChildAccountApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(UNLINK_CHILD_ACCOUNT, async (studentId, { rejectWithValue }) => {
    try {
        const response = await unlinkChildAccountApi(studentId);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
