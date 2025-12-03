import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../../routes/routeName";
import classNames from "classnames";
import { MdClass, MdDashboard } from "react-icons/md";
import TutorSidebarLogo from "./sidebarLogo";
import { AiFillSchedule } from "react-icons/ai";
import { RiProfileFill } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { logout } from "../../../utils/helper";
import { BiLogOut } from "react-icons/bi";
const SidebarTutor = () => {
    const location = useLocation();
    const navItems = [
        {
            section: "Trang tổng quát",
            links: [
                {
                    to: routes.tutor.dashboard,
                    icon: MdDashboard,
                    label: "Trang tổng quan",
                },
            ],
        },
        {
            section: "Thông tin cá nhân",
            links: [
                {
                    to: routes.tutor.information,
                    icon: RiProfileFill,
                    label: "Trang cá nhân",
                },
                {
                    to: routes.tutor.wallet,
                    icon: FaWallet,
                    label: "Ví thanh toán",
                },
            ],
        },
        {
            section: "Quản lý",
            links: [
                {
                    to: routes.tutor.schedule,
                    icon: AiFillSchedule,
                    label: "Lịch dạy",
                },
                {
                    to: routes.tutor.booking.list,
                    icon: AiFillSchedule,
                    label: "Lịch đặt",
                },
                {
                    to: routes.tutor.request.list,
                    icon: AiFillSchedule,
                    label: "Đơn tìm gia sư",
                },
                {
                    to: routes.tutor.class.list,
                    icon: MdClass,
                    label: "Lớp học",
                },
            ],
        },
    ];
    const isActive = (path) => location.pathname.startsWith(path);
    return (_jsx("nav", { id: "tutor-sidebar", children: _jsxs("div", { className: "ts-container", children: [_jsx("div", { className: "tscr1", children: _jsx(TutorSidebarLogo, {}) }), _jsxs("div", { className: "tscr2", children: [navItems.map((section, i) => (_jsxs("div", { children: [_jsx("h4", { children: section.section }), section.links.map(({ to, icon: Icon, label }) => (_jsx(Link, { to: to, className: classNames("tscr2-nav-item", {
                                        "nav-active": isActive(to),
                                    }), children: _jsxs("div", { className: "tscr2-nav-link", children: [_jsx(Icon, { className: "tscr2-nav-icon" }), _jsx("span", { children: label })] }) }, to)))] }, i))), _jsx("h4", { children: "C\u00E0i \u0110\u1EB7t" }), _jsx("div", { onClick: logout, className: "tscr2-nav-item", children: _jsxs("div", { className: "tscr2-nav-link", children: [_jsx(BiLogOut, { className: "tscr2-nav-icon" }), _jsx("span", { children: "\u0110\u0103ng xu\u1EA5t" })] }) })] })] }) }));
};
export default SidebarTutor;
