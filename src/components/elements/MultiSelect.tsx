import { useEffect, useState, type FC } from "react";
import Select, { type MultiValue } from "react-select";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import type { OptionMultiSelectData } from "../../types/app";

interface MultiSelectProps {
    label: string;
    placeholder?: string;
    options: OptionMultiSelectData[];
    value?: OptionMultiSelectData[];
    onChange?: (options: OptionMultiSelectData[]) => void;
}

const MultiSelect: FC<MultiSelectProps> = ({
    label,
    placeholder,
    options,
    onChange,
    value,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<
        MultiValue<OptionMultiSelectData>
    >([]);

    useEffect(() => {
        if (value) {
            setSelectedOptions(value);
        }
    }, [value]);

    const handleChange = (newValue: MultiValue<OptionMultiSelectData>) => {
        setSelectedOptions(newValue);
        if (onChange) {
            onChange(newValue as OptionMultiSelectData[]);
        }
    };

    return (
        <div className="form-field">
            <label className="form-label">{label}</label>
            <div className="form-input-container">
                <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                <Select<OptionMultiSelectData, true>
                    isMulti
                    options={options}
                    value={selectedOptions}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="form-input"
                    styles={{
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
                    }}
                />
            </div>
        </div>
    );
};

export default MultiSelect;
