import { jsx as _jsx } from "react/jsx-runtime";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_STUDENT } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";
const PrivateAuthStudent = ({ children }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_STUDENT) {
        return _jsx(Navigate, { to: routes.unauthorized, replace: true });
    }
    return children;
};
export default PrivateAuthStudent;
