import { useEffect, useState, type FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle, formatDate } from "../../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { adminGetAllClassesApiThunk } from "../../../../services/admin/class/adminClassThunk";
import { selectListClassesForAdmin } from "../../../../app/selector";
import { AdminCancelClassModal, AdminCancelStudentEnrollmentModal, AdminSelectStudentToCancelModal } from "../../../../components/modal";
import { getAllTutorForAdminApi, getDetailTutorForAdminApi } from "../../../../services/admin/tutor/adminTutorApi";
import { get } from "lodash";
import { toast } from "react-toastify";
import { MdCancel, MdPersonRemove } from "react-icons/md";
import type { PublicClass } from "../../../../types/public";

const AdminListClassPage: FC = () => {
    useDocumentTitle("Danh sách lớp học");
    const dispatch = useAppDispatch();
    const classes = useAppSelector(selectListClassesForAdmin) || [];

    const [isLoading, setIsLoading] = useState(false);
    const [tutorNameMap, setTutorNameMap] = useState<Record<string, string>>({});
    const [classesWithTutorName, setClassesWithTutorName] = useState<PublicClass[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("all"); // "all", "active", "cancelled"
    const [cancelClassModalOpen, setCancelClassModalOpen] = useState(false);
    const [selectStudentModalOpen, setSelectStudentModalOpen] = useState(false);
    const [cancelStudentModalOpen, setCancelStudentModalOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);

    // Fetch danh sách lớp học
    useEffect(() => {
        setIsLoading(true);
        dispatch(adminGetAllClassesApiThunk())
            .unwrap()
            .then(() => { })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra khi tải danh sách lớp học");
                toast.error(errorData);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [dispatch]);

    // Fetch tutor names cho tất cả classes
    useEffect(() => {
        if (classes.length === 0) return;

        const fetchTutorNames = async () => {
            const tutorIds = classes.map(c => c.tutorId);
            const uniqueTutorIds = Array.from(new Set(tutorIds));
            const newTutorNameMap: Record<string, string> = { ...tutorNameMap };

            // Kiểm tra xem đã có tất cả tutor names chưa
            const missingTutorIds = uniqueTutorIds.filter(tutorId => !newTutorNameMap[tutorId]);
            if (missingTutorIds.length === 0) {
                // Đã có đủ tất cả tutor names, không cần fetch lại
                console.log("Đã có đủ tất cả tutor names, không cần fetch lại");
                return;
            }

            console.log(`Cần fetch tutor names cho ${missingTutorIds.length} tutors:`, missingTutorIds);

            // Strategy: Gọi API admin tutor list để lấy tất cả tutor, sau đó gọi API detail cho mỗi tutor
            // để lấy tutorProfileId và map tutorProfileId -> username
            try {
                // Bước 1: Lấy tất cả tutor từ API admin tutor list (có thể cần gọi nhiều trang)
                const allTutors: Array<{ tutorId: string; username: string }> = [];
                let page = 1;
                let hasMore = true;

                while (hasMore && page <= 20) { // Tăng lên 20 trang để lấy đủ tutor
                    try {
                        const response = await getAllTutorForAdminApi(page);
                        const tutors = get(response, "data", []) as Array<{ tutorId: string; username: string }>;
                        if (tutors && tutors.length > 0) {
                            allTutors.push(...tutors);
                            page++;
                        } else {
                            hasMore = false;
                        }
                    } catch (error) {
                        console.warn(`Lỗi khi fetch tutor list page ${page}:`, error);
                        hasMore = false;
                    }
                }

                console.log(`Đã lấy được ${allTutors.length} tutors từ API`);

                // Bước 2: Với mỗi tutor, gọi API detail để lấy tutorProfileId và map lại
                const tutorProfileIdMap: Record<string, string> = {}; // tutorProfileId -> username

                const detailPromises = allTutors.map(async (tutor) => {
                    try {
                        const detailResponse = await getDetailTutorForAdminApi(tutor.tutorId);
                        const tutorProfileId = get(detailResponse, "data.tutorProfileId");
                        if (tutorProfileId) {
                            tutorProfileIdMap[tutorProfileId] = tutor.username;
                            console.log(`Mapped tutorProfileId ${tutorProfileId} -> ${tutor.username}`);
                        }
                    } catch (error) {
                        console.warn(`Lỗi khi fetch tutor detail cho ${tutor.tutorId}:`, error);
                    }
                });

                await Promise.all(detailPromises);

                console.log(`Đã map được ${Object.keys(tutorProfileIdMap).length} tutorProfileIds`);
                console.log(`TutorProfileIds trong map:`, Object.keys(tutorProfileIdMap));
                console.log(`TutorIds cần map:`, uniqueTutorIds);

                // Bước 3: Map tutorId (TutorProfileId) -> username
                // Xử lý case-insensitive để tránh vấn đề uppercase/lowercase
                uniqueTutorIds.forEach((tutorId) => {
                    // Thử tìm exact match trước
                    let foundName = tutorProfileIdMap[tutorId];

                    // Nếu không tìm thấy, thử tìm case-insensitive
                    if (!foundName) {
                        const tutorIdLower = tutorId.toLowerCase();
                        const matchingKey = Object.keys(tutorProfileIdMap).find(
                            key => key.toLowerCase() === tutorIdLower
                        );
                        if (matchingKey) {
                            foundName = tutorProfileIdMap[matchingKey];
                            console.log(`Found case-insensitive match: ${tutorId} -> ${matchingKey} -> ${foundName}`);
                        }
                    }

                    if (foundName) {
                        newTutorNameMap[tutorId] = foundName;
                        console.log(`✅ Updated tutorName for ${tutorId}: ${foundName}`);
                    } else if (!newTutorNameMap[tutorId]) {
                        newTutorNameMap[tutorId] = tutorId; // Fallback
                        console.warn(`⚠️ Không tìm thấy tutor name cho ${tutorId}, dùng ID làm tên. Có thể tutor này chưa có trong danh sách admin tutor.`);
                    }
                });

                setTutorNameMap(newTutorNameMap);
            } catch (error) {
                console.error("Lỗi khi fetch tutor names:", error);
                // Fallback: dùng tutorId làm tên
                uniqueTutorIds.forEach((tutorId) => {
                    if (!newTutorNameMap[tutorId]) {
                        newTutorNameMap[tutorId] = tutorId;
                    }
                });
                setTutorNameMap(newTutorNameMap);
            }
        };

        fetchTutorNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    // Cập nhật classes với tutor names - chạy mỗi khi classes hoặc tutorNameMap thay đổi
    useEffect(() => {
        const updatedClasses = classes.map(cls => ({
            ...cls,
            tutorName: tutorNameMap[cls.tutorId] || cls.tutorId
        }));
        setClassesWithTutorName(updatedClasses);
    }, [classes, tutorNameMap]);

    // Tính toán số lượng lớp theo trạng thái
    const allClasses = classesWithTutorName.length > 0 ? classesWithTutorName : classes;
    const allClassesCount = allClasses.length;
    const activeClassesCount = allClasses.filter(c => c.status === "Active" || c.status === "Ongoing").length;
    const cancelledClassesCount = allClasses.filter(c => c.status === "Cancelled").length;

    // Filter classes theo status
    const getFilteredClasses = () => {
        if (filterStatus === "all") {
            return allClasses;
        } else if (filterStatus === "active") {
            return allClasses.filter(c => c.status === "Active" || c.status === "Ongoing");
        } else if (filterStatus === "cancelled") {
            return allClasses.filter(c => c.status === "Cancelled");
        }
        return allClasses;
    };

    const displayClasses = getFilteredClasses();

    const handleCancelClass = (classId: string) => {
        setSelectedClassId(classId);
        setCancelClassModalOpen(true);
    };

    const handleCancelStudent = (classId: string) => {
        setSelectedClassId(classId);
        setSelectStudentModalOpen(true);
    };

    const handleSelectStudent = (studentId: string, studentName?: string) => {
        setSelectedStudentId(studentId);
        setSelectedStudentName(studentName || null);
        setSelectStudentModalOpen(false);
        setCancelStudentModalOpen(true);
    };

    const handleModalClose = () => {
        setCancelClassModalOpen(false);
        setCancelStudentModalOpen(false);
        setSelectedClassId(null);
        setSelectedStudentId(null);
        setSelectedStudentName(null);
    };

    const handleRefreshClasses = () => {
        // Refresh danh sách sau khi hủy thành công
        dispatch(adminGetAllClassesApiThunk())
            .unwrap()
            .then(() => { })
            .catch((error) => {
                const errorData = get(error, "data.message", "Có lỗi xảy ra khi tải danh sách lớp học");
                toast.error(errorData);
            });
    };

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            "Pending": "Chờ phê duyệt",
            "Active": "Đang hoạt động",
            "Ongoing": "Đang diễn ra",
            "Cancelled": "Đã hủy",
            "Completed": "Đã hoàn thành",
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status: string) => {
        const classMap: Record<string, string> = {
            "Pending": "status-pending",
            "Active": "status-active",
            "Ongoing": "status-ongoing",
            "Cancelled": "status-cancelled",
            "Completed": "status-completed",
        };
        return classMap[status] || "";
    };

    return (
        <>
            <section id="admin-list-class-section">
                <div className="alcs-container">
                    <div className="alcscr1">
                        <h4>Quản lý lớp học</h4>
                        <p>
                            Trang tổng quát <span>Lớp học</span>
                        </p>
                    </div>
                    <div className="alcscr2">
                        <div
                            className={`alcscr2-item ${filterStatus === "all" ? "active" : ""} clickable`}
                            onClick={() => setFilterStatus("all")}
                        >
                            <FaListUl className="alcscr2-item-icon" />
                            <div className="amount">
                                <h5>Tất cả</h5>
                                <p>{allClassesCount} lớp học</p>
                            </div>
                        </div>
                        <div
                            className={`alcscr2-item ${filterStatus === "active" ? "active" : ""} clickable`}
                            onClick={() => setFilterStatus("active")}
                        >
                            <FaListUl className="alcscr2-item-icon" />
                            <div className="amount">
                                <h5>Đang hoạt động</h5>
                                <p>{activeClassesCount} lớp</p>
                            </div>
                        </div>
                        <div
                            className={`alcscr2-item ${filterStatus === "cancelled" ? "active" : ""} clickable`}
                            onClick={() => setFilterStatus("cancelled")}
                        >
                            <FaListUl className="alcscr2-item-icon" />
                            <div className="amount">
                                <h5>Đã hủy</h5>
                                <p>{cancelledClassesCount} lớp</p>
                            </div>
                        </div>
                    </div>
                    <div className="alcscr3">
                        {isLoading ? (
                            <div style={{ padding: "2rem", textAlign: "center" }}>
                                Đang tải dữ liệu...
                            </div>
                        ) : (
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">GIA SƯ</th>
                                        <th className="table-head-cell">MÔN HỌC</th>
                                        <th className="table-head-cell">SỐ LƯỢNG NGƯỜI ĐĂNG KÝ</th>
                                        <th className="table-head-cell">TRẠNG THÁI</th>
                                        <th className="table-head-cell">
                                            THỜI GIAN ĐĂNG KÝ
                                        </th>
                                        <th className="table-head-cell">THAO TÁC</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {displayClasses.length === 0 ? (
                                        <tr className="table-body-row">
                                            <td colSpan={6} className="table-body-cell" style={{ textAlign: "center", padding: "2rem" }}>
                                                Không có dữ liệu lớp học
                                            </td>
                                        </tr>
                                    ) : (
                                        displayClasses.map((classItem, index) => (
                                            <tr className="table-body-row" key={classItem.id || index}>
                                                <td className="table-body-cell">
                                                    {classItem.tutorName || classItem.tutorId || "N/A"}
                                                </td>
                                                <td className="table-body-cell">
                                                    {classItem.subject || classItem.title || "N/A"}
                                                </td>
                                                <td className="table-body-cell">
                                                    {classItem.currentStudentCount || 0}/{classItem.studentLimit || 0}
                                                </td>
                                                <td className="table-body-cell">
                                                    <span className={getStatusClass(classItem.status)}>
                                                        {getStatusLabel(classItem.status)}
                                                    </span>
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDate(classItem.createdAt)}
                                                </td>
                                                <td className="table-body-cell">
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <button
                                                            className="pr-btn"
                                                            onClick={() => handleCancelClass(classItem.id)}
                                                            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
                                                        >
                                                            <MdCancel /> Hủy lớp
                                                        </button>
                                                        {classItem.currentStudentCount > 0 && (
                                                            <button
                                                                className="pr-btn"
                                                                onClick={() => handleCancelStudent(classItem.id)}
                                                                style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
                                                            >
                                                                <MdPersonRemove /> Hủy học sinh
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>

            <AdminCancelClassModal
                isOpen={cancelClassModalOpen}
                setIsOpen={(open) => {
                    setCancelClassModalOpen(open);
                    if (!open) {
                        setSelectedClassId(null);
                    }
                }}
                classId={selectedClassId}
                onSuccess={handleRefreshClasses}
            />

            <AdminSelectStudentToCancelModal
                isOpen={selectStudentModalOpen}
                setIsOpen={(open) => {
                    setSelectStudentModalOpen(open);
                    if (!open) {
                        setSelectedClassId(null);
                    }
                }}
                classId={selectedClassId}
                onSelectStudent={handleSelectStudent}
            />

            <AdminCancelStudentEnrollmentModal
                isOpen={cancelStudentModalOpen}
                setIsOpen={(open) => {
                    setCancelStudentModalOpen(open);
                    if (!open) {
                        setSelectedClassId(null);
                        setSelectedStudentId(null);
                        setSelectedStudentName(null);
                    }
                }}
                classId={selectedClassId}
                studentId={selectedStudentId}
                studentName={selectedStudentName}
                onSuccess={handleRefreshClasses}
            />
        </>
    );
};

export default AdminListClassPage;
