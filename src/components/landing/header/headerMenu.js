import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
const HeaderLandingMenu = () => {
    const location = useLocation();
    const headerData = [
        { id: 1, title: "Trang chủ", href: "/" },
        { id: 2, title: "Gia sư", href: "/tutor" },
        { id: 3, title: "Lớp học", href: "/course" },
        { id: 4, title: "Liên hệ", href: "/contact" },
        { id: 5, title: "Về chúng tôi", href: "/about" },
    ];
    const isActive = (href) => {
        if (href === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(href);
    };
    return (_jsx("div", { className: "hl-menu", children: headerData.map((item) => (_jsxs(Link, { to: item.href, className: `hl-link ${isActive(item.href) ? "active" : ""}`, children: [item.title, _jsx("span", { className: `underline left ${isActive(item.href) ? "full" : ""}` }), _jsx("span", { className: `underline right ${isActive(item.href) ? "full" : ""}` })] }, item.id))) }));
};
export default HeaderLandingMenu;
