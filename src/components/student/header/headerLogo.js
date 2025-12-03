import { jsx as _jsx } from "react/jsx-runtime";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const HeaderStudentLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "hs-logo", children: _jsx("h2", { className: "hs-logo-text", onClick: () => navigateHook(routes.student.home), children: text.split("").map((char, index) => (_jsx("span", { className: "hs-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default HeaderStudentLogo;
