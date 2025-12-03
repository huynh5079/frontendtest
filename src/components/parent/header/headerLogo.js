import { jsx as _jsx } from "react/jsx-runtime";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const HeaderParentLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "hp-logo", children: _jsx("h2", { className: "hp-logo-text", onClick: () => navigateHook(routes.student.home), children: text.split("").map((char, index) => (_jsx("span", { className: "hp-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default HeaderParentLogo;
