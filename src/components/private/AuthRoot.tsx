import type { JSX } from "react";
import { selectIsAuthenticated, selectUserLogin } from "../../app/selector";
import { useAppSelector } from "../../app/store";
import {
    USER_ADMIN,
    USER_PARENT,
    USER_STUDENT,
    USER_TUTOR,
} from "../../utils/helper";
import { routes } from "../../routes/routeName";
import { Navigate } from "react-router-dom";

const PrivateAuthRoot = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);

    if (isAuthenticated) {
        switch (user?.role) {
            case USER_ADMIN:
                return <Navigate to={routes.admin.dashboard} replace />;
            case USER_PARENT:
                return <Navigate to={routes.parent.home} replace />;
            case USER_TUTOR:
                return <Navigate to={routes.tutor.dashboard} replace />;
            case USER_STUDENT:
                return <Navigate to={routes.student.home} replace />;
            default:
                break;
        }
    }

    // Nếu chưa đăng nhập => cho phép vào trang public (login, landing,...)
    return children;
};

export default PrivateAuthRoot;
