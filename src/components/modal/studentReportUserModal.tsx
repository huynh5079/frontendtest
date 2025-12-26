import { useState, type FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../app/store";
import { reportUserApiThunk } from "../../services/student/report/studentReportThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";
import Modal from "./modal";
import { MdReport } from "react-icons/md";

interface StudentReportUserModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    targetUserId: string;
    targetUserName: string;
}

const StudentReportUserModal: FC<StudentReportUserModalProps> = ({
    isOpen,
    setIsOpen,
    targetUserId,
    targetUserName,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        reason: "",
    };

    const validationSchema = Yup.object().shape({
        reason: Yup.string()
            .required("Vui lòng nhập lý do báo cáo")
            .min(10, "Lý do báo cáo phải có ít nhất 10 ký tự"),
    });

    const handleSubmit = async (values: { reason: string }) => {
        if (!targetUserId || !targetUserName) {
            toast.error("Không tìm thấy thông tin người dùng. Vui lòng tải lại trang.");
            return;
        }

        setIsSubmitting(true);

        const params = {
            targetUserId,
            reason: values.reason,
        };

        await dispatch(reportUserApiThunk(params))
            .unwrap()
            .then((res) => {
                const message = get(
                    res,
                    "message",
                    "Báo cáo đã được gửi thành công"
                );
                toast.success(message);
                setIsOpen(false);
            })
            .catch((error) => {
                const errorData = get(
                    error,
                    "data.message",
                    "Có lỗi xảy ra khi gửi báo cáo"
                );
                toast.error(errorData);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Báo cáo người dùng"
        >
            {targetUserId && targetUserName ? (
                <section id="student-report-user-modal">
                    <div className="srmm-container">
                        <p className="srmm-material-name">
                            Người dùng: <strong>{targetUserName}</strong>
                        </p>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="form">
                                {/* Nhập lý do */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Lý do báo cáo <span>*</span>
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="reason"
                                        className="form-textarea"
                                        placeholder="Nhập lý do báo cáo người dùng này..."
                                        rows={5}
                                    />
                                    <ErrorMessage
                                        name="reason"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="group-btn">
                                    <button
                                        type="submit"
                                        className={
                                            isSubmitting
                                                ? "disable-btn"
                                                : "pr-btn"
                                        }
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <>
                                                <MdReport className="btn-icon" />
                                                Gửi báo cáo
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="sc-btn"
                                        onClick={() => setIsOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
            ) : (
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <p>Đang tải thông tin người dùng...</p>
                </div>
            )}
        </Modal>
    );
};

export default StudentReportUserModal;

