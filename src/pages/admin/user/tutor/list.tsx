import { useEffect, useState, type FC } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListTutorsForAdmin } from "../../../../app/selector";
import { getAllTutorForAdminApiThunk } from "../../../../services/admin/tutor/adminTutorThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { AdminBanUnbanUserModal } from "../../../../components/modal";

const AdminListTutorPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const tutors = useAppSelector(selectListTutorsForAdmin);
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUsername, setSelectedUsername] = useState<string>("");
    const [selectedIsBanned, setSelectedIsBanned] = useState<boolean>(false);
    const [filterType, setFilterType] = useState<"all" | "approved" | "pending">("all");

    const handleToDetail = (tutorId: string) => {
        const url = routes.admin.tutor.detail.replace(":id", tutorId);
        navigate(url);
    }

    const handleBanUnban = (tutorId: string, username: string, isBanned: boolean) => {
        setSelectedUserId(tutorId);
        setSelectedUsername(username);
        setSelectedIsBanned(isBanned);
        setBanModalOpen(true);
    };

    const handleRefresh = () => {
        const query = new URLSearchParams(location.search);
        const pageParam = query.get("page");
        const pageNumber = Number(pageParam) || 1;
        dispatch(getAllTutorForAdminApiThunk(pageNumber));
    };

    // Lấy giá trị page từ URL
    const query = new URLSearchParams(location.search);
    const pageParam = query.get("page");
    const pageNumber = Number(pageParam);

    // Kiểm tra nếu không hợp lệ => quay lại page=1
    useEffect(() => {
        if (!pageParam || isNaN(pageNumber) || pageNumber < 1) {
            navigate("/admin/tutor?page=1", { replace: true });
        }

        dispatch(getAllTutorForAdminApiThunk(pageNumber))
            .unwrap()
            .then(() => {})
            .catch(() => {})
            .finally(() => {});
    }, [pageParam, pageNumber, navigate]);

    useDocumentTitle("Danh sách gia sư");

    // Filter tutors based on filterType
    const filteredTutors = tutors?.filter((tutor) => {
        if (filterType === "all") return true;
        if (filterType === "approved") {
            // Đã phê duyệt: status là "Approved" hoặc "Active"
            return tutor.status === "Approved" || tutor.status === "Active";
        }
        if (filterType === "pending") {
            // Chờ phê duyệt: status là "PendingApproval"
            return tutor.status === "PendingApproval";
        }
        return true;
    }) || [];

    // Calculate counts
    const allCount = tutors?.length || 0;
    const approvedCount = tutors?.filter((t) => t.status === "Approved" || t.status === "Active").length || 0;
    const pendingCount = tutors?.filter((t) => t.status === "PendingApproval").length || 0;

    return (
        <section id="admin-list-tutor-section">
            <div className="alts-container">
                <div className="altscr1">
                    <h4>Gia sư</h4>
                    <p>
                        Trang tổng quát <span>Gia sư</span>
                    </p>
                </div>
                <div className="altscr2">
                    <div
                        className={`altscr2-item ${filterType === "all" ? "active" : ""}`}
                        onClick={() => setFilterType("all")}
                    >
                        <FaListUl className="altscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{allCount} gia sư</p>
                        </div>
                    </div>
                    <div
                        className={`altscr2-item ${filterType === "approved" ? "active" : ""}`}
                        onClick={() => setFilterType("approved")}
                    >
                        <FaListUl className="altscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã phê duyệt</h5>
                            <p>{approvedCount} gia sư</p>
                        </div>
                    </div>
                    <div
                        className={`altscr2-item ${filterType === "pending" ? "active" : ""}`}
                        onClick={() => setFilterType("pending")}
                    >
                        <FaListUl className="altscr2-item-icon" />
                        <div className="amount">
                            <h5>Chờ phê duyệt</h5>
                            <p>{pendingCount} gia sư</p>
                        </div>
                    </div>
                </div>
                <div className="altscr3">
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
                            {filteredTutors.length > 0 ? (
                                filteredTutors.map((tutor, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className="table-body-cell">
                                        {tutor.username}
                                    </td>
                                    <td className="table-body-cell">
                                        {tutor.email}
                                    </td>
                                    <td className="table-body-cell">
                                        {tutor.status === "PendingApproval" ? (
                                            <span>Đang chờ phê duyệt</span>
                                        ) : tutor.status === "Active" ? (
                                            <span>Đã được phê duyệt</span>
                                        ) : tutor.status === "Rejected" ? (
                                            <span>Đã bị từ chối</span>
                                        ) : tutor.status === "Canceled" ? (
                                            <span>Đã huỷ</span>
                                        ) : null}
                                    </td>
                                    <td className="table-body-cell">
                                        {formatDate(tutor.createDate)}
                                    </td>
                                    <td className="table-body-cell">
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                className="pr-btn"
                                                onClick={() => handleToDetail(tutor.tutorId)}
                                            >
                                                Xem chi tiết
                                            </button>
                                            <button
                                                className={tutor.isBanned ? "sc-btn" : "delete-btn"}
                                                onClick={() =>
                                                    handleBanUnban(
                                                        tutor.tutorId,
                                                        tutor.username,
                                                        tutor.isBanned || false
                                                    )
                                                }
                                            >
                                                {tutor.isBanned ? "Mở khóa" : "Khóa"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr className="table-body-row">
                                    <td colSpan={5} className="table-body-cell" style={{ textAlign: "center", padding: "2rem" }}>
                                        Chưa có gia sư nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="altscr4">
                    <div className="altscr4-item">
                        <FaArrowLeft className="altscr4-item-icon" />
                    </div>
                    <p className="altscr4-page">{pageNumber}</p>
                    <div className="altscr4-item">
                        <FaArrowRight className="altscr4-item-icon" />
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

export default AdminListTutorPage;
