import { jsx as _jsx } from "react/jsx-runtime";
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("vi", vi);
const DateTimePickerElement = ({ value, onChange, placeholder = "Chọn ngày sinh của bạn", maxDate, }) => {
    return (_jsx(DatePicker, { showTimeSelect: true, timeFormat: "HH:mm", timeIntervals: 15, dateFormat: "dd/MM/yyyy HH:mm", selected: value, onChange: onChange, locale: "vi", placeholderText: placeholder, className: "form-input", showMonthDropdown: true, showYearDropdown: true, maxDate: maxDate, dropdownMode: "select" }));
};
export default DateTimePickerElement;
