import { CreateQuizForTutorParams } from "../../../types/tutor";
import request from "../../request";

export const createQuizForTutorApi = async (formData: FormData) => {
    const data = await request.post(`/quiz/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data.data;
};

export const getAllQuizForTutorApi = async (lessonId: string) => {
    const data = await request.get(`/quiz/lesson/${lessonId}`);
    return data.data;
};

export const getDetailQuizForTutorApi = async (quizId: string) => {
    const data = await request.get(`/quiz/${quizId}`);
    return data.data;
};

export const updateQuizQuestionForTutorApi = async (
    questionId: string,
    formData: FormData
) => {
    const data = await request.put(`/quiz/question/${questionId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data.data;
};
