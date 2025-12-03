import { useState, type FC } from "react";
import { PieChartStat } from "../../elements";
import { sampleData, useDocumentTitle } from "../../../utils/helper";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

const StudentReportLearning: FC = () => {
    const [tab, setTab] = useState<string>("tutor");

    useDocumentTitle("Tiến độ học tập");

    return (
        <div className="student-report-learning">
            <div className="tabs">
                <div className={`tab ${tab === "tutor" ? "active" : ""}`} onClick={() => setTab("tutor")}>
                    Gia sư
                    <span
                        className={`underline left ${tab === "tutor" ? "full" : ""
                            }`}
                    />
                    <span
                        className={`underline right ${tab === "tutor" ? "full" : ""
                            }`}
                    />
                </div>
                <div className={`tab ${tab === "class" ? "active" : ""}`} onClick={() => setTab("class")}>
                    Lớp học
                    <span
                        className={`underline left ${tab === "class" ? "full" : ""
                            }`}
                    />
                    <span
                        className={`underline right ${tab === "class" ? "full" : ""
                            }`}
                    />
                </div>
            </div>
            {tab === "tutor" && <>
                <div className="form-field">
                    <label className="form-label">Chọn gia sư</label>
                    <div className="form-input-container">
                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                        <select name="" id="" className="form-input">
                            <option value="">-- Chọn gia sư --</option>
                            <option value="">Nam</option>
                            <option value="">Nữ</option>
                        </select>
                    </div>
                </div>
                <PieChartStat data={sampleData} />
            </>}
            {tab === "class" && <>
                <div className="form-field">
                    <label className="form-label">Chọn lớp học</label>
                    <div className="form-input-container">
                        <MdOutlineDriveFileRenameOutline className="form-input-icon" />
                        <select name="" id="" className="form-input">
                            <option value="">-- Chọn lớp học --</option>
                            <option value="">Nam</option>
                            <option value="">Nữ</option>
                        </select>
                    </div>
                </div>
                <PieChartStat data={sampleData} />
            </>}
        </div>
    );
};

export default StudentReportLearning;
