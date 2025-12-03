import type { FC } from "react";
import FooterStudentTop from "./footerTop";
import FooterStudentSocialMedia from "./footerSocialMedia";
import FooterStudentLogo from "./footerLogo";

const quickLinksData = [
    { title: "Trang chủ", href: "/student/" },
    { title: "Gia sư", href: "/student/tutor" },
    { title: "Khoá học", href: "/student/corse" },
    { title: "Liên hệ", href: "/student/contact" },
    { title: "Về chúng tôi", href: "/student/about" },
];

const FooterStudent: FC = () => {
    return (
        <footer id="footer-student">
            <section id="fs-section">
                <div className="fss-container">
                    <div className="fsscr1">
                        <FooterStudentTop />
                    </div>
                    <div className="fsscr2">
                        <div className="fsscr2c1 fs-col">
                            <FooterStudentLogo />
                            <p>
                                Nền tảng kết nối gia sư và học viên, giúp việc
                                học trở nên dễ dàng và hiệu quả hơn.
                            </p>
                            <FooterStudentSocialMedia />
                        </div>
                        <div className="fsscr2c2 fs-col">
                            <h4>Liên kết nhanh</h4>
                            <ul className="fs-links">
                                {quickLinksData.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.href} className="fs-link">
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="fsscr2c3 fs-col">
                            <h4>Nhận tin mới nhất</h4>
                            <p>
                                Đăng ký nhận bản tin của chúng tôi để nhận thông
                                tin cập nhật và ưu đãi độc quyền
                            </p>
                            <form className="fs-form">
                                <input
                                    className="fs-input"
                                    placeholder="Nhập email của bạn"
                                    type="email"
                                    required
                                />
                                <button className="pr-btn fs-btn">
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="fsscr3">
                        <div>
                            &copy; {new Date().getFullYear()}{" "}
                            <FooterStudentLogo />. Mọi quyền được bảo lưu
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default FooterStudent;
