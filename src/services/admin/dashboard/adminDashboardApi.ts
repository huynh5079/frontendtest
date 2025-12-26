import request from "../../request";

export interface DashboardStatistics {
    totalUsers: {
        total: number;
        students: number;
        parents: number;
        tutors: number;
        growth: number; // percentage growth
    };
    totalClasses: {
        total: number;
        ongoing: number;
        completed: number;
        pending: number;
        growth: number;
    };
    totalTransactions: {
        total: number;
        success: number;
        pending: number;
        failed: number;
        growth: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        growth: number;
        breakdown?: {
            commission: number;
            classCreationFee: number;
            requestCreationFee: number;
        };
    };
}

export const getDashboardStatisticsApi = async (): Promise<DashboardStatistics> => {
    const response = await request.get("admin/dashboard/statistics");
    console.log("[Dashboard API] Full response:", response);
    console.log("[Dashboard API] response.data:", response.data);
    console.log("[Dashboard API] response.data?.data:", response.data?.data);
    console.log("[Dashboard API] response.data?.Data:", response.data?.Data);
    
    // API trả về ApiResponse<object> với structure: { Status, Message, Data }
    // Backend dùng PascalCase: Data
    const apiResponse = response.data;
    const data = apiResponse?.Data || apiResponse?.data || apiResponse;
    
    console.log("[Dashboard API] Extracted data:", data);
    console.log("[Dashboard API] Revenue data:", data?.revenue);
    
    return data;
};

export interface RecentActivity {
    id: string;
    type: string; // "user_registration", "transaction", "tutor_application", "report"
    description: string;
    icon: string; // "user", "lock", "warning", "check"
    color: string; // Hex color code
    createdAt: string; // ISO date string
}

export interface RecentActivitiesResponse {
    items: RecentActivity[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export const getRecentActivitiesApi = async (page: number = 1, pageSize: number = 5): Promise<RecentActivitiesResponse> => {
    const response = await request.get(`admin/dashboard/recent-activities?page=${page}&pageSize=${pageSize}`);
    const apiResponse = response.data?.data || response.data;
    return apiResponse || { items: [], page: 1, pageSize: 5, total: 0, totalPages: 0 };
};

