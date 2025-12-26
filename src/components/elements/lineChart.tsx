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

interface IncomeLineChartProps {
    year: string;
    totalIncome: number;
    monthlyData: {
        month: number;
        amount: number;
    }[];
}

const IncomeLineChart: React.FC<IncomeLineChartProps> = ({
    year,
    totalIncome,
    monthlyData,
}) => {
    const labels = monthlyData.map((item) => `Tháng ${item.month}`);
    const dataValues = monthlyData.map((item) => item.amount);

    const data = {
        labels,
        datasets: [
            {
                label: `Thu nhập năm ${year}`,
                data: dataValues,
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            tooltip: {
                callbacks: {
                    label: (ctx: any) =>
                        ` ${ctx.parsed.y.toLocaleString()} VNĐ`,
                },
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Thu nhập (VNĐ)",
                },
            },

            x: {
                title: {
                    display: true,
                    text: "Tháng",
                },
            },
        },
    };

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

export default IncomeLineChart;
