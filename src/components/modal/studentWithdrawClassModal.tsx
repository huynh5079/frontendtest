import { useState, type FC } from "react";
import type { StudentWithdrawClassModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { withdrawClassForStudentApiThunk } from "../../services/student/class/classThunk";
import { selectUserLogin } from "../../app/selector";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";

const StudentWithdrawClassModal: FC<StudentWithdrawClassModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
    onSuccess,
}) => {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(selectUserLogin);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleWithdraw = async () => {
        if (!classId) {
            toast.error("Không tìm thấy lớp học");
            return;
        }

        if (!userInfo?.id) {
            toast.error("Không tìm thấy thông tin người dùng");
            return;
        }

        setIsSubmitting(true);

        await dispatch(withdrawClassForStudentApiThunk({ classId, studentId: userInfo.id }))
            .unwrap()
            .then((res) => {
                const message = get(res, "data.message", "Rút khỏi lớp học thành công");
                toast.success(message);
                setIsOpen(false);
                // Call onSuccess callback if provided
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
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Rút khỏi lớp học">
            <section id="student-assign-class-modal">
                <div className="sacm-container">
                    <h3 className="sacm-warning">
                        Bạn có chắc chắn muốn rút khỏi lớp học này không?
                    </h3>
                    <p className="sacm-note">
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

