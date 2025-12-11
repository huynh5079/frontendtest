import { FC } from "react";
import { useAppSelector } from "../../../app/store";
import { selectResultQuizForStudent } from "../../../app/selector";

const StudentResultQuiz: FC = () => {
    const result = useAppSelector(selectResultQuizForStudent);
    return (
        <div className="quiz-result">
            <h2>Kết quả làm bài</h2>

            <div className="summary">
                <p>
                    Tổng số câu hỏi: <strong>{result?.totalQuestions}</strong>
                </p>
                <p>
                    Số câu đúng: <strong>{result?.correctAnswers}</strong>
                </p>
                <p>
                    Điểm: <strong>{result?.scorePercentage}%</strong>
                </p>
                <p>
                    Trạng thái:{" "}
                    <strong className={result?.isPassed ? "pass" : "fail"}>
                        {result?.isPassed ? "Đạt" : "Không đạt"}
                    </strong>
                </p>
            </div>

            <h3>Chi tiết từng câu</h3>

            <div className="answer-list">
                {result?.answerDetails.map((item: any, index: number) => (
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

                        {!item.isCorrect && (
                            <p className="explanation">
                                Giải thích: {item.explanation}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentResultQuiz;
