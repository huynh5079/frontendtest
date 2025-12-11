import { useState, type ChangeEvent, type FC } from "react";

interface PriceRangeFilterProps {
    minValue: number;
    maxValue: number;
    onChange: (min: number, max: number) => void;
}

const PriceRangeFilter: FC<PriceRangeFilterProps> = ({
    minValue,
    maxValue,
    onChange,
}) => {
    const minLimit = 50000;
    const maxLimit = 1000000;
    const step = 5000;

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxValue - step);
        onChange(value, maxValue);
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minValue + step);
        onChange(minValue, value);
    };

    return (
        <div className="price-slider">
            <div className="slider-container">
                <div className="slider-track"></div>
                <div
                    className="slider-range"
                    style={{
                        left: `${
                            ((minValue - minLimit) / (maxLimit - minLimit)) *
                            100
                        }%`,
                        right: `${
                            100 -
                            ((maxValue - minLimit) / (maxLimit - minLimit)) *
                                100
                        }%`,
                    }}
                ></div>
                <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                    className="thumb thumb-left"
                />
                <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="thumb thumb-right"
                />
            </div>

            <div className="price-values">
                <span>{minValue.toLocaleString()} đ</span>
                <span>{maxValue.toLocaleString()} đ</span>
            </div>
        </div>
    );
};

export default PriceRangeFilter;
