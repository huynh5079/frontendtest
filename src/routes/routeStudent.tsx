import { Outlet, type RouteObject } from "react-router-dom";
import StudentLayout from "../layouts/student/studentLayout";
import { ListTutorPage } from "../pages/system/tutor/list";
import { StudentInformationPage } from "../pages/student/profile";
import { DetailTutorPage } from "../pages/system/tutor/detail";
import { StudentBookTutor } from "../pages/student/book";
import { ListCoursePage } from "../pages/system/course/list";
import { DetailCoursePage } from "../pages/system/course/detail";
import { LandingPage } from "../pages/system/landing";
import { ChatPage } from "../pages/system/chat";
import { PrivateAuthStudent } from "../components/private";
import { AboutPage } from "../pages/system/about";
import { ContactPage } from "../pages/system/contact";

const routeStudent: RouteObject[] = [
    {
        path: "student",
        element: <StudentLayout />,
        children: [
            {
                element: (
                    <PrivateAuthStudent>
                        <Outlet />
                    </PrivateAuthStudent>
                ),
                children: [
                    {
                        path: "",
                        element: <LandingPage />,
                    },
                    {
                        path: "tutor",
                        element: <ListTutorPage />,
                    },
                    {
                        path: "tutor/:id/detail",
                        element: <DetailTutorPage />,
                    },
                    {
                        path: "tutor/book/:id",
                        element: <StudentBookTutor />,
                    },
                    {
                        path: "course",
                        element: <ListCoursePage />,
                    },
                    {
                        path: "course/:id/detail",
                        element: <DetailCoursePage />,
                    },
                    {
                        path: "about",
                        element: <AboutPage />,
                    },
                    {
                        path: "contact",
                        element: <ContactPage />,
                    },
                    {
                        path: "information",
                        element: <StudentInformationPage />,
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

export default routeStudent;
