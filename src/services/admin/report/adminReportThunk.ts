import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import {
    getReportsForAdminApi,
    getReportDetailForAdminApi,
    updateReportStatusApi,
    type ReportItem,
    type ReportDetail,
    type ReportQuery,
    type UpdateReportStatusParams,
    type ReportsResponse,
} from "./adminReportApi";

const GET_REPORTS_FOR_ADMIN = "GET_REPORTS_FOR_ADMIN";
const GET_REPORT_DETAIL_FOR_ADMIN = "GET_REPORT_DETAIL_FOR_ADMIN";
const UPDATE_REPORT_STATUS = "UPDATE_REPORT_STATUS";

export const getReportsForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<ReportsResponse>,
    ReportQuery | undefined
>(GET_REPORTS_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getReportsForAdminApi(payload);
        // Wrap response in ResponseFromServer format
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

export const getReportDetailForAdminApiThunk = createAsyncThunk<
    ResponseFromServer<ReportDetail>,
    string
>(GET_REPORT_DETAIL_FOR_ADMIN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getReportDetailForAdminApi(payload);
        // Wrap response in ResponseFromServer format
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

export const updateReportStatusApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    { reportId: string; params: UpdateReportStatusParams }
>(UPDATE_REPORT_STATUS, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateReportStatusApi(payload.reportId, payload.params);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response?.data,
        });
    }
});

