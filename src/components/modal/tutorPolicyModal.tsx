import type { FC } from "react";
import { FaFileContract } from "react-icons/fa";
import Modal from "./modal";

interface TutorPolicyModalProps {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    onAccept?: () => void;
}

const TutorPolicyModal: FC<TutorPolicyModalProps> = ({
    isOpen,
    setIsOpen,
    onAccept,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title=""
        >
            <div className="tutor-policy-modal">
                <div className="policy-header">
                    <div className="policy-header-left">
                        <FaFileContract className="policy-icon" />
                        <h3>Chính sách và Điều khoản</h3>
                    </div>
                    <button
                        type="button"
                        className="policy-close-btn"
                        onClick={() => setIsOpen(false)}
                    >
                        &times;
                    </button>
                </div>
                <div className="policy-content">
                    <h4>1. Điều kiện đăng ký</h4>
                    <ul>
                        <li>Gia sư phải đủ 18 tuổi trở lên</li>
                        <li>
                            Có trình độ học vấn từ Cao đẳng trở lên hoặc đang theo học tại
                            các trường Đại học, Cao đẳng
                        </li>
                        <li>Có kinh nghiệm giảng dạy hoặc chứng chỉ liên quan</li>
                        <li>
                            Cung cấp đầy đủ thông tin cá nhân và giấy tờ tùy thân hợp lệ
                        </li>
                    </ul>

                    <h4>2. Nghĩa vụ của gia sư</h4>
                    <ul>
                        <li>
                            Thực hiện giảng dạy đúng giờ, đúng chất lượng như đã cam kết
                        </li>
                        <li>Bảo mật thông tin học sinh và phụ huynh</li>
                        <li>
                            Tuân thủ các quy định về an toàn và đạo đức nghề nghiệp
                        </li>
                        <li>Thông báo kịp thời khi không thể thực hiện buổi học</li>
                        <li>
                            Không được thu phí trực tiếp từ học sinh/phụ huynh ngoài phí
                            đã thỏa thuận trên nền tảng
                        </li>
                    </ul>

                    <h4>3. Quyền lợi của gia sư</h4>
                    <ul>
                        <li>Nhận thanh toán đúng hạn theo thỏa thuận</li>
                        <li>Được hỗ trợ từ đội ngũ chăm sóc khách hàng</li>
                        <li>
                            Được đánh giá và phản hồi từ học sinh/phụ huynh
                        </li>
                        <li>
                            Được tham gia các chương trình ưu đãi và khuyến mãi
                        </li>
                    </ul>

                    <h4>4. Chính sách thanh toán</h4>
                    <ul>
                        <li>
                            Thanh toán được thực hiện qua hệ thống escrow của nền tảng
                        </li>
                        <li>Phí dịch vụ sẽ được trừ từ số tiền nhận được</li>
                        <li>
                            Thanh toán được thực hiện sau khi hoàn thành buổi học và được
                            xác nhận
                        </li>
                    </ul>

                    <h4>5. Chính sách hủy và hoàn tiền</h4>
                    <ul>
                        <li>
                            Gia sư có thể hủy lớp học trước 24 giờ mà không bị phạt
                        </li>
                        <li>Hủy trong vòng 24 giờ có thể bị phạt theo quy định</li>
                        <li>
                            Hoàn tiền được thực hiện theo chính sách của nền tảng
                        </li>
                    </ul>

                    <h4>6. Vi phạm và xử lý</h4>
                    <ul>
                        <li>
                            Vi phạm các quy định có thể dẫn đến cảnh báo, tạm khóa hoặc
                            khóa vĩnh viễn tài khoản
                        </li>
                        <li>
                            Hành vi gian lận, lừa đảo sẽ bị xử lý theo pháp luật
                        </li>
                    </ul>

                    <h4>7. Bảo mật thông tin</h4>
                    <ul>
                        <li>
                            Nền tảng cam kết bảo mật thông tin cá nhân của gia sư
                        </li>
                        <li>
                            Thông tin chỉ được sử dụng cho mục đích cung cấp dịch vụ
                        </li>
                    </ul>

                    <p className="policy-note">
                        <strong>Lưu ý:</strong> Bằng việc đăng ký, bạn đã đọc, hiểu và
                        đồng ý với tất cả các điều khoản trên.
                    </p>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="sc-btn"
                        onClick={() => setIsOpen(false)}
                    >
                        Đóng
                    </button>
                    {onAccept && (
                        <button
                            type="button"
                            className="pr-btn"
                            onClick={() => {
                                onAccept();
                                setIsOpen(false);
                            }}
                        >
                            Đồng ý
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default TutorPolicyModal;

