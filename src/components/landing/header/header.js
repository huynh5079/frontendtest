import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeaderLandingLogo from "./headerLogo";
import HeaderLandingMenu from "./headerMenu";
import HeaderLandingButton from "./headerButton";
const headerLanding = () => {
    return (_jsx("header", { id: "header-landing", children: _jsx("section", { id: "hl-section", children: _jsxs("div", { className: "hls-container", children: [_jsx("div", { className: "hlscc1", children: _jsx(HeaderLandingLogo, {}) }), _jsx("div", { className: "hlscc2", children: _jsx(HeaderLandingMenu, {}) }), _jsx("div", { className: "hlscc3", children: _jsx(HeaderLandingButton, {}) })] }) }) }));
};
export default headerLanding;
