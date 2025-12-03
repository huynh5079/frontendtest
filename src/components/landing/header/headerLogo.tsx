import type { FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const HeaderLandingLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="hl-logo">
            <h2 className="hl-logo-text" onClick={() => navigateHook(routes.home)}>
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="hl-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default HeaderLandingLogo;
