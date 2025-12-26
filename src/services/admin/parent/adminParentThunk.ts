import type { ResponseFromServer } from "../../../types/app";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllParentForAdminApi, getDetailParentForAdminApi } from "./adminParentApi";
import type { ParentForAdmin, ParentsForAdmin, ResponseGetUsersForAdmin } from "../../../types/admin";

const GET_ALL_PARENT_FOR_ADMIN = "GET_ALL_PARENT_FOR_ADMIN";
const GET_DETAIL_PARENT_FOR_ADMIN = "GET_DETAIL_PARENT_FOR_ADMIN";

export const getAllParentForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<ResponseGetUsersForAdmin<ParentsForAdmin[]>>,
    number
>(GET_ALL_PARENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllParentForAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailParentForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<ParentForAdmin>,
    string
>(GET_DETAIL_PARENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailParentForAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
