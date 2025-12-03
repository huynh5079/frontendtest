import { type FC } from "react";
import "react-datepicker/dist/react-datepicker.css";
interface VietnameseDatePickerProps {
    value?: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    maxDate?: Date;
}
declare const DatePickerElement: FC<VietnameseDatePickerProps>;
export default DatePickerElement;
