import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type {
    AssignClassParamsForStudent,
    AssignedClassForStudent,
    CheckAssignClassResponse,
} from "../../../types/student";
import {
    assignClassForStudentApi,
    checkAssignClassForStudentApi,
    getAllAssignedClassForStudentApi,
    withdrawClassForStudentApi,
} from "./classApi";

const ASSIGN_CLASS_FOR_STUDENT = "ASSIGN_CLASS_FOR_STUDENT";
const WITHDRAW_CLASS_FOR_STUDENT = "WITHDRAW_CLASS_FOR_STUDENT";
const CHECK_ASSIGN_CLASS_FOR_STUDENT = "CHECK_ASSIGN_CLASS_FOR_STUDENT";
const GET_ALL_ASSIGNED_CLASS_FOR_STUDENT = "GET_ALL_ASSIGNED_CLASS_FOR_STUDENT";

export const assignClassForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    AssignClassParamsForStudent
>(ASSIGN_CLASS_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await assignClassForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const withdrawClassForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(WITHDRAW_CLASS_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await withdrawClassForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const checkAssignClassForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<CheckAssignClassResponse>,
    string
>(CHECK_ASSIGN_CLASS_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await checkAssignClassForStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllAssignedClassForStudentApiThunk = createAsyncThunk<
    ResponseFromServer<AssignedClassForStudent[]>
>(GET_ALL_ASSIGNED_CLASS_FOR_STUDENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllAssignedClassForStudentApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
