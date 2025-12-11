import { type FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimePickerProps {
    value?: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
}

const TimePickerElement: FC<TimePickerProps> = ({
    value,
    onChange,
    placeholder = "Chọn giờ",
}) => {
    return (
        <DatePicker
            selected={value}
            onChange={onChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Giờ"
            dateFormat="HH:mm"
            placeholderText={placeholder}
            className="form-input"
        />
    );
};

export default TimePickerElement;
