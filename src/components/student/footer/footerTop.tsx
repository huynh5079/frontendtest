import type { FC } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from "react-icons/fa";

const data = [
    {
        title: "Địa chỉ",
        subtitle: "Ngũ Hành Sơn, Đà Nẵng",
        icon: <FaMapMarkerAlt className="icon" />,
    },
    {
        title: "Gọi cho chúng tôi",
        subtitle: "+84 898 530 964",
        icon: <FaPhoneAlt className="icon" />,
    },
    {
        title: "Giờ làm việc",
        subtitle: "Thứ 2 - Thứ 7: 10:00 - 19:00",
        icon: <FaClock className="icon" />,
    },
    {
        title: "Email",
        subtitle: "tuanpcl7103@gmail.com",
        icon: <FaEnvelope className="icon" />,
    },
];

const FooterStudentTop: FC = () => {
    return (
        <div className="fs-top">
            {data.map((item, index) => (
                <div key={index} className="fs-item">
                    {item.icon}
                    <div className="fs-text">
                        <h3>{item.title}</h3>
                        <p>{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FooterStudentTop;
