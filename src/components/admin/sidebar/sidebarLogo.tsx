import type { FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const AdminSidebarLogo: FC = () => {
    const text = "TPEDU";

    return (
        <div className="as-logo">
            <h2 className="as-logo-text" onClick={() => navigateHook(routes.student.home)}>
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="as-logo-char"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
            </h2>
        </div>
    );
};

export default AdminSidebarLogo;
