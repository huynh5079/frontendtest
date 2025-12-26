import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardStatistics } from "./adminDashboardApi";

interface DashboardState {
    statistics: DashboardStatistics | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    statistics: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setStatistics: (state, action: PayloadAction<DashboardStatistics>) => {
            state.statistics = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setLoading, setStatistics, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

