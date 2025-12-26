import { createSlice } from "@reduxjs/toolkit";
import type { ReportItem, ReportDetail } from "./tutorReportApi";
import {
    getReportsForTutorApiThunk,
    getReportDetailForTutorApiThunk,
    updateReportStatusForTutorApiThunk,
    cancelReportForTutorApiThunk,
} from "./tutorReportThunk";
import { get } from "lodash";

interface TutorReportState {
    reports: ReportItem[];
    reportDetail: ReportDetail | null;
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: TutorReportState = {
    reports: [],
    reportDetail: null,
    total: 0,
    loading: false,
    error: null,
};

const tutorReportSlice = createSlice({
    name: "tutorReport",
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
            .addCase(getReportsForTutorApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReportsForTutorApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                const data = get(action.payload, "data", null);
                if (data) {
                    state.reports = data.items || [];
                    state.total = data.total || 0;
                }
            })
            .addCase(getReportsForTutorApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            })
            // Get Report Detail
            .addCase(getReportDetailForTutorApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReportDetailForTutorApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                const data = get(action.payload, "data", null);
                if (data) {
                    state.reportDetail = data;
                }
            })
            .addCase(getReportDetailForTutorApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            })
            // Update Report Status
            .addCase(updateReportStatusForTutorApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportStatusForTutorApiThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateReportStatusForTutorApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            })
            // Cancel Report
            .addCase(cancelReportForTutorApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelReportForTutorApiThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(cancelReportForTutorApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Có lỗi xảy ra";
            });
    },
});

export const { clearReports, clearReportDetail } = tutorReportSlice.actions;
export default tutorReportSlice.reducer;

