import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Select from "react-select";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
const MultiSelect = ({ label, placeholder, options, onChange, value, }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    useEffect(() => {
        if (value) {
            setSelectedOptions(value);
        }
    }, [value]);
    const handleChange = (newValue) => {
        setSelectedOptions(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };
    return (_jsxs("div", { className: "form-field", children: [_jsx("label", { className: "form-label", children: label }), _jsxs("div", { className: "form-input-container", children: [_jsx(MdOutlineDriveFileRenameOutline, { className: "form-input-icon" }), _jsx(Select, { isMulti: true, options: options, value: selectedOptions, onChange: handleChange, placeholder: placeholder, className: "form-input", styles: {
                            control: (base) => ({
                                ...base,
                                backgroundColor: "transparent",
                                border: "none",
                                boxShadow: "none",
                                minHeight: "unset",
                            }),
                            input: (base) => ({
                                ...base,
                                margin: 0,
                                padding: 0,
                            }),
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#008d521a",
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: "inherit",
                            }),
                        } })] })] }));
};
export default MultiSelect;
