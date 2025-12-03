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

const DateTimePickerElement: FC<VietnameseDatePickerProps> = ({
    value,
    onChange,
    placeholder = "Chọn ngày sinh của bạn",
    maxDate,
}) => {
    return (
        <DatePicker
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            selected={value}
            onChange={onChange}
            locale="vi"
            placeholderText={placeholder}
            className="form-input"
            showMonthDropdown
            showYearDropdown
            maxDate={maxDate}
            dropdownMode="select"
        />
    );
};

export default DateTimePickerElement;
