import { useState, useEffect, type FC } from "react";
import type { AdminSelectStudentToCancelModalProps } from "../../types/modal";
import Modal from "./modal";
import { useAppDispatch } from "../../app/store";
import { adminGetStudentsInClassApiThunk } from "../../services/admin/class/adminClassThunk";
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && classId) {
            setIsLoading(true);
            setError(null);
            // Gọi API để lấy danh sách học sinh thực tế
            dispatch(adminGetStudentsInClassApiThunk(classId))
                .unwrap()
                .then((res) => {
                    const studentsData = get(res, "data", []) as Array<{
                        studentId: string;
                        studentName: string;
                        paymentStatus?: string;
                        approvalStatus?: string;
                    }>;

                    // Chỉ hiển thị học sinh đã thanh toán (PaymentStatus = Paid) và chưa bị hủy
                    const activeStudents = studentsData
                        .filter((s) => s.paymentStatus === "Paid" && s.approvalStatus === "Approved")
                        .map((s) => ({
                            id: s.studentId,
                            name: s.studentName || "N/A",
                        }));

                    setStudents(activeStudents);

                    if (activeStudents.length === 0) {
                        setError("Không có học sinh nào trong lớp học này.");
                    }
                })
                .catch((err) => {
                    const errorMessage = get(err, "data.message", "Không thể tải danh sách học sinh");
                    setError(errorMessage);
                    setStudents([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            // Reset khi đóng modal
            setStudents([]);
            setSelectedStudents([]);
            setError(null);
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
                    ) : error ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                            {error}
                        </div>
                    ) : students.length === 0 ? (
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                            Không có học sinh nào trong lớp học này.
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

