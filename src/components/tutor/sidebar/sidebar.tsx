import { type FC } from "react";
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

const SidebarTutor: FC = () => {
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

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav id="tutor-sidebar">
            <div className="ts-container">
                <div className="tscr1">
                    <TutorSidebarLogo />
                </div>
                <div className="tscr2">
                    {navItems.map((section, i) => (
                        <div key={i}>
                            <h4>{section.section}</h4>
                            {section.links.map(({ to, icon: Icon, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={classNames("tscr2-nav-item", {
                                        "nav-active": isActive(to),
                                    })}
                                >
                                    <div className="tscr2-nav-link">
                                        <Icon className="tscr2-nav-icon" />
                                        <span>{label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ))}
                    <h4>Cài Đặt</h4>
                    <div onClick={logout} className="tscr2-nav-item">
                        <div className="tscr2-nav-link">
                            <BiLogOut className="tscr2-nav-icon" />
                            <span>Đăng xuất</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarTutor;
