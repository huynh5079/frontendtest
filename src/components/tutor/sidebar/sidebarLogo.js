import { jsx as _jsx } from "react/jsx-runtime";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const TutorSidebarLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "ts-logo", children: _jsx("h2", { className: "ts-logo-text", onClick: () => navigateHook(routes.student.home), children: text.split("").map((char, index) => (_jsx("span", { className: "ts-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default TutorSidebarLogo;
