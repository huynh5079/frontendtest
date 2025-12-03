import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LandingBannerImage } from "../../assets/images";
import { navigateHook } from "../../routes/routeApp";
import { routes } from "../../routes/routeName";
import { selectIsAuthenticated, selectUserLogin } from "../../app/selector";
import { useAppSelector } from "../../app/store";
import { USER_PARENT, USER_STUDENT } from "../../utils/helper";
const LandingBanner = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    const handle = () => {
        if (!isAuthenticated)
            return navigateHook(routes.register.student);
        if (user?.role === USER_PARENT)
            return navigateHook(routes.parent.tutor.list);
        if (user?.role === USER_STUDENT)
            return navigateHook(routes.student.tutor.list);
    };
    return (_jsxs("div", { className: "landing-banner", children: [_jsxs("div", { className: "lb-content", children: [_jsx("div", { className: "lbcr1", children: _jsxs("h2", { children: ["K\u1EBFt N\u1ED1i Gia S\u01B0 & H\u1ECDc Vi\u00EAn", _jsx("br", {}), "Nhanh Ch\u00F3ng - Hi\u1EC7u Qu\u1EA3"] }) }), _jsxs("div", { className: "lbcr2", children: [_jsx("button", { className: "pr-btn lb-button", onClick: handle, children: "T\u00ECm gia s\u01B0 ngay" }), !isAuthenticated && (_jsx("button", { className: "sc-btn lb-button", onClick: () => navigateHook(routes.register.tutor), children: "Tr\u1EDF th\u00E0nh gia s\u01B0" }))] })] }), _jsx("div", { className: "lb-image", children: _jsx("img", { src: LandingBannerImage, alt: "banner_1" }) })] }));
};
export default LandingBanner;
