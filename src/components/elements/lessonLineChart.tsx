import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

interface LessonLineChartProps {
    year: string;
    totalLessons: number;
    monthlyData: {
        month: number;
        lessonCount: number;
    }[];
}

const LessonLineChart: React.FC<LessonLineChartProps> = ({
    year,
    totalLessons,
    monthlyData,
}) => {
    const labels = monthlyData.map((item) => `Tháng ${item.month}`);
    const values = monthlyData.map((item) => item.lessonCount);

    return (
        <div>
            <Line
                data={{
                    labels,
                    datasets: [
                        {
                            label: "Số buổi học",
                            data: values,
                            borderWidth: 2,
                            tension: 0.4,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (ctx: any) => `${ctx.parsed.y} buổi`,
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Số buổi học",
                            },
                            ticks: {
                                stepSize: 1,
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Tháng",
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default LessonLineChart;
