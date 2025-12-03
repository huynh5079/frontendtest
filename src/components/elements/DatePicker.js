import { jsx as _jsx } from "react/jsx-runtime";
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("vi", vi);
const DatePickerElement = ({ value, onChange, placeholder = "Chọn ngày sinh của bạn", maxDate, }) => {
    return (_jsx(DatePicker, { selected: value, onChange: onChange, locale: "vi", dateFormat: "dd/MM/yyyy", placeholderText: placeholder, className: "form-input", showMonthDropdown: true, showYearDropdown: true, maxDate: maxDate, dropdownMode: "select" }));
};
export default DatePickerElement;
