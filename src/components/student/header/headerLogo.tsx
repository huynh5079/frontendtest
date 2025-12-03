import type { FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const HeaderStudentLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="hs-logo">
            <h2 className="hs-logo-text" onClick={() => navigateHook(routes.student.home)}>
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="hs-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default HeaderStudentLogo;
