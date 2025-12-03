import type { FC } from "react";
import FooterParentTop from "./footerTop";
import FooterParentSocialMedia from "./footerSocialMedia";
import FooterParentLogo from "./footerLogo";

const quickLinksData = [
    { title: "Trang chủ", href: "/parent/" },
    { title: "Gia sư", href: "/parent/tutor" },
    { title: "Khoá học", href: "/parent/corse" },
    { title: "Liên hệ", href: "/parent/contact" },
    { title: "Về chúng tôi", href: "/parent/about" },
];

const FooterParent: FC = () => {
    return (
        <footer id="footer-parent">
            <section id="fp-section">
                <div className="fps-container">
                    <div className="fpscr1">
                        <FooterParentTop />
                    </div>
                    <div className="fpscr2">
                        <div className="fpscr2c1 fp-col">
                            <FooterParentLogo />
                            <p>
                                Nền tảng kết nối gia sư và học viên, giúp việc
                                học trở nên dễ dàng và hiệu quả hơn.
                            </p>
                            <FooterParentSocialMedia />
                        </div>
                        <div className="fpscr2c2 fp-col">
                            <h4>Liên kết nhanh</h4>
                            <ul className="fp-links">
                                {quickLinksData.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.href} className="fp-link">
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="fpscr2c3 fp-col">
                            <h4>Nhận tin mới nhất</h4>
                            <p>
                                Đăng ký nhận bản tin của chúng tôi để nhận thông
                                tin cập nhật và ưu đãi độc quyền
                            </p>
                            <form className="fp-form">
                                <input
                                    className="fp-input"
                                    placeholder="Nhập email của bạn"
                                    type="email"
                                    required
                                />
                                <button className="pr-btn fp-btn">
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="fpscr3">
                        <div>
                            &copy; {new Date().getFullYear()}{" "}
                            <FooterParentLogo />. Mọi quyền được bảo lưu
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default FooterParent;
