import type { FC } from "react";
import type { RemindWalletModalProps } from "../../types/modal";
import Modal from "./modal";
import { RemindWallet } from "../../assets/images";
import { navigateHook } from "../../routes/routeApp";
import { routes } from "../../routes/routeName";

const RemindWalletModal: FC<RemindWalletModalProps> = ({
    isOpen,
    setIsOpen,
    routes,
}) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Thông báo">
            <section id="remind-login-modal">
                <div className="rlm-container">
                    <img src={RemindWallet} alt="" />
                    <h3>
                        Rất tiếc! Số dư ví của bạn không đủ. Vui lòng nạp thêm
                        để sử dụng chức năng này.
                    </h3>
                    <button
                        onClick={() => {
                            navigateHook(routes);
                            setIsOpen(false);
                        }}
                        className="sc-btn"
                    >
                        Đi đến ví thanh toán
                    </button>
                    <p onClick={() => setIsOpen(false)}>Lúc khác</p>
                </div>
            </section>
        </Modal>
    );
};

export default RemindWalletModal;
