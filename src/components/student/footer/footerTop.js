import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from "react-icons/fa";
const data = [
    {
        title: "Địa chỉ",
        subtitle: "Ngũ Hành Sơn, Đà Nẵng",
        icon: _jsx(FaMapMarkerAlt, { className: "icon" }),
    },
    {
        title: "Gọi cho chúng tôi",
        subtitle: "+84 898 530 964",
        icon: _jsx(FaPhoneAlt, { className: "icon" }),
    },
    {
        title: "Giờ làm việc",
        subtitle: "Thứ 2 - Thứ 7: 10:00 - 19:00",
        icon: _jsx(FaClock, { className: "icon" }),
    },
    {
        title: "Email",
        subtitle: "tuanpcl7103@gmail.com",
        icon: _jsx(FaEnvelope, { className: "icon" }),
    },
];
const FooterStudentTop = () => {
    return (_jsx("div", { className: "fs-top", children: data.map((item, index) => (_jsxs("div", { className: "fs-item", children: [item.icon, _jsxs("div", { className: "fs-text", children: [_jsx("h3", { children: item.title }), _jsx("p", { children: item.subtitle })] })] }, index))) }));
};
export default FooterStudentTop;
