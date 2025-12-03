import { jsx as _jsx } from "react/jsx-runtime";
import { selectIsAuthenticated, selectUserLogin } from "../../app/selector";
import { useAppSelector } from "../../app/store";
import { USER_ADMIN, USER_PARENT, USER_STUDENT, USER_TUTOR, } from "../../utils/helper";
import { routes } from "../../routes/routeName";
import { Navigate } from "react-router-dom";
const PrivateAuthRoot = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    if (isAuthenticated) {
        switch (user?.role) {
            case USER_ADMIN:
                return _jsx(Navigate, { to: routes.admin.dashboard, replace: true });
            case USER_PARENT:
                return _jsx(Navigate, { to: routes.parent.home, replace: true });
            case USER_TUTOR:
                return _jsx(Navigate, { to: routes.tutor.dashboard, replace: true });
            case USER_STUDENT:
                return _jsx(Navigate, { to: routes.student.home, replace: true });
            default:
                break;
        }
    }
    // Nếu chưa đăng nhập => cho phép vào trang public (login, landing,...)
    return children;
};
export default PrivateAuthRoot;
