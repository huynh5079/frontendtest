import type { StudentForAdmin, StudentsForAdmin } from "../../../types/admin";
import type { ResponseFromServer } from "../../../types/app";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudentForAdminApi, getDetailStudentForAdminApi } from "./adminStudentApi";

const GET_ALL_STUDENT_FOR_ADMIN = "GET_ALL_STUDENT_FOR_ADMIN";
const GET_DETAIL_STUDENT_FOR_ADMIN = "GET_DETAIL_STUDENT_FOR_ADMIN";

export const getAllStudentForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<StudentsForAdmin[]>,
    number
>(GET_ALL_STUDENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllStudentForAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailStudentForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<StudentForAdmin>,
    string
>(GET_DETAIL_STUDENT_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailStudentForAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
