import type { JSX } from "react";
import { useAppSelector } from "../../app/store";
import { selectUserLogin } from "../../app/selector";
import { USER_TUTOR } from "../../utils/helper";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes/routeName";

const PrivateAuthTutor = ({ children }: { children: JSX.Element }) => {
    const user = useAppSelector(selectUserLogin);
    if (user?.role !== USER_TUTOR) {
        return <Navigate to={routes.unauthorized} replace />;
    }
    return children;
};

export default PrivateAuthTutor;
