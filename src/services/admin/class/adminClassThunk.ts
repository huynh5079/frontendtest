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
    adminGetClassDetailApi,
    adminGetStudentsInClassApi,
    adminCancelClassApi,
    adminCancelStudentEnrollmentApi,
    type StudentEnrollmentDto,
} from "./adminClassApi";

const ADMIN_GET_ALL_CLASSES = "ADMIN_GET_ALL_CLASSES";
const ADMIN_GET_CLASS_DETAIL = "ADMIN_GET_CLASS_DETAIL";
const ADMIN_GET_STUDENTS_IN_CLASS = "ADMIN_GET_STUDENTS_IN_CLASS";
const ADMIN_CANCEL_CLASS = "ADMIN_CANCEL_CLASS";
const ADMIN_CANCEL_STUDENT_ENROLLMENT = "ADMIN_CANCEL_STUDENT_ENROLLMENT";

export const adminGetAllClassesApiThunk = createAsyncThunk<
    ResponseFromServer<PublicClass[]>
>(ADMIN_GET_ALL_CLASSES, async (_, { rejectWithValue }) => {
    try {
        // Gọi API không filter status để lấy tất cả classes
        const response = await adminGetAllClassesApi();
        console.log('🔄 Thunk received response:', response);
        // Response from adminGetAllClassesApi is already { data: PublicClass[] }
        const result: ResponseFromServer<PublicClass[]> = {
            status: "success",
            message: "Lấy danh sách lớp học thành công",
            data: response.data || []
        };
        console.log('✅ Thunk returning result with', result.data.length, 'classes');
        return result;
    } catch (err: any) {
        console.error('❌ Thunk error:', err);
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const adminGetClassDetailApiThunk = createAsyncThunk<
    ResponseFromServer<PublicClass>,
    string
>(ADMIN_GET_CLASS_DETAIL, async (classId, { rejectWithValue }) => {
    try {
        const classData = await adminGetClassDetailApi(classId);
        // Handle both ResponseFromServer format and direct data
        if (classData && typeof classData === 'object' && 'data' in classData) {
            return classData as ResponseFromServer<PublicClass>;
        }
        return {
            status: "success",
            message: "Lấy chi tiết lớp học thành công",
            data: classData as PublicClass
        };
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const adminGetStudentsInClassApiThunk = createAsyncThunk<
    ResponseFromServer<StudentEnrollmentDto[]>,
    string
>(ADMIN_GET_STUDENTS_IN_CLASS, async (classId, { rejectWithValue }) => {
    try {
        const studentsData = await adminGetStudentsInClassApi(classId);
        // Handle both ResponseFromServer format and direct data
        if (studentsData && typeof studentsData === 'object' && 'data' in studentsData) {
            return studentsData as ResponseFromServer<StudentEnrollmentDto[]>;
        }
        return {
            status: "success",
            message: "Lấy danh sách học viên thành công",
            data: Array.isArray(studentsData) ? studentsData : []
        };
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

