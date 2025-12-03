import { useEffect, type FC } from "react";
import { Outlet } from "react-router-dom";
import { HeaderTutor } from "../../components/tutor/header";
import { SidebarTutor } from "../../components/tutor/sidebar";
import { useAppDispatch } from "../../app/store";
import { getProfileTutorApiThunk } from "../../services/user/userThunk";

const TutorLayout: FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getProfileTutorApiThunk());
    }, [dispatch]);

    return (
        <div id="tutor">
            <SidebarTutor />
            <HeaderTutor />
            <main id="tutor-main">
                <Outlet />
            </main>
        </div>
    );
};

export default TutorLayout;
