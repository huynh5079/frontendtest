import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { cancelClassRequestForStudentApiThunk } from "../../services/student/bookingTutor/bookingTutorThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../elements";
const CancelBookingTutorForStudent = ({ isOpen, setIsOpen, requestId, }) => {
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
    return (_jsx(Modal, { isOpen: isOpen, setIsOpen: setIsOpen, children: _jsx("section", { id: "cancel-booking-tutor-for-student-modal", children: _jsxs("div", { className: "cbtfsm-container", children: [_jsx("h3", { children: "Ba\u0323n co\u0301 muo\u0302\u0301n huy\u0309 li\u0323ch ho\u0323c na\u0300y kho\u0302ng?" }), _jsxs("div", { className: "group-btn", children: [_jsx("button", { className: isSubmitting ? "disable-btn" : "pr-btn", onClick: handleCancel, children: isSubmitting ? _jsx(LoadingSpinner, {}) : "Xác nhận" }), _jsx("button", { className: "sc-btn", onClick: () => setIsOpen(false), children: "Kh\u00F4ng" })] })] }) }) }));
};
export default CancelBookingTutorForStudent;
