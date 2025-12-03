import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaBookOpen, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { PriceRangeFilter } from "../../elements";
const subjects = {
    common: ["Toán", "Tiếng Anh"],
    elementary: ["Tiếng Việt"],
    middle: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
    high: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
};
const teachingForm = ["Trực tuyến", "Học tại lớp"];
const FilterCourse = () => {
    const [level, setLevel] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedForms, setSelectedForms] = useState([]);
    const handleLevelChange = (e) => {
        setLevel(e.target.value);
        setSelectedSubject(""); // reset môn khi đổi cấp
    };
    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject); // luôn ghi đè = chỉ chọn 1
    };
    const handleFormChange = (subject) => {
        setSelectedForms((prev) => prev.includes(subject)
            ? prev.filter((s) => s !== subject)
            : [...prev, subject]);
    };
    const renderRadioSubjects = (subject) => (_jsxs("label", { className: "block", children: [_jsx("input", { type: "radio", name: "subject", value: subject, checked: selectedSubject === subject, onChange: () => handleSubjectChange(subject), className: "mr-2" }), subject] }, subject));
    const renderCheckboxForms = (form) => (_jsxs("label", { className: "block", children: [_jsx("input", { type: "checkbox", value: form, checked: selectedForms.includes(form), onChange: () => handleFormChange(form), className: "mr-2" }), form] }, form));
    // Môn học cần hiển thị = chung + môn riêng theo cấp
    const subjectsToShow = [
        ...subjects.common,
        ...(level ? subjects[level] : []),
    ];
    return (_jsxs("div", { className: "filter-course-container", children: [_jsx("h3", { children: "B\u1ED9 l\u1ECDc" }), _jsx("div", { className: "fccr1", children: _jsx("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm t\u00EAn gia s\u01B0" }) }), _jsxs("div", { className: "fccr2", children: [_jsxs("h4", { children: [_jsx(FaGraduationCap, { className: "icon" }), "Tr\u00ECnh \u0111\u1ED9 gi\u1EA3ng d\u1EA1y"] }), _jsxs("select", { value: level, onChange: handleLevelChange, children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn b\u1EADc gi\u1EA3ng d\u1EA1y --" }), _jsx("option", { value: "elementary", children: "Ti\u1EC3u h\u1ECDc" }), _jsx("option", { value: "middle", children: "Trung h\u1ECDc c\u01A1 s\u1EDF" }), _jsx("option", { value: "high", children: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng" })] })] }), _jsxs("div", { className: "fccr3", children: [_jsxs("h4", { children: [_jsx(FaMapMarkerAlt, { className: "icon" }), "\u0110\u1ECBa \u0111i\u1EC3m"] }), _jsxs("select", { children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn t\u1EC9nh/th\u00E0nh ph\u1ED1 --" }), _jsx("option", { value: "TP H\u00E0 N\u1ED9i", children: "TP H\u00E0 N\u1ED9i" }), _jsx("option", { value: "TP Hu\u1EBF", children: "TP Hu\u1EBF" }), _jsx("option", { value: "TP \u0110\u00E0 N\u1EB5ng", children: "TP \u0110\u00E0 N\u1EB5ng" }), _jsx("option", { value: "TPHCM", children: "TPHCM" }), _jsx("option", { value: "C\u1EA7n Th\u01A1", children: "C\u1EA7n Th\u01A1" })] })] }), _jsxs("div", { className: "fccr4", children: [_jsxs("h4", { children: [_jsx(FaBookOpen, { className: "icon" }), "M\u00F4n h\u1ECDc"] }), subjectsToShow.map(renderRadioSubjects)] }), _jsxs("div", { className: "fccr5", children: [_jsxs("h4", { children: [_jsx(FaBookOpen, { className: "icon" }), "H\u00ECnh th\u1EE9c d\u1EA1y h\u1ECDc"] }), teachingForm.map(renderCheckboxForms)] }), _jsxs("div", { className: "fccr6", children: [_jsxs("h4", { children: [_jsx(FaBookOpen, { className: "icon" }), "Gi\u00E1 ti\u1EC1n"] }), _jsx(PriceRangeFilter, {})] }), _jsxs("div", { className: "fccr7", children: [_jsxs("h4", { children: [_jsx(FaGraduationCap, { className: "icon" }), "\u0110\u00E1nh gi\u00E1"] }), _jsxs("select", { children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn m\u1EE9c \u0111\u00E1nh gi\u00E1 --" }), _jsx("option", { value: "asc", children: "T\u1EEB th\u1EA5p \u0111\u1EBFn cao" }), _jsx("option", { value: "desc", children: "T\u1EEB cao \u0111\u1EBFn th\u1EA5p" })] })] }), _jsx("button", { className: "pr-btn", children: "L\u00E0m m\u1EDBi" })] }));
};
export default FilterCourse;
