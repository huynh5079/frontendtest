import { useEffect, type FC } from "react";
import { Outlet } from "react-router-dom";
import { HeaderStudent } from "../../components/student/header";
import { FooterStudent } from "../../components/student/footer";
import { useAppDispatch } from "../../app/store";
import { getProfileStudentApiThunk } from "../../services/user/userThunk";

const StudentLayout: FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getProfileStudentApiThunk());
    }, [dispatch]);

    return (
        <div id="student">
            <HeaderStudent />
            <main className="student-main">
                <Outlet />
            </main>
            <FooterStudent />
        </div>
    );
};

export default StudentLayout;
