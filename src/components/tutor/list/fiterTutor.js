import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaBookOpen, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { PriceRangeFilter } from "../../elements";
import TutorLocationSelector from "./LocationSelect";
const subjects = {
    common: ["Toán", "Tiếng Anh"],
    elementary: ["Tiếng Việt"],
    middle: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
    high: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
};
const teachingForm = ["Trực tuyến", "Trực tiếp", "Dạy kèm"];
const gradesByLevel = {
    elementary: ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"],
    middle: ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
    high: ["Lớp 10", "Lớp 11", "Lớp 12"],
};
const FilterTutor = () => {
    const [level, setLevel] = useState("");
    const [grade, setGrade] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const handleLevelChange = (e) => {
        setLevel(e.target.value);
        setGrade(""); // reset grade khi đổi cấp
        setSelectedSubjects([]); // reset môn học khi đổi cấp
    };
    const handleGradeChange = (e) => {
        setGrade(e.target.value);
    };
    const handleSubjectChange = (subject) => {
        setSelectedSubjects((prev) => prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]);
    };
    const handleFormChange = (subject) => {
        setSelectedForms((prev) => prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]);
    };
    const renderCheckboxSubjects = (subject) => (_jsxs("label", { className: "block", children: [_jsx("input", { type: "checkbox", value: subject, checked: selectedSubjects.includes(subject), onChange: () => handleSubjectChange(subject), className: "mr-2" }), subject] }, subject));
    const renderCheckboxForms = (form) => (_jsxs("label", { className: "block", children: [_jsx("input", { type: "checkbox", value: form, checked: selectedForms.includes(form), onChange: () => handleFormChange(form), className: "mr-2" }), form] }, form));
    // Môn học cần hiển thị = chung + môn riêng theo cấp
    const subjectsToShow = [
        ...subjects.common,
        ...(level ? subjects[level] : []),
    ];
    return (_jsxs("div", { className: "filter-tutor-container", children: [_jsx("h3", { children: "B\u1ED9 l\u1ECDc gia s\u01B0" }), _jsx("div", { className: "ftcr1", children: _jsx("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm t\u00EAn gia s\u01B0" }) }), _jsxs("div", { className: "ftcr2", children: [_jsxs("h4", { children: [_jsx(FaGraduationCap, { className: "icon" }), "Tr\u00ECnh \u0111\u1ED9 gi\u1EA3ng d\u1EA1y"] }), _jsxs("select", { value: level, onChange: handleLevelChange, children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn b\u1EADc gi\u1EA3ng d\u1EA1y --" }), _jsx("option", { value: "elementary", children: "Ti\u1EC3u h\u1ECDc" }), _jsx("option", { value: "middle", children: "Trung h\u1ECDc c\u01A1 s\u1EDF" }), _jsx("option", { value: "high", children: "Trung h\u1ECDc ph\u1ED5 th\u00F4ng" })] })] }), level && (_jsxs("div", { className: "ftcr2", children: [_jsxs("h4", { children: [_jsx(FaGraduationCap, { className: "icon" }), "L\u1EDBp h\u1ECDc"] }), _jsxs("select", { value: grade, onChange: handleGradeChange, children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn l\u1EDBp --" }), gradesByLevel[level]?.map((g) => (_jsx("option", { value: g, children: g }, g)))] })] })), _jsxs("div", { className: "ftcr3", children: [_jsxs("h4", { children: [_jsx(FaMapMarkerAlt, { className: "icon" }), "\u0110\u1ECBa \u0111i\u1EC3m"] }), _jsx(TutorLocationSelector, {})] }), _jsxs("div", { className: "ftcr4", children: [_jsxs("h4", { children: [_jsx(FaBookOpen, { className: "icon" }), "M\u00F4n h\u1ECDc"] }), subjectsToShow.map(renderCheckboxSubjects)] }), _jsxs("div", { className: "ftcr5", children: [_jsxs("h4", { children: [_jsx(FaBookOpen, { className: "icon" }), "H\u00ECnh th\u1EE9c d\u1EA1y h\u1ECDc"] }), teachingForm.map(renderCheckboxForms)] }), _jsxs("div", { className: "ftcr6", children: [_jsxs("h4", { children: [_jsx(FaBookOpen, { className: "icon" }), "Gi\u00E1 ti\u1EC1n"] }), _jsx(PriceRangeFilter, {})] }), _jsxs("div", { className: "ftcr7", children: [_jsxs("h4", { children: [_jsx(FaGraduationCap, { className: "icon" }), "\u0110\u00E1nh gi\u00E1"] }), _jsxs("select", { children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn m\u1EE9c \u0111\u00E1nh gi\u00E1 --" }), _jsx("option", { value: "asc", children: "T\u1EEB th\u1EA5p \u0111\u1EBFn cao" }), _jsx("option", { value: "desc", children: "T\u1EEB cao \u0111\u1EBFn th\u1EA5p" })] })] }), _jsx("button", { className: "pr-btn", children: "L\u00E0m m\u1EDBi" })] }));
};
export default FilterTutor;
