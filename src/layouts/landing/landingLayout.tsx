import type { FC } from "react";
import { HeaderLanding } from "../../components/landing/header";
import { Outlet } from "react-router-dom";
import { FooterLanding } from "../../components/landing/footer";

const LandingLayout: FC = () => {
    return (
        <>
            <HeaderLanding />
            <main id="landing">
                <Outlet />
            </main>
            <FooterLanding />
        </>
    );
};

export default LandingLayout;
