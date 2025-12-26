import { useEffect, useState, type FC } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListStudentsForAdmin } from "../../../../app/selector";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { getAllStudentForAdminApiThunk } from "../../../../services/admin/student/adminStudentThunk";
import { AdminBanUnbanUserModal } from "../../../../components/modal";

const AdminListStudentPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const students = useAppSelector(selectListStudentsForAdmin);
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUsername, setSelectedUsername] = useState<string>("");
    const [selectedIsBanned, setSelectedIsBanned] = useState<boolean>(false);
    const [filterType, setFilterType] = useState<"all" | "linked">("all");

    const handleToDetail = (studentId: string) => {
        const url = routes.admin.student.detail.replace(":id", studentId);
        navigate(url);
    }

    const handleBanUnban = (studentId: string, username: string, isBanned: boolean) => {
        setSelectedUserId(studentId);
        setSelectedUsername(username);
        setSelectedIsBanned(isBanned);
        setBanModalOpen(true);
    };

    const handleRefresh = () => {
        const query = new URLSearchParams(location.search);
        const pageParam = query.get("page");
        const pageNumber = Number(pageParam) || 1;
        dispatch(getAllStudentForAdminApiThunk(pageNumber));
    };

    // Lấy giá trị page từ URL
    const query = new URLSearchParams(location.search);
    const pageParam = query.get("page");
    const pageNumber = Number(pageParam);

    // Kiểm tra nếu không hợp lệ => quay lại page=1
    useEffect(() => {
        if (!pageParam || isNaN(pageNumber) || pageNumber < 1) {
            navigate("/admin/student?page=1", { replace: true });
        }

        dispatch(getAllStudentForAdminApiThunk(pageNumber))
            .unwrap()
            .then(() => {})
            .catch(() => {})
            .finally(() => {});
    }, [pageParam, pageNumber, navigate]);

    useDocumentTitle("Danh sách học viên");

    // Filter students based on filterType
    // Note: This assumes backend will provide isLinked or parentId field
    // For now, we'll filter based on available data
    const filteredStudents = students?.filter((student) => {
        if (filterType === "all") return true;
        if (filterType === "linked") {
            // Check if student is linked (has parentId or isLinked field)
            // This will need backend support to return this information
            return (student as any).parentId != null || (student as any).isLinked === true;
        }
        return true;
    }) || [];

    // Calculate counts
    const allCount = students?.length || 0;
    const linkedCount = students?.filter((s) => (s as any).parentId != null || (s as any).isLinked === true).length || 0;

    return (
        <section id="admin-list-student-section">
            <div className="alss-container">
                <div className="alsscr1">
                    <h4>Học viên</h4>
                    <p>
                        Trang tổng quát <span>Học viên</span>
                    </p>
                </div>
                <div className="alsscr2">
                    <div
                        className={`alsscr2-item ${filterType === "all" ? "active" : ""}`}
                        onClick={() => setFilterType("all")}
                    >
                        <FaListUl className="alsscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{allCount} học viên</p>
                        </div>
                    </div>
                    <div
                        className={`alsscr2-item ${filterType === "linked" ? "active" : ""}`}
                        onClick={() => setFilterType("linked")}
                    >
                        <FaListUl className="alsscr2-item-icon" />
                        <div className="amount">
                            <h5>Được liên kết</h5>
                            <p>{linkedCount} học viên</p>
                        </div>
                    </div>
                </div>
                <div className="alsscr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Họ và tên</th>
                                <th className="table-head-cell">Email</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian tham gia
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                             {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className="table-body-cell">
                                        {student.username}
                                    </td>
                                    <td className="table-body-cell">
                                        {student.email}
                                    </td>
                                    <td className="table-body-cell">
                                        {student.isBanned === false ? (
                                            <span>Hoạt động</span>
                                        ) : student.isBanned === true ? (
                                            <span>Đã bị khóa</span>
                                        ) : null}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(student.createDate)}
                                    </td>
                                    <td className="table-body-cell">
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                className="pr-btn"
                                                onClick={() => handleToDetail(student.studentId)}
                                            >
                                                Xem chi tiết
                                            </button>
                                            <button
                                                className={student.isBanned ? "sc-btn" : "delete-btn"}
                                                onClick={() =>
                                                    handleBanUnban(
                                                        student.studentId,
                                                        student.username,
                                                        student.isBanned || false
                                                    )
                                                }
                                            >
                                                {student.isBanned ? "Mở khóa" : "Khóa"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr className="table-body-row">
                                    <td colSpan={5} className="table-body-cell" style={{ textAlign: "center", padding: "2rem" }}>
                                        Chưa có học viên nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="alsscr4">
                    <div className="alsscr4-item">
                        <FaArrowLeft className="alsscr4-item-icon" />
                    </div>
                    <p className="alsscr4-page">{pageNumber}</p>
                    <div className="alsscr4-item">
                        <FaArrowRight className="alsscr4-item-icon" />
                    </div>
                </div>
            </div>
            <AdminBanUnbanUserModal
                isOpen={banModalOpen}
                setIsOpen={(open) => {
                    setBanModalOpen(open);
                    if (!open) {
                        setSelectedUserId(null);
                        setSelectedUsername("");
                        setSelectedIsBanned(false);
                    }
                }}
                userId={selectedUserId || ""}
                username={selectedUsername}
                isBanned={selectedIsBanned}
                onSuccess={handleRefresh}
            />
        </section>
    );
};

export default AdminListStudentPage;
