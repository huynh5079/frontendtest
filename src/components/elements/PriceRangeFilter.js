import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const PriceRangeFilter = () => {
    const minLimit = 50000;
    const maxLimit = 1000000;
    const step = 5000;
    const [minValue, setMinValue] = useState(200000);
    const [maxValue, setMaxValue] = useState(800000);
    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxValue - step);
        setMinValue(value);
    };
    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minValue + step);
        setMaxValue(value);
    };
    return (_jsxs("div", { className: "price-slider", children: [_jsxs("div", { className: "slider-container", children: [_jsx("input", { type: "range", min: minLimit, max: maxLimit, step: step, value: minValue, onChange: handleMinChange, className: "thumb thumb-left" }), _jsx("input", { type: "range", min: minLimit, max: maxLimit, step: step, value: maxValue, onChange: handleMaxChange, className: "thumb thumb-right" }), _jsx("div", { className: "slider-track" }), _jsx("div", { className: "slider-range", style: {
                            left: `${((minValue - minLimit) / (maxLimit - minLimit)) *
                                100}%`,
                            right: `${100 -
                                ((maxValue - minLimit) / (maxLimit - minLimit)) *
                                    100}%`,
                        } })] }), _jsxs("div", { className: "price-values", children: [_jsxs("span", { children: [minValue.toLocaleString(), " \u0111"] }), _jsxs("span", { children: [maxValue.toLocaleString(), " \u0111"] })] })] }));
};
export default PriceRangeFilter;
