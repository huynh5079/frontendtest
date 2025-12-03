import { useState, type ChangeEvent, type FC } from "react";

const PriceRangeFilter: FC = () => {
    const minLimit = 50000;
    const maxLimit = 1000000;
    const step = 5000;

    const [minValue, setMinValue] = useState<number>(200000);
    const [maxValue, setMaxValue] = useState<number>(800000);

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxValue - step);
        setMinValue(value);
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minValue + step);
        setMaxValue(value);
    };

    return (
        <div className="price-slider">
            <div className="slider-container">
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
            </div>

            <div className="price-values">
                <span>{minValue.toLocaleString()} đ</span>
                <span>{maxValue.toLocaleString()} đ</span>
            </div>
        </div>
    );
};

export default PriceRangeFilter;
