import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { HeaderLanding } from "../../components/landing/header";
import { Outlet } from "react-router-dom";
import { FooterLanding } from "../../components/landing/footer";
const LandingLayout = () => {
    return (_jsxs(_Fragment, { children: [_jsx(HeaderLanding, {}), _jsx("main", { id: "landing", children: _jsx(Outlet, {}) }), _jsx(FooterLanding, {})] }));
};
export default LandingLayout;
