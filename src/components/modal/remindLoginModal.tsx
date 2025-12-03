import type { FC } from "react";
import type { RemindLoginModalProps } from "../../types/modal";
import Modal from "./modal";
import { RemindLogin } from "../../assets/images";
import { navigateHook } from "../../routes/routeApp";
import { routes } from "../../routes/routeName";

const RemindLoginModal: FC<RemindLoginModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Thông báo">
            <section id="remind-login-modal">
                <div className="rlm-container">
                    <img src={RemindLogin} alt="" />
                    <h3>Chào mừng bạn đến với nền tảng kết nối gia sư TPEDU</h3>
                    <h4>Chúng tôi sẽ giúp bạn có trải nghiệm thật khác biệt</h4>
                    <button
                        onClick={() => {
                            navigateHook(routes.login);
                            setIsOpen(false);
                        }}
                        className="sc-btn"
                    >
                        Đăng nhập hoặc tạo tài khoản
                    </button>
                    <p onClick={() => setIsOpen(false)}>Lúc khác</p>
                </div>
            </section>
        </Modal>
    );
};

export default RemindLoginModal;
