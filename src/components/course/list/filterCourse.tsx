import { type FC, useState, useEffect } from "react";
import { FaBookOpen, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { PriceRangeFilter } from "../../elements";

const subjects = {
    common: ["Toán", "Tiếng Anh"],
    elementary: ["Tiếng Việt"],
    middle: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
    high: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
};

const classLevelMap: Record<string, string[]> = {
    "Tiểu học": ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"],
    "Trung học cơ sở": ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
    "Trung học phổ thông": ["Lớp 10", "Lớp 11", "Lớp 12"],
};

interface FilterCourseProps {
    onFilterChange: (filters: {
        titleSearch: string;
        educationLevel: string;
        classLevel: string;
        subject: string;
        modes: string[];
        location: string;
        minPrice: number;
        maxPrice: number;
    }) => void;
}

const FilterCourse: FC<FilterCourseProps> = ({ onFilterChange }) => {
    const [titleSearch, setTitleSearch] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [classLevel, setClassLevel] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedModes, setSelectedModes] = useState<string[]>([]);
    const [location, setLocation] = useState("");
    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(2000000);

    useEffect(() => {
        onFilterChange({
            titleSearch,
            educationLevel,
            classLevel,
            subject: selectedSubject,
            modes: selectedModes,
            location,
            minPrice,
            maxPrice,
        });
    }, [
        titleSearch,
        educationLevel,
        classLevel,
        selectedSubject,
        selectedModes,
        location,
        minPrice,
        maxPrice,
    ]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEducationLevel(e.target.value);
        setClassLevel(""); // reset lớp
        setSelectedSubject("");
    };

    const handleModeChange = (mode: string) => {
        setSelectedModes((prev) => {
            const newModes = prev.includes(mode)
                ? prev.filter((m) => m !== mode)
                : [...prev, mode];

            // If Offline mode is unchecked, clear location filter
            if (!newModes.includes("Offline")) {
                setLocation("");
            }

            return newModes;
        });
    };

    const levelMap: Record<string, keyof typeof subjects> = {
        "Tiểu học": "elementary",
        "Trung học cơ sở": "middle",
        "Trung học phổ thông": "high",
    };

    const levelSubjects =
        educationLevel && levelMap[educationLevel]
            ? subjects[levelMap[educationLevel]]
            : [];

    const subjectsToShow = [...subjects.common, ...levelSubjects];

    return (
        <div className="filter-course-container">
            <h3>Bộ lọc</h3>

            {/* Tên lớp */}
            <div className="fccr1">
                <h4>
                    <FaGraduationCap className="icon" /> Tên lớp học
                </h4>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên lớp"
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                />
            </div>

            {/* Cấp bậc */}
            <div className="fccr2">
                <h4>
                    <FaGraduationCap className="icon" /> Cấp bậc
                </h4>
                <select
                    value={educationLevel}
                    onChange={handleLevelChange}
                    aria-label="Chọn cấp bậc"
                >
                    <option value="">-- Chọn cấp bậc --</option>
                    <option value="Tiểu học">Tiểu học</option>
                    <option value="Trung học cơ sở">Trung học cơ sở</option>
                    <option value="Trung học phổ thông">
                        Trung học phổ thông
                    </option>
                </select>
            </div>

            {/* LỚP (hiện sau khi chọn cấp bậc) */}
            {educationLevel && (
                <div className="fccr3">
                    <h4>
                        <FaGraduationCap className="icon" /> Lớp
                    </h4>
                    <select
                        value={classLevel}
                        onChange={(e) => setClassLevel(e.target.value)}
                        aria-label="Chọn lớp"
                    >
                        <option value="">-- Chọn lớp --</option>
                        {classLevelMap[educationLevel].map((cls) => (
                            <option key={cls} value={cls}>
                                {cls}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Môn học */}
            <div className="fccr4">
                <h4>
                    <FaBookOpen className="icon" /> Môn học
                </h4>
                {subjectsToShow.map((subject) => (
                    <label key={subject}>
                        <input
                            type="radio"
                            checked={selectedSubject === subject}
                            onChange={() => setSelectedSubject(subject)}
                        />
                        {subject}
                    </label>
                ))}
            </div>

            {/* Hình thức */}
            <div className="fccr5">
                <h4>
                    <FaBookOpen className="icon" /> Hình thức
                </h4>
                {[
                    { value: "Online", label: "Học trực tuyến" },
                    { value: "Offline", label: "Học tại nhà" },
                ].map((mode) => (
                    <label key={mode.value}>
                        <input
                            type="checkbox"
                            checked={selectedModes.includes(mode.value)}
                            onChange={() => handleModeChange(mode.value)}
                        />
                        {mode.label}
                    </label>
                ))}
            </div>

            {/* Địa chỉ lớp học (chỉ hiện khi chọn học tại nhà) */}
            {selectedModes.includes("Offline") && (
                <div className="fccr5">
                    <h4>
                        <FaMapMarkerAlt className="icon" /> Địa chỉ lớp học
                    </h4>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo địa chỉ lớp học"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            )}

            {/* Giá */}
            <div className="fccr6">
                <h4>
                    <FaBookOpen className="icon" /> Giá tiền
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
                    setClassLevel("");
                    setSelectedSubject("");
                    setSelectedModes([]);
                    setLocation("");
                    setMinPrice(100000);
                    setMaxPrice(2000000);
                }}
            >
                Làm mới
            </button>
        </div>
    );
};

export default FilterCourse;
