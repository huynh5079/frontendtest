import { FC, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListHistorySubmitQuizForStudent } from "../../../app/selector";
import { getAllHistorySubmitQuizForStudentApiThunk } from "../../../services/student/quiz/studentQuizThunk";
import { StudentQuizResult } from "../../../types/student";
import { formatDate, formatTimeAdd7 } from "../../../utils/helper";

interface StudentHistorySubmitQuizProps {
    quizId: string;
    setSection: (section: string) => void;
}

const ITEMS_PER_PAGE = 6;

const StudentHistorySubmitQuiz: FC<StudentHistorySubmitQuizProps> = ({
    quizId,
    setSection,
}) => {
    const dispatch = useAppDispatch();
    const historyQuizes = useAppSelector(selectListHistorySubmitQuizForStudent);

    const [selectedQuiz, setSelectedQuiz] = useState<StudentQuizResult | null>(
        null,
    );
    const [currentPage, setCurrentPage] = useState(1);

    // --- Tổng số trang ---
    const totalPages = Math.ceil(historyQuizes?.length! / ITEMS_PER_PAGE);

    // --- Lấy dữ liệu theo trang ---
    const paginatedQuizes = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return historyQuizes?.slice(start, start + ITEMS_PER_PAGE);
    }, [historyQuizes, currentPage]);

    useEffect(() => {
        dispatch(getAllHistorySubmitQuizForStudentApiThunk(quizId));
    }, [dispatch, quizId]);

    return (
        <div className="student-history-submit-quiz">
            {!selectedQuiz && (
                <>
                    <div className="shsq-header">
                        <h3>Lịch sử làm bài</h3>
                        <button
                            className="sc-btn"
                            onClick={() => setSection("list")}
                        >
                            Quay lại
                        </button>
                    </div>

                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Số câu trả lời đúng
                                </th>
                                <th className="table-head-cell">
                                    Tổng số điểm
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian nộp bài
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="table-body">
                            {paginatedQuizes?.map((quiz) => (
                                <tr
                                    className="table-body-row"
                                    key={quiz.attemptId}
                                >
                                    <td className="table-body-cell">
                                        {quiz.correctAnswers}
                                    </td>
                                    <td className="table-body-cell">
                                        {quiz.scorePercentage}
                                    </td>
                                    <td className="table-body-cell">
                                        {quiz.isPassed ? "Đạt" : "Không đạt"}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatTimeAdd7(quiz.submittedAt)}{" "}
                                        {formatDate(quiz.submittedAt)}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="pr-btn"
                                            onClick={() => {
                                                setSelectedQuiz(quiz);
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
                                    currentPage === 1 ? "disable-btn" : "sc-btn"
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

            {selectedQuiz && (
                <>
                    <div className="shsq-header">
                        <h3>Chi tiết bài làm</h3>
                        <button
                            className="sc-btn"
                            onClick={() => setSelectedQuiz(null)}
                        >
                            Quay lại
                        </button>
                    </div>

                    <div className="quiz-result">
                        <h2>Kết quả làm bài</h2>

                        <div className="summary">
                            <p>
                                Tổng số câu hỏi:{" "}
                                <strong>{selectedQuiz?.totalQuestions}</strong>
                            </p>
                            <p>
                                Số câu đúng:{" "}
                                <strong>{selectedQuiz?.correctAnswers}</strong>
                            </p>
                            <p>
                                Điểm:{" "}
                                <strong>
                                    {selectedQuiz?.scorePercentage}
                                </strong>
                            </p>
                            <p>
                                Trạng thái:{" "}
                                <strong
                                    className={
                                        selectedQuiz?.isPassed ? "pass" : "fail"
                                    }
                                >
                                    {selectedQuiz?.isPassed
                                        ? "Đạt"
                                        : "Không đạt"}
                                </strong>
                            </p>
                        </div>

                        <h3>Chi tiết từng câu</h3>

                        <div className="answer-list">
                            {selectedQuiz?.answerDetails.map(
                                (item: any, index: number) => (
                                    <div
                                        key={item.questionId}
                                        className={`answer-item ${
                                            item.isCorrect ? "correct" : "wrong"
                                        }`}
                                    >
                                        <h4>
                                            Câu {index + 1}: {item.questionText}
                                        </h4>

                                        <p>
                                            Bạn chọn:{" "}
                                            <strong className="selected">
                                                {item.selectedAnswer}
                                            </strong>
                                        </p>

                                        <p>
                                            Đáp án đúng:{" "}
                                            <strong className="correct-answer">
                                                {item.correctAnswer}
                                            </strong>
                                        </p>

                                        <p className="explanation">
                                            Giải thích: {item.explanation}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentHistorySubmitQuiz;
