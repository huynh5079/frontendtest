import { useState, type FC } from "react";
import type { TutorCancelClassModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { cancelClassForTutorApiThunk } from "../../services/tutor/class/classThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";

const TutorCancelClassModal: FC<TutorCancelClassModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState<string>("");

    const handleCancel = async () => {
        if (!classId) {
            toast.error("Không tìm thấy lớp học");
            return;
        }

        setIsSubmitting(true);

        await dispatch(
            cancelClassForTutorApiThunk({ classId, reason: reason || undefined })
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Hủy lớp học thành công");
                toast.success(message);
                setIsOpen(false);
                // Reset form
                setReason("");
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
            <section id="tutor-cancel-class-modal">
                <div className="tccm-container">
                    <p className="tccm-warning">
                        Bạn có chắc chắn muốn hủy lớp học này không?
                    </p>
                    <p className="tccm-note">
                        Lưu ý: Khi hủy lớp học, tiền cọc sẽ bị mất và tiền học phí sẽ được hoàn lại cho học sinh.
                    </p>

                    <div className="form-field">
                        <label className="form-label">Lý do hủy (tùy chọn)</label>
                        <textarea
                            className="form-input"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do hủy lớp học..."
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

export default TutorCancelClassModal;

