import { useEffect, useState, type FC } from "react";
import { useDocumentTitle } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectDashboardStatistics,
    selectDashboardLoading,
    selectDashboardError,
} from "../../../app/selector";
import { getDashboardStatisticsApiThunk, getRecentActivitiesApiThunk } from "../../../services/admin/dashboard/adminDashboardThunk";
import type { RecentActivity } from "../../../services/admin/dashboard/adminDashboardApi";
import { LoadingSpinner } from "../../../components/elements";
import {
    MdPeople,
    MdClass,
    MdAccountBalanceWallet,
    MdTrendingUp,
    MdTrendingDown,
    MdSchool,
    MdFamilyRestroom,
    MdCheckCircle,
    MdSchedule,
    MdCancel,
    MdLock,
    MdWarning,
} from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import "../../../assets/scss/admin/dashboard/admin_dashboard.scss";

const AdminDashboardPage: FC = () => {
    useDocumentTitle("Trang tổng quát");
    const dispatch = useAppDispatch();
    const statistics = useAppSelector(selectDashboardStatistics);
    const loading = useAppSelector(selectDashboardLoading);
    const error = useAppSelector(selectDashboardError);

    // Recent activities state - MUST be declared before any conditional returns
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [activitiesPage, setActivitiesPage] = useState(1);
    const [activitiesTotalPages, setActivitiesTotalPages] = useState(0);
    const [activitiesTotal, setActivitiesTotal] = useState(0);
    const pageSize = 5;

    // Fetch dashboard statistics
    useEffect(() => {
        dispatch(getDashboardStatisticsApiThunk());
    }, [dispatch]);

    // Fetch recent activities
    useEffect(() => {
        const fetchActivities = async () => {
            setActivitiesLoading(true);
            try {
                const response = await dispatch(getRecentActivitiesApiThunk({ page: activitiesPage, pageSize })).unwrap();
                setRecentActivities(response.items || []);
                setActivitiesTotalPages(response.totalPages || 0);
                setActivitiesTotal(response.total || 0);
            } catch (error) {
                console.error("Failed to fetch recent activities:", error);
                setRecentActivities([]);
                setActivitiesTotalPages(0);
                setActivitiesTotal(0);
            } finally {
                setActivitiesLoading(false);
            }
        };
        fetchActivities();
    }, [dispatch, activitiesPage, pageSize]);

    // Debug: Log statistics khi có thay đổi
    useEffect(() => {
        console.log("[Dashboard] Statistics updated:", statistics);
        console.log("[Dashboard] Revenue:", statistics?.revenue);
    }, [statistics]);

    // Format time ago từ ISO date string
    const formatTimeAgo = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return "Vừa xong";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        }
    };

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    const formatCurrency = (num: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(num);
    };

    const formatGrowth = (growth: number): string => {
        const sign = growth >= 0 ? "+" : "";
        return `${sign}${growth.toFixed(1)}%`;
    };

    // Early returns AFTER all hooks
    if (loading && !statistics) {
        return (
            <section id="admin-dashboard-section">
                <div className="ads-container">
                    <div className="loading-container">
                        <LoadingSpinner />
                        <p>Đang tải thống kê...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="admin-dashboard-section">
                <div className="ads-container">
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button
                            onClick={() => dispatch(getDashboardStatisticsApiThunk())}
                            className="retry-button"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Mock data nếu API chưa có hoặc structure không đúng
    const defaultStats = {
        totalUsers: {
            total: 0,
            students: 0,
            parents: 0,
            tutors: 0,
            growth: 0,
        },
        totalClasses: {
            total: 0,
            ongoing: 0,
            completed: 0,
            pending: 0,
            growth: 0,
        },
        totalTransactions: {
            total: 0,
            success: 0,
            pending: 0,
            failed: 0,
            growth: 0,
        },
        revenue: {
            total: 0,
            thisMonth: 0,
            lastMonth: 0,
            growth: 0,
        },
    };

    // Kiểm tra xem statistics có đúng structure không
    const hasValidStructure = statistics && 
        statistics.totalUsers && 
        statistics.totalClasses && 
        statistics.totalTransactions && 
        statistics.revenue;

    const stats = hasValidStructure ? statistics : defaultStats;

    // Data for role distribution chart
    const roleChartData = [
        {
            name: "Học viên",
            value: stats.totalUsers?.students || 0,
            color: "#4299e1",
        },
        {
            name: "Phụ huynh",
            value: stats.totalUsers?.parents || 0,
            color: "#48bb78",
        },
        {
            name: "Gia sư",
            value: stats.totalUsers?.tutors || 0,
            color: "#ed8936",
        },
    ];

    const getActivityIcon = (iconType: string) => {
        switch (iconType) {
            case "user":
                return <MdPeople />;
            case "lock":
                return <MdLock />;
            case "warning":
                return <MdWarning />;
            case "check":
                return <MdCheckCircle />;
            default:
                return <MdPeople />;
        }
    };

    return (
        <section id="admin-dashboard-section">
            <div className="ads-container">
                <div className="adscr1">
                    <h2>Trang tổng quát</h2>
                    <p>Thống kê tổng quan hệ thống</p>
                </div>

                <div className="adscr2">
                    {/* Total Users Card */}
                    <div className="ads-card ads-card-users">
                        <div className="ads-card-header">
                            <div className="ads-card-icon ads-card-icon-users">
                                <MdPeople />
                            </div>
                            <div className="ads-card-title">
                                <h3>Tổng người dùng</h3>
                                <p className="ads-card-subtitle">Total Users</p>
                            </div>
                        </div>
                        <div className="ads-card-body">
                            <div className="ads-card-main-value">
                                {formatNumber(stats.totalUsers?.total || 0)}
                            </div>
                            <div className="ads-card-growth">
                                {(stats.totalUsers?.growth || 0) >= 0 ? (
                                    <MdTrendingUp className="trend-up" />
                                ) : (
                                    <MdTrendingDown className="trend-down" />
                                )}
                                <span
                                    className={
                                        (stats.totalUsers?.growth || 0) >= 0
                                            ? "growth-positive"
                                            : "growth-negative"
                                    }
                                >
                                    {formatGrowth(stats.totalUsers?.growth || 0)}
                                </span>
                                <span className="growth-label">so với tháng trước</span>
                            </div>
                        </div>
                        <div className="ads-card-footer">
                            <div className="ads-card-detail-item">
                                <MdSchool className="detail-icon" />
                                <span>Học viên: {formatNumber(stats.totalUsers?.students || 0)}</span>
                            </div>
                            <div className="ads-card-detail-item">
                                <MdFamilyRestroom className="detail-icon" />
                                <span>Phụ huynh: {formatNumber(stats.totalUsers?.parents || 0)}</span>
                            </div>
                            <div className="ads-card-detail-item">
                                <FaChalkboardTeacher className="detail-icon" />
                                <span>Gia sư: {formatNumber(stats.totalUsers?.tutors || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Classes Card */}
                    <div className="ads-card ads-card-classes">
                        <div className="ads-card-header">
                            <div className="ads-card-icon ads-card-icon-classes">
                                <MdClass />
                            </div>
                            <div className="ads-card-title">
                                <h3>Tổng lớp học</h3>
                                <p className="ads-card-subtitle">Total Classes</p>
                            </div>
                        </div>
                        <div className="ads-card-body">
                            <div className="ads-card-main-value">
                                {formatNumber(stats.totalClasses?.total || 0)}
                            </div>
                            <div className="ads-card-growth">
                                {(stats.totalClasses?.growth || 0) >= 0 ? (
                                    <MdTrendingUp className="trend-up" />
                                ) : (
                                    <MdTrendingDown className="trend-down" />
                                )}
                                <span
                                    className={
                                        (stats.totalClasses?.growth || 0) >= 0
                                            ? "growth-positive"
                                            : "growth-negative"
                                    }
                                >
                                    {formatGrowth(stats.totalClasses?.growth || 0)}
                                </span>
                                <span className="growth-label">so với tháng trước</span>
                            </div>
                        </div>
                        <div className="ads-card-footer">
                            <div className="ads-card-detail-item">
                                <MdSchedule className="detail-icon status-pending" />
                                <span>Đang chờ: {formatNumber(stats.totalClasses?.pending || 0)}</span>
                            </div>
                            <div className="ads-card-detail-item">
                                <MdCheckCircle className="detail-icon status-ongoing" />
                                <span>Đang diễn ra: {formatNumber(stats.totalClasses?.ongoing || 0)}</span>
                            </div>
                            <div className="ads-card-detail-item">
                                <MdCheckCircle className="detail-icon status-completed" />
                                <span>Hoàn thành: {formatNumber(stats.totalClasses?.completed || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Transactions Card */}
                    <div className="ads-card ads-card-transactions">
                        <div className="ads-card-header">
                            <div className="ads-card-icon ads-card-icon-transactions">
                                <MdAccountBalanceWallet />
                            </div>
                            <div className="ads-card-title">
                                <h3>Tổng giao dịch</h3>
                                <p className="ads-card-subtitle">Total Transactions</p>
                            </div>
                        </div>
                        <div className="ads-card-body">
                            <div className="ads-card-main-value">
                                {formatNumber(stats.totalTransactions?.total || 0)}
                            </div>
                            <div className="ads-card-growth">
                                {(stats.totalTransactions?.growth || 0) >= 0 ? (
                                    <MdTrendingUp className="trend-up" />
                                ) : (
                                    <MdTrendingDown className="trend-down" />
                                )}
                                <span
                                    className={
                                        (stats.totalTransactions?.growth || 0) >= 0
                                            ? "growth-positive"
                                            : "growth-negative"
                                    }
                                >
                                    {formatGrowth(stats.totalTransactions?.growth || 0)}
                                </span>
                                <span className="growth-label">so với tháng trước</span>
                            </div>
                        </div>
                        <div className="ads-card-footer">
                            <div className="ads-card-detail-item">
                                <MdCheckCircle className="detail-icon status-success" />
                                <span>Thành công: {formatNumber(stats.totalTransactions?.success || 0)}</span>
                            </div>
                            <div className="ads-card-detail-item">
                                <MdSchedule className="detail-icon status-pending" />
                                <span>Đang xử lý: {formatNumber(stats.totalTransactions?.pending || 0)}</span>
                            </div>
                            <div className="ads-card-detail-item">
                                <MdCancel className="detail-icon status-failed" />
                                <span>Thất bại: {formatNumber(stats.totalTransactions?.failed || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="ads-card ads-card-revenue">
                        <div className="ads-card-header">
                            <div className="ads-card-icon ads-card-icon-revenue">
                                <MdAccountBalanceWallet />
                            </div>
                            <div className="ads-card-title">
                                <h3>Doanh thu</h3>
                                <p className="ads-card-subtitle">Revenue</p>
                            </div>
                        </div>
                        <div className="ads-card-body">
                            <div className="ads-card-main-value">
                                {formatCurrency(stats.revenue?.total || 0)}
                            </div>
                            <div className="ads-card-growth">
                                {(stats.revenue?.growth || 0) >= 0 ? (
                                    <MdTrendingUp className="trend-up" />
                                ) : (
                                    <MdTrendingDown className="trend-down" />
                                )}
                                <span
                                    className={
                                        (stats.revenue?.growth || 0) >= 0
                                            ? "growth-positive"
                                            : "growth-negative"
                                    }
                                >
                                    {formatGrowth(stats.revenue?.growth || 0)}
                                </span>
                                <span className="growth-label">so với tháng trước</span>
                            </div>
                        </div>
                        <div className="ads-card-footer">
                            <div className="ads-card-detail-item">
                                <span className="detail-label">Tháng này:</span>
                                <span className="detail-value">
                                    {formatCurrency(stats.revenue?.thisMonth || 0)}
                                </span>
                            </div>
                            <div className="ads-card-detail-item">
                                <span className="detail-label">Tháng trước:</span>
                                <span className="detail-value">
                                    {formatCurrency(stats.revenue?.lastMonth || 0)}
                                </span>
                            </div>
                            {stats.revenue?.breakdown && (
                                <>
                                    <div className="ads-card-detail-item" style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                                        <span className="detail-label">Hoa hồng:</span>
                                        <span className="detail-value">
                                            {formatCurrency(stats.revenue.breakdown.commission || 0)}
                                        </span>
                                    </div>
                                    <div className="ads-card-detail-item">
                                        <span className="detail-label">Phí tạo lớp:</span>
                                        <span className="detail-value">
                                            {formatCurrency(stats.revenue.breakdown.classCreationFee || 0)}
                                        </span>
                                    </div>
                                    <div className="ads-card-detail-item">
                                        <span className="detail-label">Phí tạo yêu cầu:</span>
                                        <span className="detail-value">
                                            {formatCurrency(stats.revenue.breakdown.requestCreationFee || 0)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role Distribution Chart and Recent Activity */}
                <div className="adscr3">
                    <div className="ads-chart-card">
                        <div className="ads-chart-header">
                            <h3>Phân bố người dùng theo vai trò</h3>
                            <p className="ads-chart-subtitle">User Role Distribution</p>
                        </div>
                        <div className="ads-chart-body">
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={roleChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: any) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {roleChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatNumber(value)}
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => {
                                            const item = roleChartData.find((d) => d.name === value);
                                            return `${value} (${formatNumber(item?.value || 0)})`;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="ads-chart-footer">
                            <div className="ads-chart-stat-item">
                                <div className="stat-color" style={{ backgroundColor: "#4299e1" }}></div>
                                <span className="stat-label">Học viên:</span>
                                <span className="stat-value">{formatNumber(stats.totalUsers?.students || 0)}</span>
                            </div>
                            <div className="ads-chart-stat-item">
                                <div className="stat-color" style={{ backgroundColor: "#48bb78" }}></div>
                                <span className="stat-label">Phụ huynh:</span>
                                <span className="stat-value">{formatNumber(stats.totalUsers?.parents || 0)}</span>
                            </div>
                            <div className="ads-chart-stat-item">
                                <div className="stat-color" style={{ backgroundColor: "#ed8936" }}></div>
                                <span className="stat-label">Gia sư:</span>
                                <span className="stat-value">{formatNumber(stats.totalUsers?.tutors || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="ads-activity-card">
                        <div className="ads-activity-header">
                            <h3>Hoạt động gần đây</h3>
                            <p className="ads-activity-subtitle">Recent Activity</p>
                        </div>
                        <div className="ads-activity-body">
                            {activitiesLoading ? (
                                <div className="ads-activity-empty">
                                    <p>Đang tải...</p>
                                </div>
                            ) : recentActivities.length > 0 ? (
                                <>
                                    <div className="ads-activity-list">
                                        {recentActivities.map((activity, index) => (
                                            <div
                                                key={activity.id}
                                                className="ads-activity-item"
                                                style={{
                                                    borderBottom:
                                                        index < recentActivities.length - 1
                                                            ? "1px solid #e2e8f0"
                                                            : "none",
                                                }}
                                            >
                                                <div
                                                    className="ads-activity-icon"
                                                    style={{ backgroundColor: activity.color }}
                                                >
                                                    {getActivityIcon(activity.icon)}
                                                </div>
                                                <div className="ads-activity-content">
                                                    <p className="ads-activity-description">
                                                        {activity.description}
                                                    </p>
                                                    <span className="ads-activity-time">
                                                        {formatTimeAgo(activity.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Pagination */}
                                    {activitiesTotalPages > 1 && (
                                        <div className="ads-activity-pagination">
                                            <button
                                                className="sc-btn"
                                                disabled={activitiesPage === 1}
                                                onClick={() => {
                                                    setActivitiesPage((p) => p - 1);
                                                }}
                                            >
                                                Trang trước
                                            </button>
                                            <span>
                                                {activitiesPage} / {activitiesTotalPages}
                                            </span>
                                            <button
                                                className="sc-btn"
                                                disabled={activitiesPage >= activitiesTotalPages}
                                                onClick={() => {
                                                    setActivitiesPage((p) => p + 1);
                                                }}
                                            >
                                                Trang sau
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="ads-activity-empty">
                                    <p>Chưa có hoạt động nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboardPage;
