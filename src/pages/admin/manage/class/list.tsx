import type { FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle } from "../../../../utils/helper";

const AdminListClassPage: FC = () => {
    useDocumentTitle("Danh sách lớp học");

    return (
        <section id="admin-list-class-section">
            <div className="alcs-container">
                <div className="alcscr1">
                    <h4>Lớp lọc</h4>
                    <p>
                        Trang tổng quát <span>Lớp lọc</span>
                    </p>
                </div>
                <div className="alcscr2">
                    <div className="alcscr2-item active">
                        <FaListUl className="alcscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 lớp lọc</p>
                        </div>
                    </div>
                    <div className="alcscr2-item">
                        <FaListUl className="alcscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã phê duyệt</h5>
                            <p>2 lớp lọc</p>
                        </div>
                    </div>
                    <div className="alcscr2-item">
                        <FaListUl className="alcscr2-item-icon" />
                        <div className="amount">
                            <h5>Chờ phê duyệt</h5>
                            <p>1 lớp lọc</p>
                        </div>
                    </div>
                </div>
                <div className="alcscr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Gia sư</th>
                                <th className="table-head-cell">Môn học</th>
                                <th className="table-head-cell">Số lượng người đăng ký</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian đăng ký
                                </th>
                                <th className="table-head-cell">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="table-body"></tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AdminListClassPage;
