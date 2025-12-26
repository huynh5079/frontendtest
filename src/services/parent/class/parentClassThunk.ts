import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    AssignClassParamsForParent,
    AssignedClassForParent,
} from "../../../types/parent";
import {
    assignClassForParentApi,
    checkAssignClassForParentApi,
    getAllAssignedClassForParentApi,
    withdrawClassForParentApi,
} from "./parentClassApi";
import { CheckAssignClassResponse } from "../../../types/student";
const ASSIGN_CLASS_FOR_PARENT = "ASSIGN_CLASS_FOR_PARENT";
const WITHDRAW_CLASS_FOR_PARENT = "WITHDRAW_CLASS_FOR_PARENT";
const CHECK_ASSIGN_CLASS_FOR_PARENT = "CHECK_ASSIGN_CLASS_FOR_PARENT";
const GET_ALL_ASSIGNED_CLASS_FOR_PARENT = "GET_ALL_ASSIGNED_CLASS_FOR_PARENT";

export const assignClassForParentApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    AssignClassParamsForParent
>(ASSIGN_CLASS_FOR_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await assignClassForParentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const withdrawClassForParentApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { studentId: string; classId: string }
>(WITHDRAW_CLASS_FOR_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await withdrawClassForParentApi(
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

export const checkAssignClassForParentApiThunk = createAsyncThunk<
    ResponseFromServer<CheckAssignClassResponse>,
    { studentId: string; classId: string }
>(CHECK_ASSIGN_CLASS_FOR_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await checkAssignClassForParentApi(
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

export const getAllAssignedClassForParentApiThunk = createAsyncThunk<
    ResponseFromServer<AssignedClassForParent[]>,
    string
>(GET_ALL_ASSIGNED_CLASS_FOR_PARENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await getAllAssignedClassForParentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
