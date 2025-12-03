import type { FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const HeaderParentLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="hp-logo">
            <h2 className="hp-logo-text" onClick={() => navigateHook(routes.student.home)}>
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="hp-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default HeaderParentLogo;
