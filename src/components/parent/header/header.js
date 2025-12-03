import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeaderParentLogo from "./headerLogo";
import HeaderParentMenu from "./headerMenu";
import HeaderParentButton from "./headerButton";
const HeaderParent = () => {
    return (_jsx("header", { id: "header-parent", children: _jsx("section", { id: "hp-section", children: _jsxs("div", { className: "hps-container", children: [_jsx("div", { className: "hpscc1", children: _jsx(HeaderParentLogo, {}) }), _jsx("div", { className: "hpscc2", children: _jsx(HeaderParentMenu, {}) }), _jsx("div", { className: "hpscc3", children: _jsx(HeaderParentButton, {}) })] }) }) }));
};
export default HeaderParent;
