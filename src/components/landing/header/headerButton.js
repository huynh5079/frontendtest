import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const HeaderLandingButton = () => {
    return (_jsxs("div", { className: "hl-button", children: [_jsx("button", { className: "pr-btn hl-login-btn", onClick: () => navigateHook(routes.login), children: "\u0110a\u0306ng nha\u0323\u0302p" }), _jsx("button", { className: "sc-btn hl-reg-btn", onClick: () => navigateHook(routes.register.general), children: "\u0110a\u0306ng ky\u0301" })] }));
};
export default HeaderLandingButton;
