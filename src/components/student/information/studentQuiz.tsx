import { FC, useEffect, useMemo, useState } from "react";
import { selectListQuizForStudent } from "../../../app/selector";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    doQuizForStudentApiThunk,
    getAllQuizForStudentApiThunk,
} from "../../../services/student/quiz/studentQuizThunk";
import { Homework } from "../../../assets/images";
import {
    formatDate,
    formatTimeAdd7,
    getQuizTypeText,
} from "../../../utils/helper";
import { get } from "lodash";
import { toast } from "react-toastify";
import StudentDoQuiz from "./studentDoQuiz";
import StudentResultQuiz from "./studentResultQuiz";
import StudentHistorySubmitQuiz from "./studentHistorySubmitQuiz";

interface StudentManageQuizProps {
    lessonId: string;
}

const ITEMS_PER_PAGE = 6;

const StudentManageQuiz: FC<StudentManageQuizProps> = ({ lessonId }) => {
    const dispatch = useAppDispatch();
    const quizes = useAppSelector(selectListQuizForStudent);

    const [section, setSection] = useState("list");
    const [quizId, setQuizId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Tổng số trang ---
    const totalPages = Math.ceil(quizes?.length! / ITEMS_PER_PAGE);

    // --- Lấy dữ liệu theo trang ---
    const paginatedQuizes = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return quizes?.slice(start, start + ITEMS_PER_PAGE);
    }, [quizes, currentPage]);

    useEffect(() => {
        if (section === "list") {
            dispatch(getAllQuizForStudentApiThunk(lessonId));
        }
    }, [dispatch, section]);

    const handleDoQuiz = async (quizId: string) => {
        dispatch(doQuizForStudentApiThunk(quizId))
            .unwrap()
            .then(() => {
                toast.success("Bắt đầu làm bài");
                setSection("do");
            })
            .catch((error) => {
                toast.error(get(error, "message", "Có lỗi xảy ra"));
            });
    };

    return (
        <div className="tutor-quiz">
            {section === "list" && (
                <>
                    <h3 className="quiz-title">Danh sách bài tập</h3>

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
                                    {paginatedQuizes?.length! > 0 ? (
                                        paginatedQuizes?.map((quiz) => (
                                            <tr
                                                className="table-body-row"
                                                key={quiz.id}
                                            >
                                                <td className="table-body-cell">
                                                    {quiz.title}
                                                </td>
                                                <td className="table-body-cell">
                                                    {getQuizTypeText(
                                                        quiz.quizType,
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatTimeAdd7(
                                                        quiz.createdAt,
                                                    )}{" "}
                                                    {formatDate(quiz.createdAt)}
                                                </td>
                                                <td className="table-body-cell">
                                                    <button
                                                        className="pr-btn"
                                                        onClick={() => {
                                                            handleDoQuiz(
                                                                quiz.id,
                                                            );
                                                        }}
                                                    >
                                                        Làm bài
                                                    </button>
                                                    <button
                                                        className="sc-btn"
                                                        onClick={() => {
                                                            setSection(
                                                                "history",
                                                            );
                                                            setQuizId(quiz.id);
                                                        }}
                                                    >
                                                        Lịch sử làm bài
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="table-body-cell no-data"
                                            >
                                                Không có bài tập nào
                                            </td>
                                        </tr>
                                    )}
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
            {section === "do" && <StudentDoQuiz setSection={setSection} />}
            {section === "result" && <StudentResultQuiz />}
            {section === "history" && (
                <StudentHistorySubmitQuiz
                    quizId={quizId}
                    setSection={setSection}
                />
            )}
        </div>
    );
};

export default StudentManageQuiz;
