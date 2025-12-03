import { useEffect, type FC } from "react";
import { LandingBanner, LandingTopTutors } from "../../../components/landing";
import {
    FaSearch,
    FaBook,
    FaUserGraduate,
    FaLaptop,
    FaClock,
    FaLock,
} from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppSelector } from "../../../app/store";
import { selectIsAuthenticated, selectUserLogin } from "../../../app/selector";
import { USER_PARENT, USER_STUDENT } from "../../../utils/helper";

const LandingPage: FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);

    const handle = () => {
        if (!isAuthenticated) return navigateHook(routes.register.student);
        if (user?.role === USER_PARENT)
            return navigateHook(routes.parent.tutor.list);
        if (user?.role === USER_STUDENT)
            return navigateHook(routes.student.tutor.list);
    };

    // === EFFECTS ===
    useEffect(() => {
        document.title = "Trang chủ";
    }, []);

    return (
        <>
            <section id="landing-s1">
                <div className="ls1-container">
                    <LandingBanner />
                </div>
            </section>
            <section id="landing-s2">
                <div className="ls2-container">
                    <div className="ls2cr1">
                        <h3>Chỉ 3 Bước Đơn Giản Để Bắt Đầu</h3>
                    </div>
                    <div className="ls2cr2">
                        <div className="ls2cr2c1">
                            <h4>1. Tìm kiếm</h4>
                            <FaSearch className="icon" />
                            <p>Chọn môn học, địa điểm, hình thức học.</p>
                        </div>
                        <div className="ls2cr2c2">
                            <h4>2. Kết nối</h4>
                            <IoChatbubbleEllipsesOutline className="icon" />
                            <p>Gửi yêu cầu và trao đổi với gia sư.</p>
                        </div>
                        <div className="ls2cr2c3">
                            <h4>3. Bắt đầu học</h4>
                            <FaBook className="icon" />
                            <p>Thanh toán và bắt đầu buổi học ngay.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="landing-s3">
                <div className="ls3-container">
                    <div className="ls3cr1">
                        <h3>
                            Gia Sư Chất Lượng Cao, Được Học Viên Đánh Giá 5⭐
                        </h3>
                    </div>
                    <div className="ls3cr2">
                        <LandingTopTutors />
                    </div>
                </div>
            </section>
            <section id="landing-s4">
                <div className="ls4-container">
                    <div className="ls4cr1">
                        <h3>Tại Sao Chọn TPEDU?</h3>
                    </div>
                    <div className="ls4cr2">
                        <div className="ls4cr2-item">
                            <div className="ls4cr2-text">
                                <h4>Hơn 1.000 gia sư chất lượng</h4>
                                <p>
                                    Gia sư được tuyển chọn kỹ từ các trường và
                                    tổ chức uy tín, chuyên môn vững và tận tâm
                                    giảng dạy.
                                </p>
                            </div>
                            <FaUserGraduate className="ls4cr2-icon" />
                        </div>
                        <div className="ls4cr2-item">
                            <div className="ls4cr2-text">
                                <h4>Học trực tiếp hoặc trực tuyến</h4>
                                <p>
                                    Tùy chọn học tại nhà, quán cà phê hoặc
                                    online – tiện lợi ở mọi nơi.
                                </p>
                            </div>
                            <FaLaptop className="ls4cr2-icon" />
                        </div>
                        <div className="ls4cr2-item">
                            <div className="ls4cr2-text">
                                <h4>Lịch học linh hoạt</h4>
                                <p>
                                    Dễ dàng sắp xếp, thay đổi thời gian học phù
                                    hợp với lịch trình của bạn.
                                </p>
                            </div>
                            <FaClock className="ls4cr2-icon" />
                        </div>
                        <div className="ls4cr2-item">
                            <div className="ls4cr2-text">
                                <h4>An toàn & bảo mật</h4>
                                <p>
                                    Thanh toán bảo mật, thông tin cá nhân được
                                    bảo vệ tuyệt đối.
                                </p>
                            </div>
                            <FaLock className="ls4cr2-icon" />
                        </div>
                    </div>
                </div>
            </section>
            <section id="landing-s5">
                <div className="ls5-container">
                    <div className="ls5cr1">
                        <h3>Sẵn Sàng Bắt Đầu Hành Trình Học Tập Của Bạn?</h3>
                    </div>
                    <div className="ls5cr2">
                        <button
                            className="pr-btn ls5cr2-button"
                            onClick={handle}
                        >
                            Tìm gia sư ngay
                        </button>
                        {!isAuthenticated && (
                            <button
                                className="sc-btn ls5cr2-button"
                                onClick={() =>
                                    navigateHook(routes.register.tutor)
                                }
                            >
                                Trở thành gia sư
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage;
