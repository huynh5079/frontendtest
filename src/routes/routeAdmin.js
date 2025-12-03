import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { AdminDashboardPage } from "../pages/admin/dashboard";
import AdminLayout from "../layouts/admin/adminLayout";
import { AdminDetailStudentPage, AdminListStudentPage, } from "../pages/admin/user/student";
import { AdminDetailParentPage, AdminListParentPage, } from "../pages/admin/user/parent";
import { AdminDetailTutorPage, AdminListTutorPage, } from "../pages/admin/user/tutor";
import { AdminListClassPage } from "../pages/admin/manage/class";
import { AdminListNotificationPage } from "../pages/admin/manage/notification";
import { AdminListReportPage } from "../pages/admin/manage/report";
import { AdminListTutorTransactionPage } from "../pages/admin/transaction/tutor";
import { AdminListStudentTransactionPage } from "../pages/admin/transaction/student";
import { AdminListParentTransactionPage } from "../pages/admin/transaction/parent";
import { PrivateAuthAdmin } from "../components/private";
const routeAdmin = [
    {
        path: "admin",
        element: _jsx(AdminLayout, {}),
        children: [
            {
                element: (_jsx(PrivateAuthAdmin, { children: _jsx(Outlet, {}) })),
                children: [
                    {
                        path: "dashboard",
                        element: _jsx(AdminDashboardPage, {}),
                    },
                    {
                        path: "student",
                        element: _jsx(AdminListStudentPage, {}),
                    },
                    {
                        path: "student/:id/detail",
                        element: _jsx(AdminDetailStudentPage, {}),
                    },
                    {
                        path: "parent",
                        element: _jsx(AdminListParentPage, {}),
                    },
                    {
                        path: "parent/:id/detail",
                        element: _jsx(AdminDetailParentPage, {}),
                    },
                    {
                        path: "tutor",
                        element: _jsx(AdminListTutorPage, {}),
                    },
                    {
                        path: "tutor/:id/detail",
                        element: _jsx(AdminDetailTutorPage, {}),
                    },
                    {
                        path: "class",
                        element: _jsx(AdminListClassPage, {}),
                    },
                    {
                        path: "notification",
                        element: _jsx(AdminListNotificationPage, {}),
                    },
                    {
                        path: "report",
                        element: _jsx(AdminListReportPage, {}),
                    },
                    {
                        path: "transaction/tutor",
                        element: _jsx(AdminListTutorTransactionPage, {}),
                    },
                    {
                        path: "transaction/student",
                        element: _jsx(AdminListStudentTransactionPage, {}),
                    },
                    {
                        path: "transaction/parent",
                        element: _jsx(AdminListParentTransactionPage, {}),
                    },
                ],
            },
        ],
    },
];
export default routeAdmin;
