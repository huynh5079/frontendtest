import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { HeaderTutor } from "../../components/tutor/header";
import { SidebarTutor } from "../../components/tutor/sidebar";
import { useAppDispatch } from "../../app/store";
import { getProfileTutorApiThunk } from "../../services/user/userThunk";
const TutorLayout = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getProfileTutorApiThunk());
    }, [dispatch]);
    return (_jsxs("div", { id: "tutor", children: [_jsx(SidebarTutor, {}), _jsx(HeaderTutor, {}), _jsx("main", { id: "tutor-main", children: _jsx(Outlet, {}) })] }));
};
export default TutorLayout;
