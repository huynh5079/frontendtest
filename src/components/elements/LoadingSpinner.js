import { jsx as _jsx } from "react/jsx-runtime";
const LoadingSpinner = ({ size = 40, }) => {
    const style = {
        width: `${size}px`,
        height: `${size}px`,
    };
    return (_jsx("div", { className: "spinner-container", children: _jsx("div", { className: "spinner", style: style }) }));
};
export default LoadingSpinner;
