import { useState, useEffect, type FC } from "react";
import type { AdminSelectStudentToCancelModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { publicGetDetailClassApiThunk } from "../../services/public/class/classthunk";
import { get } from "lodash";

const AdminSelectStudentToCancelModal: FC<AdminSelectStudentToCancelModalProps> = ({
    isOpen,
    setIsOpen,
    classId,
    onSelectStudent,
}) => {
    const dispatch = useAppDispatch();
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && classId) {
            setIsLoading(true);
            // Tạm thời: Lấy thông tin lớp để có danh sách học sinh
            // TODO: Cần API admin để lấy danh sách học sinh trong lớp
            dispatch(publicGetDetailClassApiThunk(classId))
                .unwrap()
                .then((res) => {
                    // Tạm thời: Mock data vì API chưa có danh sách học sinh
                    // Trong thực tế cần API admin/classes/{classId}/students
                    setStudents([
                        { id: "student1", name: "Trần Văn B" },
                        { id: "student2", name: "Lê Thị C" },
                    ]);
                })
                .catch(() => {
                    // Fallback: Mock data
                    setStudents([
                        { id: "student1", name: "Trần Văn B" },
                        { id: "student2", name: "Lê Thị C" },
                    ]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, classId, dispatch]);

    const handleToggleStudent = (studentId: string) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleConfirm = () => {
        if (selectedStudents.length > 0 && onSelectStudent) {
            // Lấy tên học sinh đầu tiên được chọn
            const firstStudent = students.find((s) => s.id === selectedStudents[0]);
            onSelectStudent(selectedStudents[0], firstStudent?.name);
        }
        setIsOpen(false);
        setSelectedStudents([]);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Chọn học sinh để hủy">
            <section id="admin-select-student-to-cancel-modal">
                <div className="asstcm-container">
                    <p className="asstcm-instruction">
                        Chọn một hoặc nhiều học sinh để hủy khỏi lớp học
                    </p>

                    {isLoading ? (
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                            Đang tải danh sách học sinh...
                        </div>
                    ) : (
                        <div className="asstcm-student-list">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="asstcm-student-item"
                                    onClick={() => handleToggleStudent(student.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => handleToggleStudent(student.id)}
                                    />
                                    <label>{student.name}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="group-btn">
                        <button
                            className="sc-btn"
                            onClick={() => {
                                setIsOpen(false);
                                setSelectedStudents([]);
                            }}
                        >
                            Đóng
                        </button>
                        {selectedStudents.length > 0 && (
                            <button className="pr-btn" onClick={handleConfirm}>
                                Xác nhận ({selectedStudents.length})
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </Modal>
    );
};

export default AdminSelectStudentToCancelModal;

