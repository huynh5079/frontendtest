import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FooterParentTop from "./footerTop";
import FooterParentSocialMedia from "./footerSocialMedia";
import FooterParentLogo from "./footerLogo";
const quickLinksData = [
    { title: "Trang chủ", href: "/parent/" },
    { title: "Gia sư", href: "/parent/tutor" },
    { title: "Khoá học", href: "/parent/corse" },
    { title: "Liên hệ", href: "/parent/contact" },
    { title: "Về chúng tôi", href: "/parent/about" },
];
const FooterParent = () => {
    return (_jsx("footer", { id: "footer-parent", children: _jsx("section", { id: "fp-section", children: _jsxs("div", { className: "fps-container", children: [_jsx("div", { className: "fpscr1", children: _jsx(FooterParentTop, {}) }), _jsxs("div", { className: "fpscr2", children: [_jsxs("div", { className: "fpscr2c1 fp-col", children: [_jsx(FooterParentLogo, {}), _jsx("p", { children: "N\u1EC1n t\u1EA3ng k\u1EBFt n\u1ED1i gia s\u01B0 v\u00E0 h\u1ECDc vi\u00EAn, gi\u00FAp vi\u1EC7c h\u1ECDc tr\u1EDF n\u00EAn d\u1EC5 d\u00E0ng v\u00E0 hi\u1EC7u qu\u1EA3 h\u01A1n." }), _jsx(FooterParentSocialMedia, {})] }), _jsxs("div", { className: "fpscr2c2 fp-col", children: [_jsx("h4", { children: "Li\u00EAn k\u1EBFt nhanh" }), _jsx("ul", { className: "fp-links", children: quickLinksData.map((item, index) => (_jsx("li", { children: _jsx("a", { href: item.href, className: "fp-link", children: item.title }) }, index))) })] }), _jsxs("div", { className: "fpscr2c3 fp-col", children: [_jsx("h4", { children: "Nh\u1EADn tin m\u1EDBi nh\u1EA5t" }), _jsx("p", { children: "\u0110\u0103ng k\u00FD nh\u1EADn b\u1EA3n tin c\u1EE7a ch\u00FAng t\u00F4i \u0111\u1EC3 nh\u1EADn th\u00F4ng tin c\u1EADp nh\u1EADt v\u00E0 \u01B0u \u0111\u00E3i \u0111\u1ED9c quy\u1EC1n" }), _jsxs("form", { className: "fp-form", children: [_jsx("input", { className: "fp-input", placeholder: "Nh\u1EADp email c\u1EE7a b\u1EA1n", type: "email", required: true }), _jsx("button", { className: "pr-btn fp-btn", children: "\u0110\u0103ng k\u00FD" })] })] })] }), _jsx("div", { className: "fpscr3", children: _jsxs("div", { children: ["\u00A9 ", new Date().getFullYear(), " ", _jsx(FooterParentLogo, {}), ". M\u1ECDi quy\u1EC1n \u0111\u01B0\u1EE3c b\u1EA3o l\u01B0u"] }) })] }) }) }));
};
export default FooterParent;
