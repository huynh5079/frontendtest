import { useEffect, type FC } from "react";
import { Outlet } from "react-router-dom";
import { HeaderTutor } from "../../components/tutor/header";
import { SidebarTutor } from "../../components/tutor/sidebar";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { getProfileTutorApiThunk } from "../../services/user/userThunk";
import { selectUserLogin } from "../../app/selector";
import { USER_TUTOR } from "../../utils/helper";

const TutorLayout: FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserLogin);

    useEffect(() => {
        // Chỉ gọi API khi user thực sự là tutor
        if (user?.role === USER_TUTOR) {
            dispatch(getProfileTutorApiThunk()).catch((error) => {
                // Bỏ qua lỗi 403 nếu user không phải tutor
                console.warn("Failed to load tutor profile:", error);
            });
        }
    }, [dispatch, user?.role]);

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
