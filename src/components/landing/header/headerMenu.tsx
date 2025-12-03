import type { FC } from "react"
import { Link, useLocation } from "react-router-dom";

const HeaderLandingMenu: FC = () => {
    const location = useLocation();

    const headerData = [
        { id: 1, title: "Trang chủ", href: "/" },
        { id: 2, title: "Gia sư", href: "/tutor" },
        { id: 3, title: "Lớp học", href: "/course" },
        { id: 4, title: "Liên hệ", href: "/contact" },
        { id: 5, title: "Về chúng tôi", href: "/about" },
    ];

    const isActive = (href: string) => {
        if (href === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="hl-menu">
            {headerData.map((item) => (
                <Link
                    key={item.id}
                    to={item.href}
                    className={`hl-link ${isActive(item.href) ? "active" : ""}`}
                >
                    {item.title}
                    <span className={`underline left ${isActive(item.href) ? "full" : ""}`} />
                    <span className={`underline right ${isActive(item.href) ? "full" : ""}`} />
                </Link>
            ))}
        </div>
    );
}

export default HeaderLandingMenu;
