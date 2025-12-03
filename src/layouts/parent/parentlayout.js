import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import HeaderParent from "../../components/parent/header/header";
import { FooterParent } from "../../components/parent/footer";
const ParentLayout = () => {
    return (_jsxs("div", { id: "parent", children: [_jsx(HeaderParent, {}), _jsx("main", { className: "parent-main", children: _jsx(Outlet, {}) }), _jsx(FooterParent, {})] }));
};
export default ParentLayout;
