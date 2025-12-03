import { type FC, useState } from "react";
import { FaBookOpen, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { PriceRangeFilter } from "../../elements";

const subjects = {
    common: ["Toán", "Tiếng Anh"],
    elementary: ["Tiếng Việt"],
    middle: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
    high: ["Ngữ văn", "Vật lí", "Hóa học", "Sinh học"],
};

const teachingForm = ["Trực tuyến", "Học tại lớp"];

const FilterCourse: FC = () => {
    const [level, setLevel] = useState("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedForms, setSelectedForms] = useState<string[]>([]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(e.target.value);
        setSelectedSubject(""); // reset môn khi đổi cấp
    };

    const handleSubjectChange = (subject: string) => {
        setSelectedSubject(subject); // luôn ghi đè = chỉ chọn 1
    };

    const handleFormChange = (subject: string) => {
        setSelectedForms((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject],
        );
    };

    const renderRadioSubjects = (subject: string) => (
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
        <div className="filter-course-container">
            <h3>Bộ lọc</h3>

            {/* Tìm kiếm */}
            <div className="fccr1">
                <input type="text" placeholder="Tìm kiếm tên gia sư" />
            </div>

            {/* Cấp bậc */}
            <div className="fccr2">
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

            {/* Địa điểm */}
            <div className="fccr3">
                <h4>
                    <FaMapMarkerAlt className="icon" />
                    Địa điểm
                </h4>
                <select>
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    <option value="TP Hà Nội">TP Hà Nội</option>
                    <option value="TP Huế">TP Huế</option>
                    <option value="TP Đà Nẵng">TP Đà Nẵng</option>
                    <option value="TPHCM">TPHCM</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                </select>
            </div>

            {/* Môn học */}
            <div className="fccr4">
                <h4>
                    <FaBookOpen className="icon" />
                    Môn học
                </h4>
                {subjectsToShow.map(renderRadioSubjects)}
            </div>

            {/* Hình thức */}
            <div className="fccr5">
                <h4>
                    <FaBookOpen className="icon" />
                    Hình thức dạy học
                </h4>
                {teachingForm.map(renderCheckboxForms)}
            </div>

            {/* Giá tiền */}
            <div className="fccr6">
                <h4>
                    <FaBookOpen className="icon" />
                    Giá tiền
                </h4>
                <PriceRangeFilter />
            </div>

            {/* Đánh giá */}
            <div className="fccr7">
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

export default FilterCourse;
