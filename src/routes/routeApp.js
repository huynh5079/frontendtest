import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { LandingLayout } from "../layouts";
import { LandingPage } from "../pages/system/landing";
import { LoginPage } from "../pages/system/login";
import { RegisterPage, RegisterParentPage, RegisterStudentPage, RegisterTutorPage, } from "../pages/system/register";
import { AboutPage } from "../pages/system/about";
import { ForgotPasswordPage } from "../pages/system/forgotPasword";
import { ListTutorPage } from "../pages/system/tutor/list";
import { DetailTutorPage } from "../pages/system/tutor/detail";
import { ListCoursePage } from "../pages/system/course/list";
import { DetailCoursePage } from "../pages/system/course/detail";
import routeStudent from "./routeStudent";
import routeParent from "./routeParent";
import routeTutor from "./routeTutor";
import routeAdmin from "./routeAdmin";
import { VerifyOtpForgotPasswordPage, VerifyOtpParentPage, VerifyOtpStudentPage, VerifyOtpTutorPage, } from "../pages/system/verifyOtp";
import { PrivateAuthRoot } from "../components/private";
import { UnauthorizedPage } from "../pages/system/unauthorized";
export default function () {
    return (_jsx(Fragment, { children: _jsx(RouterProvider, { router: routerRoot }) }));
}
export const routerRoot = createBrowserRouter([
    {
        path: "/",
        element: _jsx(LandingLayout, {}),
        children: [
            {
                element: (_jsx(PrivateAuthRoot, { children: _jsx(Outlet, {}) })),
                children: [
                    {
                        path: "",
                        element: _jsx(LandingPage, {}),
                    },
                    {
                        path: "/about",
                        element: _jsx(AboutPage, {}),
                    },
                    {
                        path: "/login",
                        element: _jsx(LoginPage, {}),
                    },
                    {
                        path: "forgot_password",
                        element: _jsx(ForgotPasswordPage, {}),
                    },
                    {
                        path: "verify_otp/student",
                        element: _jsx(VerifyOtpStudentPage, {}),
                    },
                    {
                        path: "verify_otp/parent",
                        element: _jsx(VerifyOtpParentPage, {}),
                    },
                    {
                        path: "verify_otp/tutor",
                        element: _jsx(VerifyOtpTutorPage, {}),
                    },
                    {
                        path: "verify_otp/forgot_password",
                        element: _jsx(VerifyOtpForgotPasswordPage, {}),
                    },
                    {
                        path: "/register",
                        element: _jsx(RegisterPage, {}),
                    },
                    {
                        path: "/register/tutor",
                        element: _jsx(RegisterTutorPage, {}),
                    },
                    {
                        path: "/register/student",
                        element: _jsx(RegisterStudentPage, {}),
                    },
                    {
                        path: "/register/parent",
                        element: _jsx(RegisterParentPage, {}),
                    },
                    {
                        path: "/tutor",
                        element: _jsx(ListTutorPage, {}),
                    },
                    {
                        path: "/tutor/:id/detail",
                        element: _jsx(DetailTutorPage, {}),
                    },
                    {
                        path: "/course",
                        element: _jsx(ListCoursePage, {}),
                    },
                    {
                        path: "/course/:id/detail",
                        element: _jsx(DetailCoursePage, {}),
                    },
                ],
            },
        ],
    },
    {
        path: "unauthorized",
        element: _jsx(UnauthorizedPage, {}),
    },
    ...routeStudent,
    ...routeParent,
    ...routeTutor,
    ...routeAdmin,
]);
export const navigateHook = (path, opts) => {
    routerRoot.navigate(path, opts);
};
