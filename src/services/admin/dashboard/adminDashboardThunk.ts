import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStatisticsApi, getRecentActivitiesApi, type RecentActivitiesResponse } from "./adminDashboardApi";
import { setLoading, setStatistics, setError } from "./adminDashboardSlice";

export const getDashboardStatisticsApiThunk = createAsyncThunk(
    "adminDashboard/getStatistics",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const data = await getDashboardStatisticsApi();
            dispatch(setStatistics(data));
            return data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Lỗi khi tải thống kê";
            dispatch(setError(errorMessage));
            throw error;
        }
    }
);

export const getRecentActivitiesApiThunk = createAsyncThunk(
    "adminDashboard/getRecentActivities",
    async ({ page = 1, pageSize = 5 }: { page?: number; pageSize?: number } = {}) => {
        try {
            const data = await getRecentActivitiesApi(page, pageSize);
            return data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Lỗi khi tải hoạt động gần đây";
            throw new Error(errorMessage);
        }
    }
);

