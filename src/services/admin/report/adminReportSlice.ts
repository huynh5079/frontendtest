import { createSlice } from "@reduxjs/toolkit";
import type { ReportItem, ReportDetail } from "./adminReportApi";
import {
    getReportsForAdminApiThunk,
    getReportDetailForAdminApiThunk,
    updateReportStatusApiThunk,
} from "./adminReportThunk";
import { get } from "lodash";

interface ReportState {
    reports: ReportItem[];
    reportDetail: ReportDetail | null;
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: ReportState = {
    reports: [],
    reportDetail: null,
    total: 0,
    loading: false,
    error: null,
};

const adminReportSlice = createSlice({
    name: "adminReport",
    initialState,
    reducers: {
        clearReports: (state) => {
            state.reports = [];
            state.total = 0;
            state.error = null;
        },
        clearReportDetail: (state) => {
            state.reportDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Reports
            .addCase(getReportsForAdminApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReportsForAdminApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                const data = get(action.payload, "data", null);
                if (data) {
                    state.reports = data.items || [];
                    state.total = data.total || 0;
                }
            })
            .addCase(getReportsForAdminApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            })
            // Get Report Detail
            .addCase(getReportDetailForAdminApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReportDetailForAdminApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                const data = get(action.payload, "data", null);
                if (data) {
                    state.reportDetail = data;
                }
            })
            .addCase(getReportDetailForAdminApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            })
            // Update Report Status
            .addCase(updateReportStatusApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportStatusApiThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateReportStatusApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
});

export const { clearReports, clearReportDetail } = adminReportSlice.actions;
export default adminReportSlice.reducer;

