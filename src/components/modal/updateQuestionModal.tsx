import { FC } from "react";
import { UpdateQuestionModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { UpdateQuizQuesstionForTutor } from "../../types/tutor";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import {
    MdOutlineLooksOne,
    MdOutlineLooksTwo,
    MdOutlineLooks3,
    MdOutlineLooks4,
} from "react-icons/md";
import { HiOutlineCheckCircle, HiOutlineLightBulb } from "react-icons/hi";
import {
    getDetailQuizForTutorApiThunk,
    updateQuizQuestionForTutorApiThunk,
} from "../../services/tutor/quiz/tutorQuizThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../elements";

const UpdateQuestionModal: FC<UpdateQuestionModalProps> = ({
    question,
    isOpen,
    setIsOpen,
    quizId,
}) => {
    const dispatch = useAppDispatch();

    const initialValues: UpdateQuizQuesstionForTutor = {
        questionText: question?.questionText,
        optionA: question?.optionA,
        optionB: question?.optionB,
        optionC: question?.optionC,
        optionD: question?.optionD,
        correctAnswer: question?.correctAnswer,
        explanation: question?.explanation,
    };

    const updateQuesstionSchema = Yup.object().shape({
        questionText: Yup.string().required(
            "Nội dung câu hỏi không được để trống"
        ),

        optionA: Yup.string().required("Đáp án A không được để trống"),
        optionB: Yup.string().required("Đáp án B không được để trống"),
        optionC: Yup.string().required("Đáp án C không được để trống"),
        optionD: Yup.string().required("Đáp án D không được để trống"),

        correctAnswer: Yup.string()
            .oneOf(["A", "B", "C", "D"], "Đáp án đúng phải là A, B, C hoặc D")
            .required("Vui lòng chọn đáp án đúng"),

        explanation: Yup.string().required("Giải thích không được để trống"),
    });

    const handleSubmit = (
        values: UpdateQuizQuesstionForTutor,
        helpers: FormikHelpers<UpdateQuizQuesstionForTutor>
    ) => {
        const formData = new FormData();
        formData.append("QuestionText", values?.questionText);
        formData.append("OptionA", values?.optionA);
        formData.append("OptionB", values?.optionB);
        formData.append("OptionC", values?.optionC);
        formData.append("OptionD", values?.optionD);
        formData.append("CorrectAnswer", values?.correctAnswer);
        formData.append("Explanation", values?.explanation);

        helpers.setSubmitting(true);
        dispatch(
            updateQuizQuestionForTutorApiThunk({
                questionId: question?.id,
                params: formData,
            })
        )
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Cập nhật thành công");
                toast.success(message);
                setIsOpen(false);
                dispatch(getDetailQuizForTutorApiThunk(quizId!));
            })
            .catch((error) => {
                const errorData = get(error, "message", "Có lỗi xảy ra");
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cập nhật câu hỏi">
            <div className="update-question-modal">
                <Formik
                    initialValues={initialValues}
                    validationSchema={updateQuesstionSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form className="form">
                            {/* Question */}
                            <div className="form-field">
                                <label className="form-label">Câu hỏi</label>
                                <div className="form-input-container">
                                    <HiOutlineQuestionMarkCircle className="form-input-icon" />
                                    <Field
                                        name="questionText"
                                        className="form-input"
                                        placeholder="Nhập nội dung câu hỏi"
                                    />
                                </div>
                                <ErrorMessage
                                    name="questionText"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Correct Answer */}
                            <div className="form-field">
                                <label className="form-label">
                                    Đáp án đúng
                                </label>
                                <div className="form-input-container">
                                    <HiOutlineCheckCircle className="form-input-icon" />
                                    <Field
                                        as="select"
                                        name="correctAnswer"
                                        className="form-input"
                                    >
                                        <option value="">
                                            -- Chọn đáp án --
                                        </option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </Field>
                                </div>
                                <ErrorMessage
                                    name="correctAnswer"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Option A */}
                            <div className="form-field">
                                <label className="form-label">Đáp án A</label>
                                <div className="form-input-container">
                                    <MdOutlineLooksOne className="form-input-icon" />
                                    <Field
                                        name="optionA"
                                        className="form-input"
                                    />
                                </div>
                                <ErrorMessage
                                    name="optionA"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Option B */}
                            <div className="form-field">
                                <label className="form-label">Đáp án B</label>
                                <div className="form-input-container">
                                    <MdOutlineLooksTwo className="form-input-icon" />
                                    <Field
                                        name="optionB"
                                        className="form-input"
                                    />
                                </div>
                                <ErrorMessage
                                    name="optionB"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Option C */}
                            <div className="form-field">
                                <label className="form-label">Đáp án C</label>
                                <div className="form-input-container">
                                    <MdOutlineLooks3 className="form-input-icon" />
                                    <Field
                                        name="optionC"
                                        className="form-input"
                                    />
                                </div>
                                <ErrorMessage
                                    name="optionC"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Option D */}
                            <div className="form-field">
                                <label className="form-label">Đáp án D</label>
                                <div className="form-input-container">
                                    <MdOutlineLooks4 className="form-input-icon" />
                                    <Field
                                        name="optionD"
                                        className="form-input"
                                    />
                                </div>
                                <ErrorMessage
                                    name="optionD"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            {/* Explanation */}
                            <div className="form-field form-field-textarea">
                                <label className="form-label">Giải thích</label>
                                <div className="form-input-container">
                                    <HiOutlineLightBulb className="form-input-icon" />
                                    <Field
                                        as="textarea"
                                        name="explanation"
                                        className="form-input"
                                        rows={3}
                                    />
                                </div>
                                <ErrorMessage
                                    name="explanation"
                                    component="div"
                                    className="text-error"
                                />
                            </div>

                            <button
                                type="submit"
                                className={
                                    isSubmitting ? "disable-btn" : "pr-btn"
                                }
                            >
                                {isSubmitting ? <LoadingSpinner /> : "Cập nhật"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
};

export default UpdateQuestionModal;
