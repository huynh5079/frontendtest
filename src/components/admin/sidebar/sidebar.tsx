import { type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../../routes/routeName";
import classNames from "classnames";
import {
    MdAssessment,
    MdClass,
    MdDashboard,
    MdFamilyRestroom,
    MdNotifications,
    MdSchool,
} from "react-icons/md";
import AdminSidebarLogo from "./sidebarLogo";
import { FaChalkboardTeacher } from "react-icons/fa";
import { logout } from "../../../utils/helper";
import { BiLogOut } from "react-icons/bi";

const SidebarAdmin: FC = () => {
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

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav id="admin-sidebar">
            <div className="as-container">
                <div className="ascr1">
                    <AdminSidebarLogo />
                </div>
                <div className="ascr2">
                    {navItems.map((section, i) => (
                        <div key={i}>
                            <h4>{section.section}</h4>
                            {section.links.map(({ to, icon: Icon, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={classNames("ascr2-nav-item", {
                                        "nav-active": isActive(to),
                                    })}
                                >
                                    <div className="ascr2-nav-link">
                                        <Icon className="ascr2-nav-icon" />
                                        <span>{label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ))}
                    <h4>Cài Đặt</h4>
                    <div onClick={logout} className="ascr2-nav-item">
                        <div className="ascr2-nav-link">
                            <BiLogOut className="ascr2-nav-icon" />
                            <span>Đăng xuất</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarAdmin;
