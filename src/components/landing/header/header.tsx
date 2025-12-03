import type { FC } from "react";
import HeaderLandingLogo from "./headerLogo";
import HeaderLandingMenu from "./headerMenu";
import HeaderLandingButton from "./headerButton";

const headerLanding: FC = () => {
    return (
        <header id="header-landing">
            <section id="hl-section">
                <div className="hls-container">
                    <div className="hlscc1">
                        <HeaderLandingLogo />
                    </div>
                    <div className="hlscc2">
                        <HeaderLandingMenu />
                    </div>
                    <div className="hlscc3">
                        <HeaderLandingButton />
                    </div>
                </div>
            </section>
        </header>
    );
};

export default headerLanding;
