import type { JSX } from "react";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_PARENT } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";

const PrivateAuthParent = ({ children }: { children: JSX.Element }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_PARENT) {
        return <Navigate to={routes.unauthorized} replace />;
    }
    return children;
};

export default PrivateAuthParent;
