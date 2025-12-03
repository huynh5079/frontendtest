import type { CSSProperties, FC } from "react";

interface LoadingSpinnerProps {
    size?: number; // pixel
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
    size = 40,
}) => {
    const style: CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
    };

    return (
        <div className="spinner-container">
            <div className="spinner" style={style}></div>
        </div>
    );
};

export default LoadingSpinner;
