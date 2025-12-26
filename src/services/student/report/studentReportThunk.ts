import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    reportMaterialToTutorApi,
    reportMaterialToAdminApi,
    reportUserApi,
    reportLessonApi,
    type ReportMaterialParams,
    type ReportUserParams,
    type ReportLessonParams,
} from "./studentReportApi";

const REPORT_MATERIAL_TO_TUTOR = "REPORT_MATERIAL_TO_TUTOR";
const REPORT_MATERIAL_TO_ADMIN = "REPORT_MATERIAL_TO_ADMIN";
const REPORT_USER = "REPORT_USER";
const REPORT_LESSON = "REPORT_LESSON";

export const reportMaterialToTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{ id: string }>,
    ReportMaterialParams
>(REPORT_MATERIAL_TO_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await reportMaterialToTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const reportMaterialToAdminApiThunk = createAsyncThunk<
    ResponseFromServer<{ id: string }>,
    ReportMaterialParams
>(REPORT_MATERIAL_TO_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await reportMaterialToAdminApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const reportUserApiThunk = createAsyncThunk<
    ResponseFromServer<{ id: string }>,
    ReportUserParams
>(REPORT_USER, async (payload, { rejectWithValue }) => {
    try {
        const response = await reportUserApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const reportLessonApiThunk = createAsyncThunk<
    ResponseFromServer<{ id: string }>,
    ReportLessonParams
>(REPORT_LESSON, async (payload, { rejectWithValue }) => {
    try {
        const response = await reportLessonApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

