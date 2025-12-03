import { useState, type FC } from "react";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const shifts = [
    { name: "Sáng", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Chiều", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Tối", slots: ["Slot 1", "Slot 2", "Slot 3"] },
];

type SelectedSlot = {
    [key: string]: boolean;
};

const ScheduleTable: FC = () => {
    const [selected, setSelected] = useState<SelectedSlot>({});

    const toggleSlot = (day: string, shift: string, slot: string) => {
        const key = `${day}-${shift}-${slot}`;
        setSelected((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="schedule-wrapper">
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Ca</th>
                        <th>Slot</th>
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {shifts.map((shift) =>
                        shift.slots.map((slot, i) => (
                            <tr key={`${shift.name}-${slot}`}>
                                {i === 0 && <td rowSpan={shift.slots.length}>{shift.name}</td>}
                                <td>{slot}</td>
                                {days.map((day) => {
                                    const key = `${day}-${shift.name}-${slot}`;
                                    const isSelected = selected[key];
                                    return (
                                        <td
                                            key={key}
                                            className={`slot-cell ${isSelected ? "selected" : ""}`}
                                            onClick={() => toggleSlot(day, shift.name, slot)}
                                        >
                                            {isSelected ? "✓" : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;
