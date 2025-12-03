import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
const OTPInput = ({ onChange }) => {
    const length = 6;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputsRef = useRef([]);
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value))
            return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));
        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };
    return (_jsx("div", { className: "otp-container", children: otp.map((digit, index) => (_jsx("input", { ref: (el) => {
                inputsRef.current[index] = el;
            }, type: "text", maxLength: 1, value: digit, onChange: (e) => handleChange(e, index), onKeyDown: (e) => handleKeyDown(e, index), className: "otp-input" }, index))) }));
};
export default OTPInput;
