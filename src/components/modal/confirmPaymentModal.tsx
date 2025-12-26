import type { FC } from "react";
import { MdClose, MdAttachMoney } from "react-icons/md";
import Modal from "./modal";
import { LoadingSpinner } from "../elements";

interface ConfirmPaymentModalProps {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    totalAmount: number;
    onConfirm: () => void;
    loading?: boolean;
}

const ConfirmPaymentModal: FC<ConfirmPaymentModalProps> = ({
    isOpen,
    setIsOpen,
    totalAmount,
    onConfirm,
    loading = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Xác nhận thanh toán"
        >
            <div className="confirm-payment-modal">
                <div className="payment-info">
                    <MdAttachMoney size={28} className="payment-icon" />
                    <p>
                        Tổng số tiền cần thanh toán:
                        <strong> {totalAmount.toLocaleString()} VNĐ</strong>
                    </p>
                </div>

                <p className="modal-note">
                    Số tiền sẽ được trừ trực tiếp từ ví của bạn.
                    <br />
                    Bạn có chắc chắn muốn tiếp tục?
                </p>

                <div className="modal-actions">
                    <button
                        className="sc-btn"
                        onClick={() => setIsOpen(false)}
                        disabled={loading}
                    >
                        Hủy
                    </button>

                    <button
                        className={loading ? "disable-btn" : "pr-btn"}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner /> : "Xác nhận thanh toán"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmPaymentModal;
