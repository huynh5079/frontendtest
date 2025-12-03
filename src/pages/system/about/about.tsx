import type { FC } from "react";
import {
    FaBook,
    FaLock,
    FaRegClock,
    FaSearch,
    FaUserCheck,
    FaUsers,
} from "react-icons/fa";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useDocumentTitle } from "../../../utils/helper";

const AboutPage: FC = () => {
    useDocumentTitle("Về chúng tôi");

    return (
        <section id="about-section">
            <div className="as-container">
                <div className="ascr1">
                    <h2>Chúng Tôi Kết Nối Tri Thức – Tạo Dựng Tương Lai</h2>
                    <p>
                        Dự án ra đời với mục tiêu mang đến một nền tảng kết nối
                        học viên và gia sư nhanh chóng, tin cậy và chất lượng.
                        Chúng tôi tin rằng mỗi người đều xứng đáng có cơ hội học
                        tập tốt nhất.
                    </p>
                </div>
                <div className="ascr2">
                    <h2>Chỉ 3 Bước Đơn Giản Để Bắt Đầu</h2>
                    <div className="ascr2r2">
                        <div className="ascr2r2c1">
                            <h4>Tầm nhìn</h4>
                            <FaSearch className="icon" />
                            <p>
                                Trở thành nền tảng gia sư trực tuyến hàng đầu
                                tại Việt Nam, giúp hàng triệu người tiếp cận tri
                                thức mọi lúc, mọi nơi.
                            </p>
                        </div>
                        <div className="ascr2r2c2">
                            <h4>Sứ mệnh</h4>
                            <FaBook className="icon" />
                            <p>
                                Cung cấp dịch vụ kết nối học viên và gia sư một
                                cách minh bạch, nhanh chóng, đảm bảo chất lượng
                                và tối ưu trải nghiệm học tập.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="ascr3">
                    <h2>Giá trị cốt lõi</h2>
                    <div className="ascr3r2">
                        <div className="ascr3r2g1">
                            <FaUserCheck className="icon" />
                            <h3>Chất lượng</h3>
                            <p>Đảm bảo gia sư được kiểm duyệt nghiêm ngặt.</p>
                        </div>
                        <div className="ascr3r2g2">
                            <FaRegClock className="icon" />
                            <h3>Tiện lợi</h3>
                            <p>Học bất cứ khi nào, ở bất cứ đâu</p>
                        </div>
                        <div className="ascr3r2g3">
                            <FaLock className="icon" />
                            <h3>An Toàn</h3>
                            <p>Thanh toán và thông tin cá nhân được bảo mật.</p>
                        </div>
                        <div className="ascr3r2g4">
                            <FaUsers className="icon" />
                            <h3>Cộng Đồng</h3>
                            <p>
                                Tạo môi trường học tập tích cực, hỗ trợ lẫn
                                nhau.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="ascr4">
                    <h2>Sẵn Sàng Bắt Đầu Hành Trình Học Tập Của Bạn?</h2>
                    <div className="ascr4r2">
                        <button
                            className="pr-btn ascr4r2-button"
                            onClick={() =>
                                navigateHook(routes.register.student)
                            }
                        >
                            Tìm gia sư ngay
                        </button>
                        <button
                            className="sc-btn ascr4r2-button"
                            onClick={() => navigateHook(routes.register.tutor)}
                        >
                            Trở thành gia sư
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;
