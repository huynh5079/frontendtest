import { jsx as _jsx } from "react/jsx-runtime";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_TUTOR } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";
const PrivateAuthTutor = ({ children }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_TUTOR) {
        return _jsx(Navigate, { to: routes.unauthorized, replace: true });
    }
    return children;
};
export default PrivateAuthTutor;
