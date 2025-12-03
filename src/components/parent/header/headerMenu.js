import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
const HeaderParentMenu = () => {
    const location = useLocation();
    const headerData = [
        { id: 1, title: "Trang chủ", href: "/parent" },
        { id: 2, title: "Gia sư", href: "/parent/tutor" },
        { id: 3, title: "Lớp học", href: "/parent/course" },
        { id: 4, title: "Liên hệ", href: "/parent/contact" },
        { id: 5, title: "Về chúng tôi", href: "/parent/about" },
    ];
    const isActive = (href) => {
        if (href === "/parent") {
            return location.pathname === "/parent";
        }
        return location.pathname.startsWith(href);
    };
    return (_jsx("div", { className: "hp-menu", children: headerData.map((item) => (_jsxs(Link, { to: item.href, className: `hp-link ${isActive(item.href) ? "active" : ""}`, children: [item.title, _jsx("span", { className: `underline left ${isActive(item.href) ? "full" : ""}` }), _jsx("span", { className: `underline right ${isActive(item.href) ? "full" : ""}` })] }, item.id))) }));
};
export default HeaderParentMenu;
