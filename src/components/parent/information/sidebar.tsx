import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../utils/helper";

interface Props {
    activeTab: string;
}

const ParentInformtionSidebar: FC<Props> = ({ activeTab }) => {
    const navigate = useNavigate();

    const handleClick = (tab: string) => {
        navigate(`?tab=${tab}`);
    };

    return (
        <div className="parent-informtion-sidebar">
            <ul>
                <li
                    className={activeTab === "profile" ? "actived" : ""}
                    onClick={() => handleClick("profile")}
                >
                    Thông tin cá nhân
                </li>
                <li
                    className={activeTab === "change-password" ? "actived" : ""}
                    onClick={() => handleClick("change-password")}
                >
                    Đổi mật khẩu
                </li>
                <li
                    className={activeTab === "child-account" ? "actived" : ""}
                    onClick={() => handleClick("child-account")}
                >
                    Tài khoản của con
                </li>
                <li
                    className={activeTab === "wallet" ? "actived" : ""}
                    onClick={() => handleClick("wallet")}
                >
                    Ví của tôi
                </li>
                <li
                    className={activeTab === "schedule" ? "actived" : ""}
                    onClick={() => handleClick("schedule")}
                >
                    Lịch học của con
                </li>
                <li
                    className={activeTab === "booking_tutor" ? "actived" : ""}
                    onClick={() => handleClick("booking_tutor")}
                >
                    Lịch đặt gia sư
                </li>
                <li
                    className={activeTab === "report" ? "actived" : ""}
                    onClick={() => handleClick("report")}
                >
                    Thống kê học tập
                </li>
                <li
                    className={activeTab === "request" ? "actived" : ""}
                    onClick={() => handleClick("request")}
                >
                    Yêu cầu tìm gia sư
                </li>
                <li onClick={logout}>Đăng xuất</li>
            </ul>
        </div>
    );
};

export default ParentInformtionSidebar;
