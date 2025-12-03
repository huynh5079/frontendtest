import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderParentMenu: FC = () => {
    const location = useLocation();

    const headerData = [
        { id: 1, title: "Trang chủ", href: "/parent" },
        { id: 2, title: "Gia sư", href: "/parent/tutor" },
        { id: 3, title: "Lớp học", href: "/parent/course" },
        { id: 4, title: "Liên hệ", href: "/parent/contact" },
        { id: 5, title: "Về chúng tôi", href: "/parent/about" },
    ];

    const isActive = (href: string) => {
        if (href === "/parent") {
            return location.pathname === "/parent";
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="hp-menu">
            {headerData.map((item) => (
                <Link
                    key={item.id}
                    to={item.href}
                    className={`hp-link ${isActive(item.href) ? "active" : ""}`}
                >
                    {item.title}
                    <span
                        className={`underline left ${
                            isActive(item.href) ? "full" : ""
                        }`}
                    />
                    <span
                        className={`underline right ${
                            isActive(item.href) ? "full" : ""
                        }`}
                    />
                </Link>
            ))}
        </div>
    );
};

export default HeaderParentMenu;
