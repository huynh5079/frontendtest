import { useEffect, type FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";
import { selectListParentsForAdmin } from "../../../../app/selector";
import { getAllParentForAdminApiThunk } from "../../../../services/admin/parent/adminParentThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";

const AdminListParentPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const parents = useAppSelector(selectListParentsForAdmin);

    const handleToDetail = (parrentId: string) => {
        const url = routes.admin.parent.detail.replace(":id", parrentId);
        return navigateHook(url);
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
            .then(() => {})
            .catch(() => {})
            .finally(() => {});
    }, [pageParam, pageNumber, navigate]);

    useDocumentTitle("Danh sách phụ huynh");
    
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
                    <div className="alpscr2-item active">
                        <FaListUl className="alpscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 phụ huynh</p>
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
                            {parents?.map((parent, index) => (
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
                                        <button
                                            className="pr-btn"
                                            onClick={() =>
                                                handleToDetail(parent.parentId)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AdminListParentPage;
