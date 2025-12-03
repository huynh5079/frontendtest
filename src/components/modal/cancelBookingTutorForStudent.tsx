import { useState, type FC } from "react";
import type { CancelBookingTutorForStudentProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { cancelClassRequestForStudentApiThunk } from "../../services/student/bookingTutor/bookingTutorThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../elements";

const CancelBookingTutorForStudent: FC<CancelBookingTutorForStudentProps> = ({
    isOpen,
    setIsOpen,
    requestId,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = async () => {
        setIsSubmitting(true);
        await dispatch(cancelClassRequestForStudentApiThunk(String(requestId)))
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Huỷ lịch thành công");
                toast.success(message);
                setIsOpen(false);
                navigate(`/student/information?tab=booking_tutor`);
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="cancel-booking-tutor-for-student-modal">
                <div className="cbtfsm-container">
                    <h3>Bạn có muốn huỷ lịch học này không?</h3>
                    <div className="group-btn">
                        <button
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                            onClick={handleCancel}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Xác nhận"}
                        </button>
                        <button
                            className="sc-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            Không
                        </button>
                    </div>
                </div>
            </section>
        </Modal>
    );
};

export default CancelBookingTutorForStudent;
