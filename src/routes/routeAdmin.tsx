import { Outlet, type RouteObject } from "react-router-dom";
import { AdminDashboardPage } from "../pages/admin/dashboard";
import AdminLayout from "../layouts/admin/adminLayout";
import {
    AdminDetailStudentPage,
    AdminListStudentPage,
} from "../pages/admin/user/student";
import {
    AdminDetailParentPage,
    AdminListParentPage,
} from "../pages/admin/user/parent";
import {
    AdminDetailTutorPage,
    AdminListTutorPage,
} from "../pages/admin/user/tutor";
import { AdminListClassPage, AdminDetailClassPage } from "../pages/admin/manage/class";
import { AdminListNotificationPage, AdminSendNotificationPage } from "../pages/admin/manage/notification";
import { AdminListReportPage } from "../pages/admin/manage/report";
import { AdminListTutorTransactionPage } from "../pages/admin/transaction/tutor";
import { AdminListStudentTransactionPage } from "../pages/admin/transaction/student";
import { AdminListParentTransactionPage } from "../pages/admin/transaction/parent";
import { AdminWalletPage } from "../pages/admin/wallet";
import { AdminCommissionPage, AdminCommissionHistoryPage } from "../pages/admin/commission";
import { PrivateAuthAdmin } from "../components/private";

const routeAdmin: RouteObject[] = [
    {
        path: "admin",
        element: <AdminLayout />,
        children: [
            {
                element: (
                    <PrivateAuthAdmin>
                        <Outlet />
                    </PrivateAuthAdmin>
                ),
                children: [
                    {
                        path: "dashboard",
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "student",
                        element: <AdminListStudentPage />,
                    },
                    {
                        path: "student/:id/detail",
                        element: <AdminDetailStudentPage />,
                    },
                    {
                        path: "parent",
                        element: <AdminListParentPage />,
                    },
                    {
                        path: "parent/:id/detail",
                        element: <AdminDetailParentPage />,
                    },
                    {
                        path: "tutor",
                        element: <AdminListTutorPage />,
                    },
                    {
                        path: "tutor/:id/detail",
                        element: <AdminDetailTutorPage />,
                    },
                    {
                        path: "class",
                        element: <AdminListClassPage />,
                    },
                    {
                        path: "class/:id/detail",
                        element: <AdminDetailClassPage />,
                    },
                    {
                        path: "notification",
                        element: <AdminListNotificationPage />,
                    },
                    {
                        path: "notification/send",
                        element: <AdminSendNotificationPage />,
                    },
                    {
                        path: "report",
                        element: <AdminListReportPage />,
                    },
                    {
                        path: "transaction/tutor",
                        element: <AdminListTutorTransactionPage />,
                    },
                    {
                        path: "transaction/student",
                        element: <AdminListStudentTransactionPage />,
                    },
                    {
                        path: "transaction/parent",
                        element: <AdminListParentTransactionPage />,
                    },
                    {
                        path: "wallet",
                        element: <AdminWalletPage />,
                    },
                    {
                        path: "commission",
                        element: <AdminCommissionPage />,
                    },
                    {
                        path: "commission/history",
                        element: <AdminCommissionHistoryPage />,
                    },
                ],
            },
        ],
    },
];

export default routeAdmin;
