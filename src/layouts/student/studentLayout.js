import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { HeaderStudent } from "../../components/student/header";
import { FooterStudent } from "../../components/student/footer";
const StudentLayout = () => {
    return (_jsxs("div", { id: "student", children: [_jsx(HeaderStudent, {}), _jsx("main", { className: "student-main", children: _jsx(Outlet, {}) }), _jsx(FooterStudent, {})] }));
};
export default StudentLayout;
