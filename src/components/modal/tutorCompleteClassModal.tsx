import { useState, type FC } from "react";
import type { TutorCompleteClassModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { completeClassForTutorApiThunk } from "../../services/tutor/class/classThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";

const TutorCompleteClassModal: FC<TutorCompleteClassModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleComplete = async () => {
        if (!classId) {
            toast.error("Không tìm thấy lớp học");
            return;
        }

        setIsSubmitting(true);

        await dispatch(completeClassForTutorApiThunk(classId))
            .unwrap()
            .then((res) => {
                const message = get(
                    res,
                    "data.message",
                    "Hoàn thành lớp học thành công"
                );
                toast.success(message);
                setIsOpen(false);
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
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Hoàn thành lớp học">
            <section id="student-assign-class-modal">
                <div className="sacm-container">
                    <h3 className="tccm-warning">
                        Bạn có chắc chắn muốn đánh dấu lớp học này là đã hoàn thành không?
                    </h3>
                    <p className="tccm-note">
                        Lưu ý: Lớp học phải hoàn thành ít nhất 90% số buổi học. Khi hoàn thành, tiền học phí sẽ được giải ngân và tiền cọc sẽ được hoàn lại.
                    </p>

                    <div className="group-btn">
                        <button
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                            onClick={handleComplete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Xác nhận hoàn thành"}
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

export default TutorCompleteClassModal;

