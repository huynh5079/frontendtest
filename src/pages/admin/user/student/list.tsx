import { useEffect, type FC } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListStudentsForAdmin } from "../../../../app/selector";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";
import { getAllStudentForAdminApiThunk } from "../../../../services/admin/student/adminStudentThunk";

const AdminListStudentPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const students = useAppSelector(selectListStudentsForAdmin);

    const handleToDetail = (studentId: string) => {
        const url = routes.admin.student.detail.replace(":id", studentId);
        return navigateHook(url)
    }

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
                    <div className="alsscr2-item active">
                        <FaListUl className="alsscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 học viên</p>
                        </div>
                    </div>
                    <div className="alsscr2-item">
                        <FaListUl className="alsscr2-item-icon" />
                        <div className="amount">
                            <h5>Được liên kết</h5>
                            <p>2 học viên</p>
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
                             {students?.map((student, index) => (
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
                                        <button
                                            className="pr-btn"
                                            onClick={() => handleToDetail(student.studentId)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
        </section>
    );
};

export default AdminListStudentPage;
