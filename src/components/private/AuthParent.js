import { jsx as _jsx } from "react/jsx-runtime";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_PARENT } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";
const PrivateAuthParent = ({ children }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_PARENT) {
        return _jsx(Navigate, { to: routes.unauthorized, replace: true });
    }
    return children;
};
export default PrivateAuthParent;
