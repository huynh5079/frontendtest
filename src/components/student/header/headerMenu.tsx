import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderStudentMenu: FC = () => {
    const location = useLocation();

    const headerData = [
        { id: 1, title: "Trang chủ", href: "/student" },
        { id: 2, title: "Gia sư", href: "/student/tutor" },
        { id: 3, title: "Lớp học", href: "/student/course" },
        { id: 4, title: "Liên hệ", href: "/student/contact" },
        { id: 5, title: "Về chúng tôi", href: "/student/about" },
    ];

    const isActive = (href: string) => {
        if (href === "/student") {
            return location.pathname === "/student";
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="hs-menu">
            {headerData.map((item) => (
                <Link
                    key={item.id}
                    to={item.href}
                    className={`hs-link ${isActive(item.href) ? "active" : ""}`}
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

export default HeaderStudentMenu;
