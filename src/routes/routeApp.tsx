import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
    type To,
} from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { LandingLayout } from "../layouts";
import { LandingPage } from "../pages/system/landing";
import { LoginPage } from "../pages/system/login";
import {
    RegisterPage,
    RegisterParentPage,
    RegisterStudentPage,
    RegisterTutorPage,
} from "../pages/system/register";
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
import {
    VerifyOtpForgotPasswordPage,
    VerifyOtpParentPage,
    VerifyOtpStudentPage,
    VerifyOtpTutorPage,
} from "../pages/system/verifyOtp";
import { PrivateAuthRoot } from "../components/private";
import { UnauthorizedPage } from "../pages/system/unauthorized";
import PaymentReturn from "../pages/payment/PaymentReturn";
import { ContactPage } from "../pages/system/contact";

export default function () {
    return (
        <Fragment>
            <RouterProvider router={routerRoot} />
        </Fragment>
    );
}

export const routerRoot = createBrowserRouter([
    {
        path: "/",
        element: <LandingLayout />,
        children: [
            {
                element: (
                    <PrivateAuthRoot>
                        <Outlet />
                    </PrivateAuthRoot>
                ),
                children: [
                    {
                        path: "",
                        element: <LandingPage />,
                    },
                    {
                        path: "/about",
                        element: <AboutPage />,
                    },
                    {
                        path: "contact",
                        element: <ContactPage />,
                    },
                    {
                        path: "/login",
                        element: <LoginPage />,
                    },
                    {
                        path: "forgot_password",
                        element: <ForgotPasswordPage />,
                    },
                    {
                        path: "verify_otp/student",
                        element: <VerifyOtpStudentPage />,
                    },
                    {
                        path: "verify_otp/parent",
                        element: <VerifyOtpParentPage />,
                    },
                    {
                        path: "verify_otp/tutor",
                        element: <VerifyOtpTutorPage />,
                    },
                    {
                        path: "verify_otp/forgot_password",
                        element: <VerifyOtpForgotPasswordPage />,
                    },
                    {
                        path: "/register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "/register/tutor",
                        element: <RegisterTutorPage />,
                    },
                    {
                        path: "/register/student",
                        element: <RegisterStudentPage />,
                    },
                    {
                        path: "/register/parent",
                        element: <RegisterParentPage />,
                    },
                    {
                        path: "/tutor",
                        element: <ListTutorPage />,
                    },
                    {
                        path: "/tutor/:id/detail",
                        element: <DetailTutorPage />,
                    },
                    {
                        path: "/course",
                        element: <ListCoursePage />,
                    },
                    {
                        path: "/course/:id/detail",
                        element: <DetailCoursePage />,
                    },
                ],
            },
        ],
    },
    {
        path: "unauthorized",
        element: <UnauthorizedPage />,
    },
    // Payment return routes (for PayOS redirects)
    {
        path: "payments/payos/return",
        element: <PaymentReturn />,
    },
    {
        path: "payments/payos/cancel",
        element: <PaymentReturn />,
    },
    // Payment return routes (for MoMo redirects)
    {
        path: "payments/momo/return",
        element: <PaymentReturn />,
    },
    {
        path: "payments/momo/cancel",
        element: <PaymentReturn />,
    },
    ...routeStudent,
    ...routeParent,
    ...routeTutor,
    ...routeAdmin,
]);

export const navigateHook = (path: To, opts?: any) => {
    routerRoot.navigate(path, opts);
};
