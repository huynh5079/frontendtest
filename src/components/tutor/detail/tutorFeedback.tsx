import { FC, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    selectIsAuthenticated,
    selectListFeedbackInTutorProfile,
} from "../../../app/selector";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    createFeedbackInTutorProfileApiThunk,
    getAllFeedbackInTutorProfileApiThunk,
} from "../../../services/feedback/feedbackThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { MdFeedback } from "react-icons/md";
import { FeedbackTutor, LoadingSpinner } from "../../elements";
import { RemindLoginModal } from "../../modal";
import TutorFeedbackStat from "./tutorFeedbackStat";

interface TutorFeedbackProps {
    tutorId: string;
}

const TutorFeedback: FC<TutorFeedbackProps> = ({ tutorId }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [openRemindLogin, setOpenRemindLogin] = useState(false);
    const [filterStar, setFilterStar] = useState<number | null>(null);

    const feedbacksInTutorProfile = useAppSelector(
        selectListFeedbackInTutorProfile,
    );

    useEffect(() => {
        dispatch(
            getAllFeedbackInTutorProfileApiThunk({
                tutorUserId: tutorId,
                page: 1,
                pageSize: 10,
            }),
        );
    }, [dispatch, tutorId]);

    /** ============ STAR COMPONENT ============== */
    const StarRating = ({ value, onChange }: any) => {
        return (
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
    };

    return (
        <div className="tutor-feedback">
            <h4>Đánh giá về gia sư</h4>
            <TutorFeedbackStat
                setFilterStar={setFilterStar}
                feedbacksInTutorProfile={feedbacksInTutorProfile}
                activeStar={filterStar}
            />
            <Formik
                initialValues={{
                    comment: "",
                    rating: 0,
                }}
                validationSchema={Yup.object({
                    comment: Yup.string()
                        .required("Vui lòng nhập đánh giá")
                        .min(10, "Đánh giá phải ít nhất 10 ký tự"),
                    rating: Yup.number()
                        .min(1, "Vui lòng chọn số sao")
                        .required("Vui lòng chọn số sao"),
                })}
                onSubmit={(values, { resetForm }) => {
                    if (!isAuthenticated) {
                        setOpenRemindLogin(true);
                        return;
                    }

                    dispatch(
                        createFeedbackInTutorProfileApiThunk({
                            tutorUserId: tutorId!,
                            params: values,
                        }),
                    )
                        .unwrap()
                        .then((res) => {
                            toast.success(
                                get(res, "data.message", "Đánh giá thành công"),
                            );

                            dispatch(
                                getAllFeedbackInTutorProfileApiThunk({
                                    tutorUserId: tutorId!,
                                    page: 1,
                                    pageSize: 10,
                                }),
                            );

                            resetForm();
                        })
                        .catch((err) => {
                            toast.error(
                                get(err, "data.message", "Có lỗi xảy ra"),
                            );
                        });
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="form">
                        <div className="form-field">
                            <label className="form-label">Để lại đánh giá của bạn</label>
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

            <FeedbackTutor
                feedbacksInTutorProfile={feedbacksInTutorProfile!}
                filterStar={filterStar}
            />

            <RemindLoginModal
                isOpen={openRemindLogin}
                setIsOpen={setOpenRemindLogin}
            />
        </div>
    );
};

export default TutorFeedback;
