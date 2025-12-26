import { useState, type FC } from "react";
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
import { Modal } from "../../modal";
import { RemindLogin } from "../../../assets/images";
import { navigateHook } from "../../../routes/routeApp";
import { useAppSelector } from "../../../app/store";
import { selectProfileTutor } from "../../../app/selector";

const SidebarTutor: FC = () => {
    const location = useLocation();
    const [isRemindOpen, setIsRemindOpen] = useState(false);
    const tutor = useAppSelector(selectProfileTutor);

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
                    label: "Lịch cá nhân",
                },
                {
                    to: routes.tutor.study_schedule,
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
                    to: routes.tutor.reschedule.list,
                    icon: AiFillSchedule,
                    label: "Đơn dời lịch dạy",
                },
                {
                    to: routes.tutor.class.list,
                    icon: MdClass,
                    label: "Lớp học",
                },
                {
                    to: routes.tutor.notification.list,
                    icon: MdClass,
                    label: "Thông báo",
                },
                {
                    to: routes.tutor.chat,
                    icon: MdClass,
                    label: "Tin nhắn",
                },
            ],
        },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    // 🔥 HÀM CHẶN TRUY CẬP KHI CHƯA ĐƯỢC DUYỆT
    const handleProtectedClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        to: string
    ) => {
        if (tutor?.reviewStatus !== "Approved") {
            e.preventDefault(); // chặn bấm
            setIsRemindOpen(true); // mở modal nhắc nhở
        }
    };

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

                            {section.links.map(({ to, icon: Icon, label }) => {
                                const isManagementSection =
                                    section.section === "Quản lý";

                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={(e) =>
                                            isManagementSection
                                                ? handleProtectedClick(e, to)
                                                : undefined
                                        }
                                        className={classNames(
                                            "tscr2-nav-item",
                                            {
                                                "nav-active": isActive(to),
                                            }
                                        )}
                                    >
                                        <div className="tscr2-nav-link">
                                            <Icon className="tscr2-nav-icon" />
                                            <span>{label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}

                    {/* LOGOUT */}
                    <h4>Cài Đặt</h4>
                    <div onClick={logout} className="tscr2-nav-item">
                        <div className="tscr2-nav-link">
                            <BiLogOut className="tscr2-nav-icon" />
                            <span>Đăng xuất</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL NHẮC NHỞ */}
            <Modal
                isOpen={isRemindOpen}
                setIsOpen={setIsRemindOpen}
                title="Thông báo"
            >
                <section id="remind-login-modal">
                    <div className="rlm-container">
                        <img src={RemindLogin} alt="" />
                        <h3>
                            Bạn cần được phê duyệt trước khi sử dụng chức năng
                            này
                        </h3>
                        <h4>Hãy chờ hoặc hoàn thiện hồ sơ để được xét duyệt</h4>

                        <button
                            onClick={() => {
                                navigateHook(routes.tutor.information);
                                setIsRemindOpen(false);
                            }}
                            className="sc-btn"
                        >
                            Đi đến trang cá nhân
                        </button>

                        <p onClick={() => setIsRemindOpen(false)}>Để sau</p>
                    </div>
                </section>
            </Modal>
        </nav>
    );
};

export default SidebarTutor;
