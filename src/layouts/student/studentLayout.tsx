import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { HeaderStudent } from "../../components/student/header";
import { FooterStudent } from "../../components/student/footer";

const StudentLayout: FC = () => {
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
