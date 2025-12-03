import type { FC } from "react";
import HeaderStudentLogo from "./headerLogo";
import HeaderStudentMenu from "./headerMenu";
import HeaderStudentButton from "./headerButton";

const HeaderStudent: FC = () => {
    return (
        <header id="header-student">
            <section id="hs-section">
                <div className="hss-container">
                    <div className="hsscc1">
                        <HeaderStudentLogo />
                    </div>
                    <div className="hsscc2">
                        <HeaderStudentMenu />
                    </div>
                    <div className="hsscc3">
                        <HeaderStudentButton />
                    </div>
                </div>
            </section>
        </header>
    );
};

export default HeaderStudent;
