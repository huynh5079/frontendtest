import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeaderStudentLogo from "./headerLogo";
import HeaderStudentMenu from "./headerMenu";
import HeaderStudentButton from "./headerButton";
const HeaderStudent = () => {
    return (_jsx("header", { id: "header-student", children: _jsx("section", { id: "hs-section", children: _jsxs("div", { className: "hss-container", children: [_jsx("div", { className: "hsscc1", children: _jsx(HeaderStudentLogo, {}) }), _jsx("div", { className: "hsscc2", children: _jsx(HeaderStudentMenu, {}) }), _jsx("div", { className: "hsscc3", children: _jsx(HeaderStudentButton, {}) })] }) }) }));
};
export default HeaderStudent;
