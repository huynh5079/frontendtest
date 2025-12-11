import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CreateFeedbackInClass } from "../../../types/feedback";
import { PublicClass } from "../../../types/public";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectIsAuthenticated } from "../../../app/selector";
import { createFeedbackInClassApiThunk } from "../../../services/feedback/feedbackThunk";
import { get } from "lodash";
import { MdFeedback } from "react-icons/md";
import { LoadingSpinner } from "../../elements";
import { RemindLoginModal } from "../../modal";

interface ClassFeedbackProps {
    classDetail: PublicClass | null;
}

const ClassFeedback: FC<ClassFeedbackProps> = ({ classDetail }) => {
    const dispatch = useAppDispatch();
    const isAuthendicated = useAppSelector(selectIsAuthenticated);

    const [isRemidLoginOpen, setIsRemidLoginOpen] = useState(false);

    /* ================================
       Feedback form
    ================================= */
    const initialValues: CreateFeedbackInClass = {
        classId: classDetail?.id!,
        toUserId: classDetail?.tutorId!,
        comment: "",
        rating: 0,
    };

    const feedbackValidationSchema = Yup.object({
        comment: Yup.string()
            .required("Vui lòng nhập đánh giá")
            .min(10, "Đánh giá phải ít nhất 10 ký tự"),
        rating: Yup.number()
            .min(1, "Vui lòng chọn số sao")
            .max(5, "Tối đa 5 sao")
            .required("Vui lòng chọn số sao"),
    });

    const StarRating = ({ value, onChange }: any) => (
        <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => onChange(star)}
                    style={{
                        cursor: "pointer",
                        color: star <= value ? "var(--main-color)" : "#ccc",
                        fontSize: "40px",
                        marginRight: "8px",
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );

    return (
        <div className="class-feedback">
            <Formik
                initialValues={initialValues}
                validationSchema={feedbackValidationSchema}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    const payload: CreateFeedbackInClass = {
                        classId: classDetail?.id!,
                        toUserId: classDetail?.tutorId!,
                        comment: values.comment,
                        rating: values.rating,
                    };

                    if (!isAuthendicated) {
                        setIsRemidLoginOpen(true);
                        return;
                    }

                    setSubmitting(true);

                    dispatch(createFeedbackInClassApiThunk(payload))
                        .unwrap()
                        .then((res) => {
                            toast.success(
                                get(res, "data.message", "Đánh giá thành công"),
                            );
                            resetForm();
                        })
                        .catch((error) => {
                            toast.error(
                                get(error, "data.message", "Có lỗi xảy ra"),
                            );
                        })
                        .finally(() => setSubmitting(false));
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="form">
                        <div className="form-field">
                            <label className="form-label">
                                Để lại đánh giá
                            </label>
                            <div className="form-input-container">
                                <MdFeedback className="form-input-icon" />
                                <Field
                                    name="comment"
                                    type="text"
                                    className="form-input"
                                    placeholder="Hãy để lại đánh giá"
                                />
                            </div>
                            <ErrorMessage
                                name="comment"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        <div className="form-field">
                            <StarRating
                                value={values.rating}
                                onChange={(star: number) =>
                                    setFieldValue("rating", star)
                                }
                            />
                            <ErrorMessage
                                name="rating"
                                component="p"
                                className="text-error"
                            />
                        </div>

                        <button
                            type="submit"
                            className={isSubmitting ? "disable-btn" : "pr-btn"}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "Đánh giá"}
                        </button>
                    </Form>
                )}
            </Formik>

            {/* Modals */}
            <RemindLoginModal
                isOpen={isRemidLoginOpen}
                setIsOpen={setIsRemidLoginOpen}
            />
        </div>
    );
};

export default ClassFeedback;
