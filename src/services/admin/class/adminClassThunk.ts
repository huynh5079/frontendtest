import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type {
    AdminCancelClassParams,
    AdminCancelClassResponse,
    AdminCancelStudentEnrollmentParams,
    AdminCancelStudentEnrollmentResponse,
} from "../../../types/class";
import type { PublicClass } from "../../../types/public";
import {
    adminGetAllClassesApi,
    adminCancelClassApi,
    adminCancelStudentEnrollmentApi,
} from "./adminClassApi";

const ADMIN_GET_ALL_CLASSES = "ADMIN_GET_ALL_CLASSES";
const ADMIN_CANCEL_CLASS = "ADMIN_CANCEL_CLASS";
const ADMIN_CANCEL_STUDENT_ENROLLMENT = "ADMIN_CANCEL_STUDENT_ENROLLMENT";

export const adminGetAllClassesApiThunk = createAsyncThunk<
    ResponseFromServer<PublicClass[]>
>(ADMIN_GET_ALL_CLASSES, async (_, { rejectWithValue }) => {
    try {
        const response = await adminGetAllClassesApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const adminCancelClassApiThunk = createAsyncThunk<
    ResponseFromServer<AdminCancelClassResponse>,
    { classId: string; params: AdminCancelClassParams }
>(ADMIN_CANCEL_CLASS, async (payload, { rejectWithValue }) => {
    try {
        const response = await adminCancelClassApi(payload.classId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const adminCancelStudentEnrollmentApiThunk = createAsyncThunk<
    ResponseFromServer<AdminCancelStudentEnrollmentResponse>,
    { classId: string; studentId: string; params: AdminCancelStudentEnrollmentParams }
>(ADMIN_CANCEL_STUDENT_ENROLLMENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await adminCancelStudentEnrollmentApi(
            payload.classId,
            payload.studentId,
            payload.params
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

