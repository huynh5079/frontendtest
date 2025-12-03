import { type FC, useState } from "react";
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

const gradesByLevel: Record<string, string[]> = {
    elementary: ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"],
    middle: ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
    high: ["Lớp 10", "Lớp 11", "Lớp 12"],
};

const FilterTutor: FC = () => {
    const [level, setLevel] = useState("");
    const [grade, setGrade] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedForms, setSelectedForms] = useState<string[]>([]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(e.target.value);
        setGrade(""); // reset grade khi đổi cấp
        setSelectedSubjects([]); // reset môn học khi đổi cấp
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrade(e.target.value);
    };

    const handleSubjectChange = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
        );
    };

    const handleFormChange = (subject: string) => {
        setSelectedForms((prev) =>
            prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
        );
    };

    const renderCheckboxSubjects = (subject: string) => (
        <label key={subject} className="block">
            <input
                type="checkbox"
                value={subject}
                checked={selectedSubjects.includes(subject)}
                onChange={() => handleSubjectChange(subject)}
                className="mr-2"
            />
            {subject}
        </label>
    );

    const renderCheckboxForms = (form: string) => (
        <label key={form} className="block">
            <input
                type="checkbox"
                value={form}
                checked={selectedForms.includes(form)}
                onChange={() => handleFormChange(form)}
                className="mr-2"
            />
            {form}
        </label>
    );

    // Môn học cần hiển thị = chung + môn riêng theo cấp
    const subjectsToShow = [
        ...subjects.common,
        ...(level ? subjects[level as keyof typeof subjects] : []),
    ];

    return (
        <div className="filter-tutor-container">
            <h3>Bộ lọc gia sư</h3>

            {/* Tìm kiếm */}
            <div className="ftcr1">
                <input type="text" placeholder="Tìm kiếm tên gia sư" />
            </div>

            {/* Cấp bậc */}
            <div className="ftcr2">
                <h4>
                    <FaGraduationCap className="icon" />
                    Trình độ giảng dạy
                </h4>
                <select value={level} onChange={handleLevelChange}>
                    <option value="">-- Chọn bậc giảng dạy --</option>
                    <option value="elementary">Tiểu học</option>
                    <option value="middle">Trung học cơ sở</option>
                    <option value="high">Trung học phổ thông</option>
                </select>
            </div>

            {/* Lớp học (xuất hiện khi đã chọn bậc) */}
            {level && (
                <div className="ftcr2">
                    <h4>
                        <FaGraduationCap className="icon" />
                        Lớp học
                    </h4>
                    <select value={grade} onChange={handleGradeChange}>
                        <option value="">-- Chọn lớp --</option>
                        {gradesByLevel[level]?.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Địa điểm */}
            <div className="ftcr3">
                <h4>
                    <FaMapMarkerAlt className="icon" />
                    Địa điểm
                </h4>
                <TutorLocationSelector />
            </div>

            {/* Môn học */}
            <div className="ftcr4">
                <h4>
                    <FaBookOpen className="icon" />
                    Môn học
                </h4>
                {subjectsToShow.map(renderCheckboxSubjects)}
            </div>

            {/* Hình thức */}
            <div className="ftcr5">
                <h4>
                    <FaBookOpen className="icon" />
                    Hình thức dạy học
                </h4>
                {teachingForm.map(renderCheckboxForms)}
            </div>

            {/* Giá tiền */}
            <div className="ftcr6">
                <h4>
                    <FaBookOpen className="icon" />
                    Giá tiền
                </h4>
                <PriceRangeFilter />
            </div>

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

            <button className="pr-btn">Làm mới</button>
        </div>
    );
};

export default FilterTutor;
