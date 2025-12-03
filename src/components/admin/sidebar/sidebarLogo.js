import { jsx as _jsx } from "react/jsx-runtime";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const AdminSidebarLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "as-logo", children: _jsx("h2", { className: "as-logo-text", onClick: () => navigateHook(routes.student.home), children: text.split("").map((char, index) => (_jsx("span", { className: "as-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default AdminSidebarLogo;
