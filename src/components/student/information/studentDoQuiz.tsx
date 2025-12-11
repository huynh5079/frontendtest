import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectDetailQuizForStudent } from "../../../app/selector";
import { submitQuizForStudentApiThunk } from "../../../services/student/quiz/studentQuizThunk";
import { get } from "lodash";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../elements";

interface StudentDoQuizProps {
    setSection: (section: string) => void;
}

const StudentDoQuiz: FC<StudentDoQuizProps> = ({ setSection }) => {
    const dispatch = useAppDispatch();
    const quiz = useAppSelector(selectDetailQuizForStudent);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit! * 60 || 0);
    const [showWarning, setShowWarning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Timer ---
    useEffect(() => {
        if (!timeLeft) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    const currentQuestion = quiz?.questions?.[currentQuestionIndex];

    const handleSelectAnswer = (questionId: string, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = () => {
        const unanswered = quiz?.questions.filter((q) => !answers[q.id]);

        if (unanswered?.length! > 0) {
            setShowWarning(true);
            return;
        }

        // Nếu đầy đủ thì submit
        const payload = {
            quizId: quiz?.id!,
            answers: Object.keys(answers).map((questionId) => ({
                questionId,
                selectedAnswer: answers[questionId],
            })),
        };

        setIsSubmitting(true);
        dispatch(submitQuizForStudentApiThunk(payload))
            .unwrap()
            .then((res) => {
                const message = get(res, "message", "Nộp bài thành công");
                toast.success(message);
                setSection("result");
            })
            .catch((error) => {
                toast.error(get(error, "message", "Có lỗi xảy ra"));
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="do-quiz">
            {/* Sidebar */}
            <div className="sidebar">
                <h3>Câu hỏi</h3>
                <div className="question-list">
                    {quiz?.questions.map((q, index) => (
                        <div
                            key={q.id}
                            className={`question-item ${
                                currentQuestionIndex === index ? "active" : ""
                            } ${answers[q.id] ? "answered" : ""}`}
                            onClick={() => setCurrentQuestionIndex(index)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                <div className="timer">
                    Thời gian: <strong>{formatTime(timeLeft)}</strong>
                </div>

                <button
                    className={isSubmitting ? "disable-btn" : "pr-btn"}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? <LoadingSpinner /> : "Nộp bài"}
                </button>
                {showWarning && (
                    <p className="warning-msg">
                        Bạn còn{" "}
                        {quiz?.questions?.length! - Object.keys(answers).length}{" "}
                        câu chưa làm!
                    </p>
                )}
            </div>

            {/* Main content */}
            <div className="question-content">
                <h3>
                    Câu {currentQuestionIndex + 1}:{" "}
                    {currentQuestion?.questionText}
                </h3>

                <div className="options">
                    {["A", "B", "C", "D"].map((opt) => {
                        const key = "option" + opt;
                        const text =
                            currentQuestion?.[
                                key as keyof typeof currentQuestion
                            ];

                        return (
                            <div
                                key={opt}
                                className={`option ${
                                    answers[currentQuestion?.id!] === opt
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleSelectAnswer(
                                        currentQuestion?.id!,
                                        opt,
                                    )
                                }
                            >
                                <span className="option-key">{opt}.</span>{" "}
                                {text}
                            </div>
                        );
                    })}
                </div>

                <div className="navigation">
                    <button
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                            setCurrentQuestionIndex((prev) => prev - 1)
                        }
                    >
                        Câu trước
                    </button>

                    <button
                        disabled={
                            currentQuestionIndex + 1 === quiz?.questions?.length
                        }
                        onClick={() =>
                            setCurrentQuestionIndex((prev) => prev + 1)
                        }
                    >
                        Câu sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDoQuiz;
