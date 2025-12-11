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
import { TutorDetailLessonPage, TutorStudySchedulePage } from "../pages/tutor/studySchedule";
import TutorVideoAnalysisPage from "../pages/tutor/studySchedule/videoAnalysis";
import { TutorListNotificationPage } from "../pages/tutor/notification";
import { ChatPage } from "../pages/system/chat";

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
                        path: "study_schedule",
                        element: <TutorStudySchedulePage />,
                    },
                    {
                        path: "study_schedule/lesson/:id/detail",
                        element: <TutorDetailLessonPage />,
                    },
                    {
                        path: "study_schedule/lesson/:id/detail/video/:videoId",
                        element: <TutorVideoAnalysisPage />,
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
                        path: "notification",
                        element: <TutorListNotificationPage />,
                    },
                    {
                        path: "wallet",
                        element: <TutorWalletPage />,
                    },
                    {
                        path: "chat",
                        element: <ChatPage />,
                    },
                ],
            },
        ],
    },
];

export default routeTutor;
