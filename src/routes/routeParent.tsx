import { Outlet, type RouteObject } from "react-router-dom";
import { ListTutorPage } from "../pages/system/tutor/list";
import { DetailTutorPage } from "../pages/system/tutor/detail";
import { ListCoursePage } from "../pages/system/course/list";
import { DetailCoursePage } from "../pages/system/course/detail";
import { LandingPage } from "../pages/system/landing";
import { ChatPage } from "../pages/system/chat";
import ParentLayout from "../layouts/parent/parentlayout";
import { ParentBookTutor } from "../pages/parent/book";
import ParentInformationPage from "../pages/parent/profile/information";
import { PrivateAuthParent } from "../components/private";
import { AboutPage } from "../pages/system/about";
import { ContactPage } from "../pages/system/contact";

const routeParent: RouteObject[] = [
    {
        path: "parent",
        element: <ParentLayout />,
        children: [
            {
                element: (
                    <PrivateAuthParent>
                        <Outlet />
                    </PrivateAuthParent>
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
                        element: <ParentBookTutor />,
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
                        element: <ParentInformationPage />,
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

export default routeParent;
