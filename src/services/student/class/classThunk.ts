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
    getEnrollmentDetailApi,
} from "./classApi";

const ASSIGN_CLASS_FOR_STUDENT = "ASSIGN_CLASS_FOR_STUDENT";
const WITHDRAW_CLASS_FOR_STUDENT = "WITHDRAW_CLASS_FOR_STUDENT";
const CHECK_ASSIGN_CLASS_FOR_STUDENT = "CHECK_ASSIGN_CLASS_FOR_STUDENT";
const GET_ALL_ASSIGNED_CLASS_FOR_STUDENT = "GET_ALL_ASSIGNED_CLASS_FOR_STUDENT";
const GET_ENROLLMENT_DETAIL = "GET_ENROLLMENT_DETAIL";

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
    { classId: string; studentId: string }
>(WITHDRAW_CLASS_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await withdrawClassForStudentApi(
            payload.classId,
            payload.studentId,
        );
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
    { studentId: string; classId: string }
>(CHECK_ASSIGN_CLASS_FOR_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await checkAssignClassForStudentApi(
            payload.classId,
            payload.studentId,
        );
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

export const getEnrollmentDetailApiThunk = createAsyncThunk<
    ResponseFromServer<any>,
    string
>(GET_ENROLLMENT_DETAIL, async (payload, { rejectWithValue }) => {
    try {
        const response = await getEnrollmentDetailApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
