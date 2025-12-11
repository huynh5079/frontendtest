import { useState, type FC } from "react";
import type { StudentWithdrawClassModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { withdrawClassForStudentApiThunk } from "../../services/student/class/classThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";

const StudentWithdrawClassModal: FC<StudentWithdrawClassModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleWithdraw = async () => {
        if (!classId) {
            toast.error("Không tìm thấy lớp học");
            return;
        }

        setIsSubmitting(true);

        await dispatch(withdrawClassForStudentApiThunk(classId))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Rút khỏi lớp học thành công");
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
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Rút khỏi lớp học">
            <section id="student-withdraw-class-modal">
                <div className="swcm-container">
                    <p className="swcm-warning">
                        Bạn có chắc chắn muốn rút khỏi lớp học này không?
                    </p>
                    <p className="swcm-note">
                        Lưu ý: Khi rút khỏi lớp học, tiền học phí sẽ được hoàn lại vào ví của bạn.
                    </p>

                    <div className="group-btn">
                        <button
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                            onClick={handleWithdraw}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Xác nhận rút"}
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

export default StudentWithdrawClassModal;

