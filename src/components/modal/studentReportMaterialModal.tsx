import { useState, type FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../app/store";
import {
    reportMaterialToTutorApiThunk,
    reportMaterialToAdminApiThunk,
} from "../../services/student/report/studentReportThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";
import Modal from "./modal";
import { MdReport, MdAdminPanelSettings, MdPerson } from "react-icons/md";

interface StudentReportMaterialModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    lessonId: string;
    mediaId: string;
    materialName: string;
}

const StudentReportMaterialModal: FC<StudentReportMaterialModalProps> = ({
    isOpen,
    setIsOpen,
    lessonId,
    mediaId,
    materialName,
}) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recipient, setRecipient] = useState<"tutor" | "admin">("tutor");

    const initialValues = {
        reason: "",
    };

    const validationSchema = Yup.object().shape({
        reason: Yup.string()
            .required("Vui lòng nhập lý do báo cáo")
            .min(10, "Lý do báo cáo phải có ít nhất 10 ký tự"),
    });

    const handleSubmit = async (values: { reason: string }) => {
        setIsSubmitting(true);

        const params = {
            lessonId,
            mediaId,
            reason: values.reason,
        };

        const thunk =
            recipient === "tutor"
                ? reportMaterialToTutorApiThunk
                : reportMaterialToAdminApiThunk;

        await dispatch(thunk(params))
            .unwrap()
            .then((res) => {
                const message = get(
                    res,
                    "message",
                    recipient === "tutor"
                        ? "Báo cáo đã được gửi đến gia sư"
                        : "Báo cáo đã được gửi đến quản trị viên"
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
            title="Báo cáo tài liệu không phù hợp"
        >
            <section id="student-report-material-modal">
                <div className="srmm-container">
                    <p className="srmm-material-name">
                        Tài liệu: <strong>{materialName}</strong>
                    </p>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="form">
                                {/* Chọn người nhận */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Gửi báo cáo đến
                                    </label>
                                    <div className="recipient-options">
                                        <div
                                            className={`recipient-option ${recipient === "tutor"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => setRecipient("tutor")}
                                        >
                                            <MdPerson className="recipient-icon" />
                                            <div>
                                                <h4>Gia sư</h4>
                                                <p>Gửi báo cáo đến gia sư của lớp học</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`recipient-option ${recipient === "admin"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                setRecipient("admin")
                                            }
                                        >
                                            <MdAdminPanelSettings className="recipient-icon" />
                                            <div>
                                                <h4>Quản trị viên</h4>
                                                <p>
                                                    Gửi báo cáo trực tiếp đến quản trị viên
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Nhập lý do */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Lý do báo cáo <span>*</span>
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="reason"
                                        className="form-textarea"
                                        placeholder="Nhập lý do báo cáo tài liệu này không phù hợp..."
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
        </Modal>
    );
};

export default StudentReportMaterialModal;

