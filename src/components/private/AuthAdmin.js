import { jsx as _jsx } from "react/jsx-runtime";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_ADMIN } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";
const PrivateAuthAdmin = ({ children }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_ADMIN) {
        return _jsx(Navigate, { to: routes.unauthorized, replace: true });
    }
    return children;
};
export default PrivateAuthAdmin;
