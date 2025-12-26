import { useEffect, useState, type FC } from "react";
import { useDocumentTitle } from "../../../utils/helper";
import {
    MdAttachMoney,
    MdClass,
    MdGroups,
    MdPersonAddAlt1,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
    selectTutorMonthlyIncome,
    selectTutorMonthlyLessons,
    selectTutorTotalStatistics,
} from "../../../app/selector";
import {
    getTutorMonthlyIncomeApiThunk,
    getTutorMonthlyLessonsApiThunk,
    getTutorTotalStatsApiThunk,
} from "../../../services/tutor/dashboard/tutorDashboardThunk";
import { IncomeLineChart, LessonLineChart } from "../../../components/elements";

const TutorDashboardPage: FC = () => {
    const dispatch = useAppDispatch();
    const totalStats = useAppSelector(selectTutorTotalStatistics);
    const monthlyIncome = useAppSelector(selectTutorMonthlyIncome);
    const monthlyLessons = useAppSelector(selectTutorMonthlyLessons);

    const [year, setYear] = useState<string>(
        new Date().getFullYear().toString(),
    );

    useEffect(() => {
        dispatch(getTutorTotalStatsApiThunk());
        dispatch(getTutorMonthlyIncomeApiThunk(year));
        dispatch(getTutorMonthlyLessonsApiThunk(year));
    }, [dispatch]);

    useDocumentTitle("Trang tổng quát");

    return (
        <section id="tutor-dashboard-section">
            <div className="tds-container">
                <div className="tdscr1">
                    <div className="tdscr1-item">
                        <div className="tdscr1-item-figure figure-1">
                            <MdClass className="tdscr1-item-icon" />
                        </div>
                        <p className="tdscr1-item-title">Tổng lớp đang dạy</p>
                        <h5 className="tdscr1-item-count">
                            {totalStats?.totalActiveClasses || 0}
                        </h5>
                        <button className="pr-btn">Xem</button>
                    </div>
                    <div className="tdscr1-item">
                        <div className="tdscr1-item-figure 2">
                            <MdGroups className="tdscr1-item-icon" />
                        </div>
                        <p className="tdscr1-item-title">
                            Tổng học sinh đang dạy
                        </p>
                        <h5 className="tdscr1-item-count">
                            {totalStats?.totalStudents || 0}
                        </h5>
                        <button className="pr-btn">Xem</button>
                    </div>
                    <div className="tdscr1-item">
                        <div className="tdscr1-item-figure 3">
                            <MdAttachMoney className="tdscr1-item-icon" />
                        </div>
                        <p className="tdscr1-item-title">
                            Tổng thu nhập trong tháng
                        </p>
                        <h5 className="tdscr1-item-count">
                            {totalStats?.monthlyIncome || 0}
                        </h5>
                        <button className="pr-btn">Xem</button>
                    </div>
                    <div className="tdscr1-item">
                        <div className="tdscr1-item-figure 4">
                            <MdPersonAddAlt1 className="tdscr1-item-icon" />
                        </div>
                        <p className="tdscr1-item-title">
                            Tổng học sinh mới trong tháng
                        </p>
                        <h5 className="tdscr1-item-count">
                            {totalStats?.newStudentsThisMonth || 0}
                        </h5>
                        <button className="pr-btn">Xem</button>
                    </div>
                </div>
                <div className="tdscr2">
                    <h3>Thu nhập hàng tháng trong năm {year}</h3>
                    <IncomeLineChart
                        year={year}
                        totalIncome={monthlyIncome?.totalIncome || 0}
                        monthlyData={monthlyIncome?.monthlyData || []}
                    />
                </div>
                <div className="tdscr2">
                    <h3>Số buổi dạy hàng tháng trong năm {year}</h3>
                    <LessonLineChart
                        year={year}
                        totalLessons={monthlyLessons?.totalLessons || 0}
                        monthlyData={monthlyLessons?.monthlyData || []}
                    />
                </div>
            </div>
        </section>
    );
};

export default TutorDashboardPage;
