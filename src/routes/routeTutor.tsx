import { Outlet, type RouteObject } from "react-router-dom";
import TutorLayout from "../layouts/tutor/tutorLayout";
import { TutorDashboardPage } from "../pages/tutor/dashboard";
import { TutorSchedulePage } from "../pages/tutor/schedule";
import {
    TutorClassPage,
    TutorCreateClassPage,
    TutorDetailClassPage,
} from "../pages/tutor/class";
import {
    TutorChangePasswordPage,
    TutorInformationPage,
} from "../pages/tutor/information";
import { TutorWalletPage } from "../pages/tutor/wallet";
import { PrivateAuthTutor } from "../components/private";
import {
    DetailTutorBookingPage,
    ListTutorBookingPage,
} from "../pages/tutor/booking";
import {
    DetailRequestFindtutorForTutorPage,
    ListReuqestFindtutorForTutorPage,
} from "../pages/tutor/requestFindTutor";

const routeTutor: RouteObject[] = [
    {
        path: "tutor",
        element: <TutorLayout />,
        children: [
            {
                element: (
                    <PrivateAuthTutor>
                        <Outlet />
                    </PrivateAuthTutor>
                ),
                children: [
                    {
                        path: "dashboard",
                        element: <TutorDashboardPage />,
                    },
                    {
                        path: "schedule",
                        element: <TutorSchedulePage />,
                    },
                    {
                        path: "class",
                        element: <TutorClassPage />,
                    },
                    {
                        path: "class/:id/detail",
                        element: <TutorDetailClassPage />,
                    },
                    {
                        path: "class/create",
                        element: <TutorCreateClassPage />,
                    },
                    {
                        path: "booking",
                        element: <ListTutorBookingPage />,
                    },
                    {
                        path: "booking/:id/detail",
                        element: <DetailTutorBookingPage />,
                    },
                    {
                        path: "request",
                        element: <ListReuqestFindtutorForTutorPage />,
                    },
                    {
                        path: "request/:id/detail",
                        element: <DetailRequestFindtutorForTutorPage />,
                    },
                    {
                        path: "information",
                        element: <TutorInformationPage />,
                    },
                    {
                        path: "information/change_password",
                        element: <TutorChangePasswordPage />,
                    },
                    {
                        path: "wallet",
                        element: <TutorWalletPage />,
                    },
                ],
            },
        ],
    },
];

export default routeTutor;
