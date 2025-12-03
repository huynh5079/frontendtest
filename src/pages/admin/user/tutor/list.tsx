import { useEffect, type FC } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListTutorsForAdmin } from "../../../../app/selector";
import { getAllTutorForAdminApiThunk } from "../../../../services/admin/tutor/adminTutorThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";

const AdminListTutorPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const tutors = useAppSelector(selectListTutorsForAdmin);

    const handleToDetail = (tutorId: string) => {
        const url = routes.admin.tutor.detail.replace(":id", tutorId);
        return navigateHook(url)
    }

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
                    <div className="altscr2-item active">
                        <FaListUl className="altscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 gia sư</p>
                        </div>
                    </div>
                    <div className="altscr2-item">
                        <FaListUl className="altscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã phê duyệt</h5>
                            <p>2 gia sư</p>
                        </div>
                    </div>
                    <div className="altscr2-item">
                        <FaListUl className="altscr2-item-icon" />
                        <div className="amount">
                            <h5>Chờ phê duyệt</h5>
                            <p>1 gia sư</p>
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
                            {tutors?.map((tutor, index) => (
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
                                        <button
                                            className="pr-btn"
                                            onClick={() => handleToDetail(tutor.tutorId)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
        </section>
    );
};

export default AdminListTutorPage;
