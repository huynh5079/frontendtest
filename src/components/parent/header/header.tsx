import type { FC } from "react";
import HeaderParentLogo from "./headerLogo";
import HeaderParentMenu from "./headerMenu";
import HeaderParentButton from "./headerButton";

const HeaderParent: FC = () => {
    return (
        <header id="header-parent">
            <section id="hp-section">
                <div className="hps-container">
                    <div className="hpscc1">
                        <HeaderParentLogo />
                    </div>
                    <div className="hpscc2">
                        <HeaderParentMenu />
                    </div>
                    <div className="hpscc3">
                        <HeaderParentButton />
                    </div>
                </div>
            </section>
        </header>
    );
};

export default HeaderParent;
