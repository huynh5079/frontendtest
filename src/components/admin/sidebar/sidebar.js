import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../../routes/routeName";
import classNames from "classnames";
import { MdAssessment, MdClass, MdDashboard, MdFamilyRestroom, MdNotifications, MdSchool, } from "react-icons/md";
import AdminSidebarLogo from "./sidebarLogo";
import { FaChalkboardTeacher } from "react-icons/fa";
import { logout } from "../../../utils/helper";
import { BiLogOut } from "react-icons/bi";
const SidebarAdmin = () => {
    const location = useLocation();
    const navItems = [
        {
            section: "Trang tổng quát",
            links: [
                {
                    to: routes.admin.dashboard,
                    icon: MdDashboard,
                    label: "Trang tổng quan",
                },
            ],
        },
        {
            section: "Người dùng",
            links: [
                {
                    to: routes.admin.student.list,
                    icon: MdSchool,
                    label: "Học viên",
                },
                {
                    to: routes.admin.parent.list,
                    icon: MdFamilyRestroom,
                    label: "Phụ huynh",
                },
                {
                    to: routes.admin.tutor.list,
                    icon: FaChalkboardTeacher,
                    label: "Gia sư",
                },
            ],
        },
        {
            section: "Quản lý",
            links: [
                {
                    to: routes.admin.class.list,
                    icon: MdClass,
                    label: "Lớp học",
                },
                {
                    to: routes.admin.notification.list,
                    icon: MdNotifications,
                    label: "Thông báo",
                },
                {
                    to: routes.admin.report.list,
                    icon: MdAssessment,
                    label: "Báo cáo và khiếu nại",
                },
            ],
        },
        {
            section: "Giao dịch",
            links: [
                {
                    to: routes.admin.transaction.tutor.list,
                    icon: MdNotifications,
                    label: "Gia sư",
                },
                {
                    to: routes.admin.transaction.student.list,
                    icon: MdClass,
                    label: "Học viên",
                },
                {
                    to: routes.admin.transaction.parent.list,
                    icon: MdClass,
                    label: "Phụ huynh",
                },
            ],
        },
    ];
    const isActive = (path) => location.pathname.startsWith(path);
    return (_jsx("nav", { id: "admin-sidebar", children: _jsxs("div", { className: "as-container", children: [_jsx("div", { className: "ascr1", children: _jsx(AdminSidebarLogo, {}) }), _jsxs("div", { className: "ascr2", children: [navItems.map((section, i) => (_jsxs("div", { children: [_jsx("h4", { children: section.section }), section.links.map(({ to, icon: Icon, label }) => (_jsx(Link, { to: to, className: classNames("ascr2-nav-item", {
                                        "nav-active": isActive(to),
                                    }), children: _jsxs("div", { className: "ascr2-nav-link", children: [_jsx(Icon, { className: "ascr2-nav-icon" }), _jsx("span", { children: label })] }) }, to)))] }, i))), _jsx("h4", { children: "C\u00E0i \u0110\u1EB7t" }), _jsx("div", { onClick: logout, className: "ascr2-nav-item", children: _jsxs("div", { className: "ascr2-nav-link", children: [_jsx(BiLogOut, { className: "ascr2-nav-icon" }), _jsx("span", { children: "\u0110\u0103ng xu\u1EA5t" })] }) })] })] }) }));
};
export default SidebarAdmin;
