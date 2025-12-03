import { jsx as _jsx } from "react/jsx-runtime";
const FooterParentLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "fp-logo", children: _jsx("h2", { className: "fp-logo-text", children: text.split("").map((char, index) => (_jsx("span", { className: "fp-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default FooterParentLogo;
