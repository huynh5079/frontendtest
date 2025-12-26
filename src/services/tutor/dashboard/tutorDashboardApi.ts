import request from "../../request"

export const getTutorTotalStatsApi = async () => {
    const data = await request.get("/tutor/dashboard")
    return data.data;
}

export const getTutorMonthlyIncomeApi = async (year: string) => {
    const data = await request.get(`/tutor/dashboard/income?year=${year}`)
    return data.data;
}

export const getTutorMonthlyLessonsApi = async (year: string) => {
    const data = await request.get(`/tutor/dashboard/lessons?year=${year}`)
    return data.data;
}