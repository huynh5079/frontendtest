import type { FC } from "react";
import { LandingBannerImage } from "../../assets/images";
import { navigateHook } from "../../routes/routeApp";
import { routes } from "../../routes/routeName";
import { selectIsAuthenticated, selectUserLogin } from "../../app/selector";
import { useAppSelector } from "../../app/store";
import { USER_PARENT, USER_STUDENT } from "../../utils/helper";

const LandingBanner: FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);

    const handle = () => {
        if (!isAuthenticated) return navigateHook(routes.register.student);
        if (user?.role === USER_PARENT)
            return navigateHook(routes.parent.tutor.list);
        if (user?.role === USER_STUDENT)
            return navigateHook(routes.student.tutor.list);
    };

    return (
        <div className="landing-banner">
            <div className="lb-content">
                <div className="lbcr1">
                    <h2>
                        Kết Nối Gia Sư & Học Viên
                        <br />
                        Nhanh Chóng - Hiệu Quả
                    </h2>
                </div>
                <div className="lbcr2">
                    <button className="pr-btn lb-button" onClick={handle}>
                        Tìm gia sư ngay
                    </button>
                    {!isAuthenticated && (
                        <button
                            className="sc-btn lb-button"
                            onClick={() => navigateHook(routes.register.tutor)}
                        >
                            Trở thành gia sư
                        </button>
                    )}
                </div>
            </div>
            <div className="lb-image">
                <img src={LandingBannerImage} alt="banner_1" />
            </div>
        </div>
    );
};

export default LandingBanner;
