import { FC, useState } from "react";
import { GetDetailQuizForTutor, QuizQuestion } from "../../../../types/tutor";
import { getQuizTypeText } from "../../../../utils/helper";
import { UpdateQuestionModal } from "../../../modal";

interface TutorDetailQuizProps {
    quiz: GetDetailQuizForTutor;
    setSection: (section: string) => void;
}

const calculateRequiredCorrectAnswers = (
    totalQuestions: number,
    passingScore: number
): number => {
    return Math.ceil((totalQuestions * passingScore) / 100);
};

const getAvailableOptions = (question: any) => {
    const options = [
        { key: "A", value: question.optionA },
        { key: "B", value: question.optionB },
        { key: "C", value: question.optionC },
        { key: "D", value: question.optionD },
    ];

    // Lọc ra những option có giá trị (không null, không undefined, không rỗng)
    return options.filter((opt) => opt.value != null && opt.value !== "");
};

const TutorDetailQuiz: FC<TutorDetailQuizProps> = ({ quiz, setSection }) => {
    const [isUpdateQuestionOpen, setIsUpdateQuestionOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] =
        useState<QuizQuestion | null>(null);

    const handleUpdateQuestion = (question: QuizQuestion) => {
        setSelectedQuestion(question);
        setIsUpdateQuestionOpen(true);
    };

    return (
        <div className="detail-quiz">
            <button className="sc-btn" onClick={() => setSection("list")}>
                Quay lại
            </button>
            <div className="detail-group">
                <h3 className="group-title">Thông tin bài tập</h3>
                <div className="group-content">
                    <div className="detail-item">
                        <h4>Chủ đề</h4>
                        <p>{quiz?.title}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Mô tả</h4>
                        <p>{quiz?.description}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Thời gian làm bài</h4>
                        <p>{quiz?.timeLimit} phút</p>
                    </div>
                    <div className="detail-item">
                        <h4>Loại bài tập</h4>
                        <p>{getQuizTypeText(quiz?.quizType)}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Số câu cần để đạt</h4>
                        <p>
                            {calculateRequiredCorrectAnswers(
                                quiz?.questions?.length,
                                quiz?.passingScore
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="detail-group">
                <h3 className="group-title">
                    Câu hỏi ( {quiz?.questions?.length} câu hỏi )
                </h3>
                <div className="group-content">
                    {quiz?.questions?.map((question) => (
                        <div key={question?.id} className="detail-item">
                            <h4>
                                Câu hỏi {question?.orderIndex}:{" "}
                                {question.questionText}
                            </h4>

                            <div className="detail-answer">
                                {getAvailableOptions(question).map((opt) => (
                                    <p className="answer-index" key={opt.key}>
                                        {opt.key}:{" "}
                                        <span className="answer-content">
                                            {opt.value}
                                        </span>
                                    </p>
                                ))}
                            </div>

                            <p>
                                Câu trả lời đúng: {question.correctAnswer} (Giải
                                thích: {question.explanation} )
                            </p>

                            <button
                                className="sc-btn"
                                onClick={() => handleUpdateQuestion(question)}
                            >
                                Chỉnh sửa
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <UpdateQuestionModal
                question={selectedQuestion!}
                quizId={quiz?.id!}
                isOpen={isUpdateQuestionOpen}
                setIsOpen={setIsUpdateQuestionOpen}
            />
        </div>
    );
};

export default TutorDetailQuiz;
