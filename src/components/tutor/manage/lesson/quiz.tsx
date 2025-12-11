import { FC, useEffect, useMemo, useState } from "react";
import { Homework } from "../../../../assets/images";
import { CreateQuizForTutorParams } from "../../../../types/tutor";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MdFileUpload, MdSelectAll } from "react-icons/md";
import sampleQuiz from "../../../../assets/file/sample-quiz.txt";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    createQuizForTutorApiThunk,
    getAllQuizForTutorApiThunk,
    getDetailQuizForTutorApiThunk,
} from "../../../../services/tutor/quiz/tutorQuizThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../elements";
import {
    selectDetailQuizForTutor,
    selectListQuizForTutor,
} from "../../../../app/selector";
import {
    formatDate,
    formatTimeAdd7,
    getQuizTypeText,
} from "../../../../utils/helper";
import TutorDetailQuiz from "./detailQuiz";

interface TutorManageQuizProps {
    lessonId: string;
}

const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = sampleQuiz;
    link.download = "sample-quiz.txt"; // tên file khi tải về
    link.click();
};

const ITEMS_PER_PAGE = 6;

const TutorManageQuiz: FC<TutorManageQuizProps> = ({ lessonId }) => {
    const dispatch = useAppDispatch();
    const quizes = useAppSelector(selectListQuizForTutor);
    const quiz = useAppSelector(selectDetailQuizForTutor);

    const [quizId, setQuizId] = useState("");
    const [section, setSection] = useState("list");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Tổng số trang ---
    const totalPages = Math.ceil(quizes?.length! / ITEMS_PER_PAGE);

    // --- Lấy dữ liệu theo trang ---
    const paginatedQuizes = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return quizes?.slice(start, start + ITEMS_PER_PAGE);
    }, [quizes, currentPage]);

    const initialValues: CreateQuizForTutorParams = {
        lessonId: lessonId.toLowerCase(),
        quizFile: new File([], ""),
        quizType: "",
        maxAttempts: 0,
    };

    const createQuizSchema = Yup.object().shape({
        quizFile: Yup.mixed<File>()
            .required("Vui lòng nộp file bài tập")
            .test("fileSize", "File quá lớn (tối đa 5MB)", (value) => {
                if (!value) return false; // chưa có file
                return (value as File).size <= 5 * 1024 * 1024; // 5MB
            })
            .test("fileType", "Chỉ cho phép file .txt hoặc .json", (value) => {
                if (!value) return false;
                const file = value as File;
                return ["text/plain", "application/json"].includes(file.type);
            }),

        quizType: Yup.string().required("Vui lòng chọn loại bài tập"),

        maxAttempts: Yup.number()
            .required("Vui lòng nhập số lần làm tối đa")
            .min(1, "Tối thiểu là 1 lần")
            .max(10, "Tối đa là 10 lần"),
    });

    useEffect(() => {
        if (section === "list") {
            dispatch(getAllQuizForTutorApiThunk(lessonId));
        }
    }, [dispatch, section]);

    useEffect(() => {
        if (section === "detail" && quizId) {
            dispatch(getDetailQuizForTutorApiThunk(quizId));
        }
    }, [dispatch, section, quizId]);

    return (
        <div className="tutor-quiz">
            {section === "list" && (
                <>
                    <button
                        className="pr-btn"
                        onClick={() => setSection("create")}
                    >
                        Tạo bài tập
                    </button>

                    {quizes?.length === 0 && (
                        <div className="no-quiz">
                            <img src={Homework} alt="" />
                            <p>Chưa có bài tập cho buổi học</p>
                        </div>
                    )}

                    {paginatedQuizes?.length! > 0 && (
                        <>
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Tiêu đề
                                        </th>
                                        <th className="table-head-cell">
                                            Số câu hỏi
                                        </th>
                                        <th className="table-head-cell">
                                            Loại bài tập
                                        </th>
                                        <th className="table-head-cell">
                                            Thời gian tạo
                                        </th>
                                        <th className="table-head-cell">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="table-body">
                                    {quizes?.map((quiz) => (
                                        <tr
                                            className="table-body-row"
                                            key={quiz.id}
                                        >
                                            <td className="table-body-cell">
                                                {quiz.title}
                                            </td>
                                            <td className="table-body-cell">
                                                {quiz.totalQuestions}
                                            </td>
                                            <td className="table-body-cell">
                                                {getQuizTypeText(quiz.quizType)}
                                            </td>
                                            <td className="table-body-cell">
                                                {formatTimeAdd7(quiz.createdAt)}{" "}
                                                {formatDate(quiz.createdAt)}
                                            </td>
                                            <td className="table-body-cell">
                                                <button
                                                    className="pr-btn"
                                                    onClick={() => {
                                                        setSection("detail");
                                                        setQuizId(quiz.id);
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* --- Phân trang --- */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        disabled={currentPage === 1}
                                        className={
                                            currentPage === 1
                                                ? "disable-btn"
                                                : "sc-btn"
                                        }
                                        onClick={() =>
                                            setCurrentPage((prev) => prev - 1)
                                        }
                                    >
                                        Trang trước
                                    </button>

                                    <span>
                                        {currentPage}/{totalPages}
                                    </span>

                                    <button
                                        disabled={currentPage === totalPages}
                                        className={
                                            currentPage === totalPages
                                                ? "disable-btn"
                                                : "sc-btn"
                                        }
                                        onClick={() =>
                                            setCurrentPage((prev) => prev + 1)
                                        }
                                    >
                                        Trang sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {section === "detail" && (
                <TutorDetailQuiz quiz={quiz!} setSection={setSection} />
            )}

            {section === "create" && (
                <>
                    <button
                        className="sc-btn"
                        onClick={() => setSection("list")}
                    >
                        Quay lại
                    </button>

                    <div className="download-file">
                        <h4>Vui lòng nộp file bài tập theo file mẫu</h4>
                        <p onClick={handleDownloadTemplate}>Tải file mẫu</p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={createQuizSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const formData = new FormData();
                            formData.append("lessonId", values.lessonId);
                            formData.append("quizType", values.quizType);
                            formData.append(
                                "maxAttempts",
                                values.maxAttempts.toString(),
                            );
                            formData.append("quizFile", values.quizFile);

                            setSubmitting(true);
                            dispatch(createQuizForTutorApiThunk(formData))
                                .unwrap()
                                .then((res) => {
                                    const message = get(
                                        res,
                                        "data.message",
                                        "Tạo bài tập thành công",
                                    );
                                    toast.success(message);
                                })
                                .catch((error) => {
                                    const errorData = get(
                                        error,
                                        "data.message",
                                        "Có lỗi xảy ra",
                                    );
                                    toast.error(errorData);
                                })
                                .finally(() => {
                                    setSubmitting(false);
                                    resetForm();
                                    setSection("list");
                                });
                        }}
                    >
                        {({ setFieldValue, isSubmitting }) => (
                            <Form className="form">
                                {/* Quiz File */}
                                <div className="form-field">
                                    <label className="form-label">
                                        File bài tập
                                    </label>
                                    <div className="form-input-container">
                                        <MdFileUpload className="form-input-icon" />
                                        <input
                                            type="file"
                                            accept=".txt,.json"
                                            className="form-input"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setFieldValue(
                                                        "quizFile",
                                                        e.target.files[0],
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="quizFile"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Quiz Type */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Loại bài tập
                                    </label>
                                    <div className="form-input-container">
                                        <MdSelectAll className="form-input-icon" />
                                        <Field
                                            as="select"
                                            name="quizType"
                                            className="form-input"
                                        >
                                            <option value="">
                                                -- Chọn loại --
                                            </option>
                                            <option value="Practice">
                                                Bài tập về nhà
                                            </option>
                                            <option value="Text">
                                                Bài kiểm tra
                                            </option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="quizType"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Max Attempts */}
                                <div className="form-field">
                                    <label className="form-label">
                                        Số lần làm bài
                                    </label>
                                    <div className="form-input-container">
                                        <MdSelectAll className="form-input-icon" />
                                        <Field
                                            type="number"
                                            name="maxAttempts"
                                            className="form-input"
                                            min={1}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="maxAttempts"
                                        component="div"
                                        className="text-error"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className={
                                        isSubmitting ? "disable-btn" : "pr-btn"
                                    }
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Tạo bài tập"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </>
            )}
        </div>
    );
};

export default TutorManageQuiz;
