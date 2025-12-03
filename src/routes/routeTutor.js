import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import TutorLayout from "../layouts/tutor/tutorLayout";
import { TutorDashboardPage } from "../pages/tutor/dashboard";
import { TutorSchedulePage } from "../pages/tutor/schedule";
import { TutorClassPage, TutorCreateClassPage, TutorDetailClassPage, } from "../pages/tutor/class";
import { TutorChangePasswordPage, TutorInformationPage, } from "../pages/tutor/information";
import { TutorWalletPage } from "../pages/tutor/wallet";
import { PrivateAuthTutor } from "../components/private";
import { DetailTutorBookingPage, ListTutorBookingPage, } from "../pages/tutor/booking";
import { DetailRequestFindtutorForTutorPage, ListReuqestFindtutorForTutorPage, } from "../pages/tutor/requestFindTutor";
const routeTutor = [
    {
        path: "tutor",
        element: _jsx(TutorLayout, {}),
        children: [
            {
                element: (_jsx(PrivateAuthTutor, { children: _jsx(Outlet, {}) })),
                children: [
                    {
                        path: "dashboard",
                        element: _jsx(TutorDashboardPage, {}),
                    },
                    {
                        path: "schedule",
                        element: _jsx(TutorSchedulePage, {}),
                    },
                    {
                        path: "class",
                        element: _jsx(TutorClassPage, {}),
                    },
                    {
                        path: "class/:id/detail",
                        element: _jsx(TutorDetailClassPage, {}),
                    },
                    {
                        path: "class/create",
                        element: _jsx(TutorCreateClassPage, {}),
                    },
                    {
                        path: "booking",
                        element: _jsx(ListTutorBookingPage, {}),
                    },
                    {
                        path: "booking/:id/detail",
                        element: _jsx(DetailTutorBookingPage, {}),
                    },
                    {
                        path: "request",
                        element: _jsx(ListReuqestFindtutorForTutorPage, {}),
                    },
                    {
                        path: "request/:id/detail",
                        element: _jsx(DetailRequestFindtutorForTutorPage, {}),
                    },
                    {
                        path: "information",
                        element: _jsx(TutorInformationPage, {}),
                    },
                    {
                        path: "information/change_password",
                        element: _jsx(TutorChangePasswordPage, {}),
                    },
                    {
                        path: "wallet",
                        element: _jsx(TutorWalletPage, {}),
                    },
                ],
            },
        ],
    },
];
export default routeTutor;
