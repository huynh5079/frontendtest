import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseFromServer } from "../../../types/app";
import { ClassRequests } from "../../../types/student";
import { getAllClassRequestForParentApi } from "./classRequestApi";

const GET_ALL_CLASS_REQUEST_FOR_PARENT = "GET_ALL_CLASS_REQUEST_FOR_PARENT";

export const getAllClassRequestForParentApiThunk = createAsyncThunk<
    ResponseFromServer<ClassRequests[]>,
    string
>(GET_ALL_CLASS_REQUEST_FOR_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllClassRequestForParentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
