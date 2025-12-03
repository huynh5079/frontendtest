import { jsx as _jsx } from "react/jsx-runtime";
const FooterLandingLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "fl-logo", children: _jsx("h2", { className: "fl-logo-text", children: text.split("").map((char, index) => (_jsx("span", { className: "fl-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default FooterLandingLogo;
