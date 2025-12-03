import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type { PublicClass } from "../../../types/public";
import { publicGetAllClassesApi, publicGetDetailClassApi } from "./classApi";

const PUBLIC_GET_ALL_CLASSES = "PUBLIC_GET_ALL_CLASSES";
const PUBLIC_GET_DETAIL_CLASS = "PUBLIC_GET_DETAIL_CLASS";

export const publicGetAllClassesApiThunk = createAsyncThunk<
    ResponseFromServer<PublicClass[]>
>(PUBLIC_GET_ALL_CLASSES, async (_, { rejectWithValue }) => {
    try {
        const response = await publicGetAllClassesApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const publicGetDetailClassApiThunk = createAsyncThunk<
    ResponseFromServer<PublicClass>,
    string
>(PUBLIC_GET_DETAIL_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await publicGetDetailClassApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
