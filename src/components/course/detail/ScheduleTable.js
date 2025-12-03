import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const shifts = [
    { name: "Sáng", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Chiều", slots: ["Slot 1", "Slot 2", "Slot 3"] },
    { name: "Tối", slots: ["Slot 1", "Slot 2", "Slot 3"] },
];
const ScheduleTable = () => {
    const [selected, setSelected] = useState({});
    const toggleSlot = (day, shift, slot) => {
        const key = `${day}-${shift}-${slot}`;
        setSelected((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    return (_jsx("div", { className: "schedule-wrapper", children: _jsxs("table", { className: "schedule-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Ca" }), _jsx("th", { children: "Slot" }), days.map((day) => (_jsx("th", { children: day }, day)))] }) }), _jsx("tbody", { children: shifts.map((shift) => shift.slots.map((slot, i) => (_jsxs("tr", { children: [i === 0 && _jsx("td", { rowSpan: shift.slots.length, children: shift.name }), _jsx("td", { children: slot }), days.map((day) => {
                                const key = `${day}-${shift.name}-${slot}`;
                                const isSelected = selected[key];
                                return (_jsx("td", { className: `slot-cell ${isSelected ? "selected" : ""}`, onClick: () => toggleSlot(day, shift.name, slot), children: isSelected ? "✓" : "" }, key));
                            })] }, `${shift.name}-${slot}`)))) })] }) }));
};
export default ScheduleTable;
