import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    getReportsForTutorApi,
    getReportDetailForTutorApi,
    updateReportStatusForTutorApi,
    cancelReportForTutorApi,
    type ReportItem,
    type ReportDetail,
    type ReportQuery,
    type UpdateReportStatusParams,
    type ReportsResponse,
} from "./tutorReportApi";

const GET_REPORTS_FOR_TUTOR = "GET_REPORTS_FOR_TUTOR";
const GET_REPORT_DETAIL_FOR_TUTOR = "GET_REPORT_DETAIL_FOR_TUTOR";
const UPDATE_REPORT_STATUS_FOR_TUTOR = "UPDATE_REPORT_STATUS_FOR_TUTOR";
const CANCEL_REPORT_FOR_TUTOR = "CANCEL_REPORT_FOR_TUTOR";

export const getReportsForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<ReportsResponse>,
    ReportQuery | undefined
>(GET_REPORTS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getReportsForTutorApi(payload);
        return {
            status: "success",
            message: "Lấy danh sách báo cáo thành công",
            data: response
        };
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const getReportDetailForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<ReportDetail>,
    string
>(GET_REPORT_DETAIL_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getReportDetailForTutorApi(payload);
        return {
            status: "success",
            message: "Lấy chi tiết báo cáo thành công",
            data: response
        };
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const updateReportStatusForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { reportId: string; params: UpdateReportStatusParams }
>(UPDATE_REPORT_STATUS_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateReportStatusForTutorApi(payload.reportId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

export const cancelReportForTutorApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    string
>(CANCEL_REPORT_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await cancelReportForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

