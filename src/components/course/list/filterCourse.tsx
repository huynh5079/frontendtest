import { type FC, useState, useEffect } from "react";
import { FaBookOpen, FaGraduationCap } from "react-icons/fa";
import { PriceRangeFilter } from "../../elements";

const subjects = {
    common: ["Toán", "Tiếng Anh"],
    elementary: ["Tiếng Việt"],
    middle: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
    high: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
};

const teachingForm = ["Trực tuyến", "Học tại lớp"];

interface FilterCourseProps {
    onFilterChange: (filters: {
        titleSearch: string;
        educationLevel: string;
        subject: string;
        modes: string[];
        minPrice: number;
        maxPrice: number;
    }) => void;
}

const FilterCourse: FC<FilterCourseProps> = ({ onFilterChange }) => {
    const [titleSearch, setTitleSearch] = useState(""); // tìm theo title lớp
    const [educationLevel, setEducationLevel] = useState("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedModes, setSelectedModes] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number>(200000);
    const [maxPrice, setMaxPrice] = useState<number>(800000);

    useEffect(() => {
        onFilterChange({
            titleSearch,
            educationLevel,
            subject: selectedSubject,
            modes: selectedModes,
            minPrice,
            maxPrice,
        });
    }, [
        titleSearch,
        educationLevel,
        selectedSubject,
        selectedModes,
        minPrice,
        maxPrice,
    ]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEducationLevel(e.target.value);
        setSelectedSubject("");
    };

    const handleSubjectChange = (subject: string) =>
        setSelectedSubject(subject);

    const handleModeChange = (mode: string) => {
        setSelectedModes((prev) =>
            prev.includes(mode)
                ? prev.filter((m) => m !== mode)
                : [...prev, mode],
        );
    };

    // Môn học hiển thị dựa trên level
    const levelMap: Record<string, keyof typeof subjects> = {
        "Tiểu học": "elementary",
        "Trung học cơ sở": "middle",
        "Trung học phổ thông": "high",
    };

    const levelSubjects: string[] =
        educationLevel && subjects[levelMap[educationLevel]]
            ? subjects[levelMap[educationLevel]]
            : [];

    const subjectsToShow = [...subjects.common, ...levelSubjects];

    return (
        <div className="filter-course-container">
            <h3>Bộ lọc</h3>

            {/* Tìm kiếm theo title lớp */}
            <div className="fccr1">
                <h4>
                    <FaGraduationCap className="icon" />
                    Tên lớp học
                </h4>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên lớp học"
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                />
            </div>

            {/* Cấp bậc */}
            <div className="fccr2">
                <h4>
                    <FaGraduationCap className="icon" />
                    Trình độ giảng dạy
                </h4>
                <select value={educationLevel} onChange={handleLevelChange}>
                    <option value="">-- Chọn bậc giảng dạy --</option>
                    <option value="Tiểu học">Tiểu học</option>
                    <option value="Trung học cơ sở">Trung học cơ sở</option>
                    <option value="Trung học phổ thông">
                        Trung học phổ thông
                    </option>
                </select>
            </div>

            {/* Môn học */}
            <div className="fccr4">
                <h4>
                    <FaBookOpen className="icon" />
                    Môn học
                </h4>
                {subjectsToShow.map((subject) => (
                    <label key={subject} className="block">
                        <input
                            type="radio"
                            name="subject"
                            value={subject}
                            checked={selectedSubject === subject}
                            onChange={() => handleSubjectChange(subject)}
                            className="mr-2"
                        />
                        {subject}
                    </label>
                ))}
            </div>

            {/* Hình thức */}
            <div className="fccr5">
                <h4>
                    <FaBookOpen className="icon" />
                    Hình thức dạy học
                </h4>
                {[
                    { value: "Online", label: "Học trực tuyến" },
                    { value: "Offline", label: "Học tại nhà" },
                ].map((mode) => (
                    <label key={mode.value} className="block">
                        <input
                            type="checkbox"
                            value={mode.value}
                            checked={selectedModes.includes(mode.value)}
                            onChange={() => handleModeChange(mode.value)}
                            className="mr-2"
                        />
                        {mode.label}
                    </label>
                ))}
            </div>

            {/* Giá tiền */}
            <div className="fccr6">
                <h4>
                    <FaBookOpen className="icon" />
                    Giá tiền
                </h4>
                <PriceRangeFilter
                    minValue={minPrice}
                    maxValue={maxPrice}
                    onChange={(min, max) => {
                        setMinPrice(min);
                        setMaxPrice(max);
                    }}
                />
            </div>

            <button
                className="pr-btn"
                onClick={() => {
                    setTitleSearch("");
                    setEducationLevel("");
                    setSelectedSubject("");
                    setSelectedModes([]);
                    setMinPrice(200000);
                    setMaxPrice(800000);
                }}
            >
                Làm mới
            </button>
        </div>
    );
};

export default FilterCourse;
