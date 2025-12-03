import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../utils/helper";
const StudentInformtionSidebar = ({ activeTab }) => {
    const navigate = useNavigate();
    const handleClick = (tab) => {
        navigate(`?tab=${tab}`);
    };
    return (_jsx("div", { className: "student-informtion-sidebar", children: _jsxs("ul", { children: [_jsx("li", { className: activeTab === "profile" ? "actived" : "", onClick: () => handleClick("profile"), children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), _jsx("li", { className: activeTab === "change-password" ? "actived" : "", onClick: () => handleClick("change-password"), children: "\u0110\u1ED5i m\u1EADt kh\u1EA9u" }), _jsx("li", { className: activeTab === "wallet" ? "actived" : "", onClick: () => handleClick("wallet"), children: "V\u00ED c\u1EE7a t\u00F4i" }), _jsx("li", { className: activeTab === "schedule" ? "actived" : "", onClick: () => handleClick("schedule"), children: "L\u1ECBch h\u1ECDc" }), _jsx("li", { className: activeTab === "booking_tutor" ? "actived" : "", onClick: () => handleClick("booking_tutor"), children: "L\u1ECBch \u0111\u1EB7t gia s\u01B0" }), _jsx("li", { className: activeTab === "assigned_class" ? "actived" : "", onClick: () => handleClick("assigned_class"), children: "L\u1EDBp h\u1ECDc \u0111\u00E3 \u0111\u0103ng k\u00FD" }), _jsx("li", { className: activeTab === "report" ? "actived" : "", onClick: () => handleClick("report"), children: "Th\u1ED1ng k\u00EA h\u1ECDc t\u1EADp" }), _jsx("li", { className: activeTab === "request" ? "actived" : "", onClick: () => handleClick("request"), children: "Y\u00EAu c\u1EA7u t\u00ECm gia s\u01B0" }), _jsx("li", { onClick: logout, children: "\u0110\u0103ng xu\u1EA5t" })] }) }));
};
export default StudentInformtionSidebar;
