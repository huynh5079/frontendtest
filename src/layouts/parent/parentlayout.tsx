import type { FC } from "react";
import { Outlet } from "react-router-dom";
import HeaderParent from "../../components/parent/header/header";
import { FooterParent } from "../../components/parent/footer";

const ParentLayout: FC = () => {
    return (
        <div id="parent">
            <HeaderParent />
            <main className="parent-main">
                <Outlet />
            </main>
            <FooterParent />
        </div>
    );
};

export default ParentLayout;
