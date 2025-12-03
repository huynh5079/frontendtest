import type { FC } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { PieChartData } from "../../types/app";


interface PieChartStatProps {
    data: PieChartData[];
}

const COLORS = ["#4CAF50", "#F44336", "#FFC107"];

const PieChartStat: FC<PieChartStatProps> = ({ data }) => {
    return (
        <div className="pie-chart">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartStat;
