import type { FC } from "react";
import FooterLandingTop from "./footerTop";
import FooterLandingSocialMedia from "./footerSocialMedia";
import FooterLandingLogo from "./footerLogo";

const quickLinksData = [
    { title: "Trang chủ", href: "/" },
    { title: "Gia sư", href: "/tutor" },
    { title: "Khoá học", href: "/corse" },
    { title: "Liên hệ", href: "/contact" },
    { title: "Về chúng tôi", href: "/about" },
];

const FooterLanding: FC = () => {
    return (
        <footer id="footer-landing">
            <section id="fl-section">
                <div className="fls-container">
                    <div className="flscr1">
                        <FooterLandingTop />
                    </div>
                    <div className="flscr2">
                        <div className="flscr2c1 fl-col">
                            <FooterLandingLogo />
                            <p>
                                Nền tảng kết nối gia sư và học viên, giúp việc
                                học trở nên dễ dàng và hiệu quả hơn.
                            </p>
                            <FooterLandingSocialMedia />
                        </div>
                        <div className="flscr2c2 fl-col">
                            <h4>Liên kết nhanh</h4>
                            <ul className="fl-links">
                                {quickLinksData.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.href} className="fl-link">
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flscr2c3 fl-col">
                            <h4>Nhận tin mới nhất</h4>
                            <p>
                                Đăng ký nhận bản tin của chúng tôi để nhận thông
                                tin cập nhật và ưu đãi độc quyền
                            </p>
                            <form className="fl-form">
                                <input
                                    className="fl-input"
                                    placeholder="Nhập email của bạn"
                                    type="email"
                                    required
                                />
                                <button className="pr-btn fl-btn">
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="flscr3">
                        <div>
                            &copy; {new Date().getFullYear()}{" "}
                            <FooterLandingLogo />. Mọi quyền được bảo lưu
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default FooterLanding;
