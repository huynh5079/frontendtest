import type { JSX } from "react";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_ADMIN } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";

const PrivateAuthAdmin = ({ children }: { children: JSX.Element }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_ADMIN) {
        return <Navigate to={routes.unauthorized} replace />;
    }
    return children;
};

export default PrivateAuthAdmin;
