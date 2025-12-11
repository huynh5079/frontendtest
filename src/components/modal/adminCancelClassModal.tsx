import { useState, type FC } from "react";
import type { AdminCancelClassModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { adminCancelClassApiThunk } from "../../services/admin/class/adminClassThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";
import type { AdminCancelClassParams } from "../../types/class";

const AdminCancelClassModal: FC<AdminCancelClassModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState<number>(0);
    const [note, setNote] = useState<string>("");

    const cancelReasons = [
        { value: 0, label: "Lỗi hệ thống/setup" },
        { value: 1, label: "Tutor lỗi" },
        { value: 2, label: "Học sinh lỗi" },
        { value: 3, label: "Hai bên đồng ý" },
        { value: 4, label: "Vi phạm chính sách" },
        { value: 5, label: "Lớp trùng lặp" },
        { value: 6, label: "Thông tin sai" },
        { value: 7, label: "Lý do khác" },
    ];

    const handleCancel = async () => {
        if (!classId) {
            toast.error("Không tìm thấy lớp học");
            return;
        }

        setIsSubmitting(true);
        const params: AdminCancelClassParams = {
            reason,
            note: note || undefined,
        };

        await dispatch(adminCancelClassApiThunk({ classId, params }))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Hủy lớp học thành công");
                toast.success(message);
                setIsOpen(false);
                // Reset form
                setReason(0);
                setNote("");
                // Call onSuccess callback to refresh list
                if (onSuccess) {
                    onSuccess();
                }
            })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Hủy lớp học">
            <section id="admin-cancel-class-modal">
                <div className="accm-container">
                    <p className="accm-warning">
                        Bạn có chắc chắn muốn hủy lớp học này không?
                    </p>

                    <div className="accm-warning-box">
                        <div className="accm-warning-header">
                            <span className="accm-warning-icon">⚠️</span>
                            <strong>Cảnh báo: Hành động này sẽ:</strong>
                        </div>
                        <ul className="accm-warning-list">
                            <li>Hoàn tiền cho tất cả học sinh (nếu đã thanh toán)</li>
                            <li>Hủy tất cả các buổi học trong tương lai</li>
                            <li>Gửi thông báo cho gia sư và tất cả học sinh</li>
                        </ul>
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="cancel-class-reason-select">Lý do hủy</label>
                        <select
                            id="cancel-class-reason-select"
                            className="form-input"
                            value={reason}
                            onChange={(e) => setReason(Number(e.target.value))}
                            disabled={isSubmitting}
                        >
                            {cancelReasons.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Ghi chú (tùy chọn)</label>
                        <textarea
                            className="form-input"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú chi tiết..."
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="group-btn">
                        <button
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Xác nhận hủy"}
                        </button>
                        <button
                            className="sc-btn"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </section>
        </Modal>
    );
};

export default AdminCancelClassModal;

