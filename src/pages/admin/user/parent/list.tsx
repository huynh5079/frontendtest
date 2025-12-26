import { useEffect, useState, type FC } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { routes } from "../../../../routes/routeName";
import { selectListParentsForAdmin } from "../../../../app/selector";
import { getAllParentForAdminApiThunk } from "../../../../services/admin/parent/adminParentThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { AdminBanUnbanUserModal } from "../../../../components/modal";

const AdminListParentPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const parents = useAppSelector(selectListParentsForAdmin);
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUsername, setSelectedUsername] = useState<string>("");
    const [selectedIsBanned, setSelectedIsBanned] = useState<boolean>(false);
    const [filterType, setFilterType] = useState<"all" | "banned">("all");

    const handleToDetail = (parrentId: string) => {
        const url = routes.admin.parent.detail.replace(":id", parrentId);
        navigate(url);
    };

    const handleBanUnban = (parentId: string, username: string, isBanned: boolean) => {
        setSelectedUserId(parentId);
        setSelectedUsername(username);
        setSelectedIsBanned(isBanned);
        setBanModalOpen(true);
    };

    const handleRefresh = () => {
        const query = new URLSearchParams(location.search);
        const pageParam = query.get("page");
        const pageNumber = Number(pageParam) || 1;
        dispatch(getAllParentForAdminApiThunk(pageNumber));
    };

    // Lấy giá trị page từ URL
    const query = new URLSearchParams(location.search);
    const pageParam = query.get("page");
    const pageNumber = Number(pageParam);

    // Kiểm tra nếu không hợp lệ => quay lại page=1
    useEffect(() => {
        if (!pageParam || isNaN(pageNumber) || pageNumber < 1) {
            navigate("/admin/parent?page=1", { replace: true });
        }

        dispatch(getAllParentForAdminApiThunk(pageNumber))
            .unwrap()
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [pageParam, pageNumber, navigate]);

    useDocumentTitle("Danh sách phụ huynh");

    // Filter parents based on filterType
    const filteredParents = parents?.filter((parent) => {
        if (filterType === "all") return true;
        if (filterType === "banned") {
            return (parent as any).isBanned === true;
        }
        return true;
    }) || [];

    // Calculate counts
    const allCount = parents?.length || 0;
    const bannedCount = parents?.filter((p) => (p as any).isBanned === true).length || 0;

    return (
        <section id="admin-list-parent-section">
            <div className="alps-container">
                <div className="alpscr1">
                    <h4>Phụ huynh</h4>
                    <p>
                        Trang tổng quát <span>Phụ huynh</span>
                    </p>
                </div>
                <div className="alpscr2">
                    <div
                        className={`alpscr2-item ${filterType === "all" ? "active" : ""}`}
                        onClick={() => setFilterType("all")}
                    >
                        <FaListUl className="alpscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>{allCount} phụ huynh</p>
                        </div>
                    </div>
                    <div
                        className={`alpscr2-item ${filterType === "banned" ? "active" : ""}`}
                        onClick={() => setFilterType("banned")}
                    >
                        <FaListUl className="alpscr2-item-icon" />
                        <div className="amount">
                            <h5>Bị khóa</h5>
                            <p>{bannedCount} phụ huynh</p>
                        </div>
                    </div>
                </div>
                <div className="alpscr3">
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
                            {filteredParents.length > 0 ? (
                                filteredParents.map((parent, index) => (
                                    <tr className="table-body-row" key={index}>
                                        <td className="table-body-cell">
                                            {parent.username}
                                        </td>
                                        <td className="table-body-cell">
                                            {parent.email}
                                        </td>
                                        <td className="table-body-cell">
                                            {parent.isBanned === false ? (
                                                <span>Hoạt động</span>
                                            ) : parent.isBanned === true ? (
                                                <span>Đã bị khóa</span>
                                            ) : null}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDate(parent.createDate)}
                                        </td>
                                        <td className="table-body-cell">
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    className="pr-btn"
                                                    onClick={() =>
                                                        handleToDetail(parent.parentId)
                                                    }
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    className={parent.isBanned ? "sc-btn" : "delete-btn"}
                                                    onClick={() =>
                                                        handleBanUnban(
                                                            parent.parentId,
                                                            parent.username,
                                                            parent.isBanned || false
                                                        )
                                                    }
                                                >
                                                    {parent.isBanned ? "Mở khóa" : "Khóa"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-body-row">
                                    <td colSpan={5} className="table-body-cell" style={{ textAlign: "center", padding: "2rem" }}>
                                        Chưa có phụ huynh nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="alpscr4">
                    <div className="alpscr4-item">
                        <FaArrowLeft className="alpscr4-item-icon" />
                    </div>
                    <p className="alpscr4-page">{pageNumber}</p>
                    <div className="alpscr4-item">
                        <FaArrowRight className="alpscr4-item-icon" />
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

export default AdminListParentPage;
