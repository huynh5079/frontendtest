import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
const HeaderStudentMenu = () => {
    const location = useLocation();
    const headerData = [
        { id: 1, title: "Trang chủ", href: "/student" },
        { id: 2, title: "Gia sư", href: "/student/tutor" },
        { id: 3, title: "Lớp học", href: "/student/course" },
        { id: 4, title: "Liên hệ", href: "/student/contact" },
        { id: 5, title: "Về chúng tôi", href: "/student/about" },
    ];
    const isActive = (href) => {
        if (href === "/student") {
            return location.pathname === "/student";
        }
        return location.pathname.startsWith(href);
    };
    return (_jsx("div", { className: "hs-menu", children: headerData.map((item) => (_jsxs(Link, { to: item.href, className: `hs-link ${isActive(item.href) ? "active" : ""}`, children: [item.title, _jsx("span", { className: `underline left ${isActive(item.href) ? "full" : ""}` }), _jsx("span", { className: `underline right ${isActive(item.href) ? "full" : ""}` })] }, item.id))) }));
};
export default HeaderStudentMenu;
