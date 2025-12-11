import { type FC, useEffect, useState } from "react";
import { FaBookOpen, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { PriceRangeFilter } from "../../elements";
import TutorLocationSelector from "./LocationSelect";
import { PublicTutors } from "../../../types/tutor";

const subjectsByLevel = {
    common: ["Toán", "Tiếng Anh"],
    elementary: ["Tiếng Việt"],
    middle: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
    high: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
};

interface FilterParams {
    name?: string;
    level?: string;
    subjects?: string[]; // danh sách các môn được chọn
}

interface FilterTutorProps {
    onFilterChange: (filters: {
        name: string;
        level: string;
        subjects: string[];
    }) => void;
}

export const filterTutors = (tutors: PublicTutors[], filters: FilterParams) => {
    const nameFilter = filters.name?.toLowerCase() || "";
    const levelFilter = filters.level || "";
    const subjectsFilter = filters.subjects || [];

    return tutors.filter((tutor) => {
        if (!tutor) return false;

        // 1️⃣ Lọc theo tên
        if (nameFilter && !tutor.username?.toLowerCase().includes(nameFilter)) {
            return false;
        }

        // 2️⃣ Lọc theo trình độ
        const levels = (tutor.teachingLevel || "")
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean);
        if (levelFilter && !levels.includes(levelFilter)) {
            return false;
        }

        // 3️⃣ Lọc theo môn học
        const tutorSubjects = (tutor.teachingSubjects || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        if (subjectsFilter.length > 0) {
            const match = subjectsFilter.some((sub) =>
                tutorSubjects.includes(sub),
            );
            if (!match) return false;
        }

        return true;
    });
};

const FilterTutor: FC<FilterTutorProps> = ({ onFilterChange }) => {
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    // Xử lý đổi level
    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(e.target.value);
        setSelectedSubjects([]); // reset môn học
    };

    // Xử lý chọn môn học
    const handleSubjectChange = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject],
        );
    };

    // Môn học hiển thị dựa trên level
    const levelMap: Record<string, keyof typeof subjectsByLevel> = {
        "Tiểu học": "elementary",
        "Trung học cơ sở": "middle",
        "Trung học phổ thông": "high",
    };

    const levelSubjects: string[] =
        level && subjectsByLevel[levelMap[level]]
            ? subjectsByLevel[levelMap[level]]
            : [];

    const subjectsToShow = [...subjectsByLevel.common, ...levelSubjects];

    // Gửi filter lên parent
    useEffect(() => {
        onFilterChange({
            name,
            level,
            subjects: selectedSubjects,
        });
    }, [name, level, selectedSubjects]);

    return (
        <div className="filter-tutor-container">
            <h3>Bộ lọc gia sư</h3>

            {/* Tên */}
            <div className="ftcr1">
                <h4>
                    <FaGraduationCap className="icon" />
                    Tên gia sư
                </h4>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên gia sư"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Trình độ */}
            <div className="ftcr2">
                <h4>
                    <FaGraduationCap className="icon" />
                    Trình độ giảng dạy
                </h4>
                <select value={level} onChange={handleLevelChange}>
                    <option value="">-- Chọn bậc giảng dạy --</option>
                    <option value="Tiểu học">Tiểu học</option>
                    <option value="Trung học cơ sở">Trung học cơ sở</option>
                    <option value="Trung học phổ thông">
                        Trung học phổ thông
                    </option>
                </select>
            </div>

            {/* Môn học */}
            <div className="ftcr4">
                <h4>
                    <FaBookOpen className="icon" />
                    Môn học
                </h4>
                {subjectsToShow.map((sub) => (
                    <label key={sub} className="block">
                        <input
                            type="checkbox"
                            checked={selectedSubjects.includes(sub)}
                            onChange={() => handleSubjectChange(sub)}
                            className="mr-2"
                        />
                        {sub}
                    </label>
                ))}
            </div>

            {/* Địa điểm */}
            {/* <div className="ftcr3">
                <h4>
                    <FaMapMarkerAlt className="icon" />
                    Địa điểm
                </h4>
                <TutorLocationSelector />
            </div> */}

            {/* Đánh giá */}
            <div className="ftcr7">
                <h4>
                    <FaGraduationCap className="icon" />
                    Đánh giá
                </h4>
                <select>
                    <option value="">-- Chọn mức đánh giá --</option>
                    <option value="asc">Từ thấp đến cao</option>
                    <option value="desc">Từ cao đến thấp</option>
                </select>
            </div>

            <button
                className="pr-btn"
                onClick={() => {
                    setName("");
                    setLevel("");
                    setSelectedSubjects([]);
                }}
            >
                Làm mới
            </button>
        </div>
    );
};

export default FilterTutor;
