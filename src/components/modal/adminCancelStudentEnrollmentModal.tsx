import { useState, type FC } from "react";
import type { AdminCancelStudentEnrollmentModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { adminCancelStudentEnrollmentApiThunk } from "../../services/admin/class/adminClassThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";
import type { AdminCancelStudentEnrollmentParams } from "../../types/class";

const AdminCancelStudentEnrollmentModal: FC<AdminCancelStudentEnrollmentModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
    studentId,
    studentName,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState<number>(0);
    const [note, setNote] = useState<string>("");

    const cancelReasons = [
        { value: 0, label: "Lỗi hệ thống/setup" },
        { value: 1, label: "Lỗi từ gia sư" },
        { value: 2, label: "Lỗi từ học sinh" },
        { value: 3, label: "Hai bên đồng ý" },
        { value: 4, label: "Vi phạm chính sách" },
        { value: 5, label: "Lớp trùng lặp" },
        { value: 6, label: "Thông tin sai" },
        { value: 7, label: "Lý do khác" },
    ];

    const handleCancel = async () => {
        if (!classId || !studentId) {
            toast.error("Không tìm thấy lớp học hoặc học sinh");
            return;
        }

        setIsSubmitting(true);
        const params: AdminCancelStudentEnrollmentParams = {
            reason,
            note: note || undefined,
        };

        await dispatch(
            adminCancelStudentEnrollmentApiThunk({ classId, studentId, params })
        )
            .unwrap()
            .then((res) => {
                const message = get(
                    res,
                    "data.message",
                    "Hủy học sinh khỏi lớp thành công"
                );
                toast.success(message);
                setIsOpen(false);
                setReason(0);
                setNote("");
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

    const modalTitle = studentName
        ? `Hủy học sinh: ${studentName} khỏi lớp`
        : "Hủy học sinh khỏi lớp";

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={modalTitle}>
            <section id="admin-cancel-student-enrollment-modal">
                <div className="acsem-container">
                    <p className="acsem-warning">
                        Bạn có chắc chắn muốn hủy học sinh này khỏi lớp học không?
                    </p>

                    <div className="acsem-warning-box">
                        <div className="acsem-warning-header">
                            <span className="acsem-warning-icon">⚠️</span>
                            <strong>Cảnh báo: Hành động này sẽ:</strong>
                        </div>
                        <ul className="acsem-warning-list">
                            <li>Hoàn tiền cho học sinh (nếu đã thanh toán)</li>
                            <li>Giảm số lượng học sinh trong lớp</li>
                            <li>Gửi thông báo cho học sinh</li>
                        </ul>
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="cancel-reason-select">Lý do hủy</label>
                        <select
                            id="cancel-reason-select"
                            className="form-input"
                            value={reason}
                            onChange={(e) => setReason(Number(e.target.value))}
                            disabled={isSubmitting}
                            title="Lý do hủy"
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

export default AdminCancelStudentEnrollmentModal;

