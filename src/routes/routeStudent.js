import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import StudentLayout from "../layouts/student/studentLayout";
import { ListTutorPage } from "../pages/system/tutor/list";
import { StudentInformationPage } from "../pages/student/profile";
import { DetailTutorPage } from "../pages/system/tutor/detail";
import { StudentBookTutor } from "../pages/student/book";
import { ListCoursePage } from "../pages/system/course/list";
import { DetailCoursePage } from "../pages/system/course/detail";
import { LandingPage } from "../pages/system/landing";
import { PrivateAuthStudent } from "../components/private";
const routeStudent = [
    {
        path: "student",
        element: _jsx(StudentLayout, {}),
        children: [
            {
                element: (_jsx(PrivateAuthStudent, { children: _jsx(Outlet, {}) })),
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
                        element: _jsx(StudentBookTutor, {}),
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
                        element: _jsx(StudentInformationPage, {}),
                    },
                ],
            },
        ],
    },
];
export default routeStudent;
