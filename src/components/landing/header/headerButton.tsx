import type { FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

const HeaderLandingButton: FC = () => {
    return (
        <div className="hl-button">
            <button className="pr-btn hl-login-btn" onClick={() => navigateHook(routes.login)}>Đăng nhập</button>
            <button className="sc-btn hl-reg-btn" onClick={() => navigateHook(routes.register.general)}>Đăng ký</button>
        </div>
    );
};

export default HeaderLandingButton;
