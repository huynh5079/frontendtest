import { SubmitQuizForStudentParams } from "../../../types/student";
import request from "../../request";

export const getAllQuizForStudentApi = async (lessonId: string) => {
    const data = await request.get(`/quiz/lesson/${lessonId}`);
    return data.data;
};

export const doQuizForStudentApi = async (quizId: string) => {
    const data = await request.post(`/quiz/${quizId}/start`);
    return data.data;
};

export const submitQuizForStudentApi = async (
    params: SubmitQuizForStudentParams,
) => {
    const data = await request.post(`/quiz/submit`, params);
    return data.data;
};

export const getAllHistorySubmitQuizForStudentApi = async (quizId: string) => {
    const data = await request.get(`/quiz/${quizId}/attempts`);
    return data.data;
};
