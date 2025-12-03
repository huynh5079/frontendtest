import { type FC } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("vi", vi);

interface VietnameseDatePickerProps {
    value?: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    maxDate?: Date;
}

const DatePickerElement: FC<VietnameseDatePickerProps> = ({
    value,
    onChange,
    placeholder = "Chọn ngày sinh của bạn",
    maxDate,
}) => {
    return (
        <DatePicker
            selected={value}
            onChange={onChange}
            locale="vi"
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder}
            className="form-input"
            showMonthDropdown
            showYearDropdown
            maxDate={maxDate}
            dropdownMode="select"
        />
    );
};

export default DatePickerElement;
