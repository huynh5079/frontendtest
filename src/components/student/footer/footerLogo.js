import { jsx as _jsx } from "react/jsx-runtime";
const FooterStudentLogo = () => {
    const text = "TPEDU";
    return (_jsx("div", { className: "fs-logo", children: _jsx("h2", { className: "fs-logo-text", children: text.split("").map((char, index) => (_jsx("span", { className: "fs-logo-char", style: { animationDelay: `${index * 0.1}s` }, children: char }, index))) }) }));
};
export default FooterStudentLogo;
