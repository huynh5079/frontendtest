import { jsx as _jsx } from "react/jsx-runtime";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const HeaderLandingLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "hl-logo", children: _jsx("h2", { className: "hl-logo-text", onClick: () => navigateHook(routes.home), children: text.split("").map((char, index) => (_jsx("span", { className: "hl-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default HeaderLandingLogo;
