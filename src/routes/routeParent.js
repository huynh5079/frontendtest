import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { ListTutorPage } from "../pages/system/tutor/list";
import { DetailTutorPage } from "../pages/system/tutor/detail";
import { ListCoursePage } from "../pages/system/course/list";
import { DetailCoursePage } from "../pages/system/course/detail";
import { LandingPage } from "../pages/system/landing";
import ParentLayout from "../layouts/parent/parentlayout";
import { ParentBookTutor } from "../pages/parent/book";
import ParentInformationPage from "../pages/parent/profile/information";
import { PrivateAuthParent } from "../components/private";
const routeParent = [
    {
        path: "parent",
        element: _jsx(ParentLayout, {}),
        children: [
            {
                element: (_jsx(PrivateAuthParent, { children: _jsx(Outlet, {}) })),
                children: [
                    {
                        path: "",
                        element: _jsx(LandingPage, {}),
                    },
                    {
                        path: "tutor",
                        element: _jsx(ListTutorPage, {}),
                    },
                    {
                        path: "tutor/:id/detail",
                        element: _jsx(DetailTutorPage, {}),
                    },
                    {
                        path: "tutor/book/:id",
                        element: _jsx(ParentBookTutor, {}),
                    },
                    {
                        path: "course",
                        element: _jsx(ListCoursePage, {}),
                    },
                    {
                        path: "course/:id/detail",
                        element: _jsx(DetailCoursePage, {}),
                    },
                    {
                        path: "information",
                        element: _jsx(ParentInformationPage, {}),
                    },
                ],
            },
        ],
    },
];
export default routeParent;
