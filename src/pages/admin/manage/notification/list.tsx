import type { FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle } from "../../../../utils/helper";

const AdminListNotificationPage: FC = () => {
    useDocumentTitle("Danh sách thông báo");

    return (
        <section id="admin-list-notification-section">
            <div className="alns-container">
                <div className="alnscr1">
                    <h4>Thông báo</h4>
                    <p>
                        Trang tổng quát <span>Thông báo</span>
                    </p>
                </div>
                <div className="alnscr2">
                    <div className="alnscr2-item active">
                        <FaListUl className="alnscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 thông báo</p>
                        </div>
                    </div>
                    <div className="alnscr2-item">
                        <FaListUl className="alnscr2-item-icon" />
                        <div className="amount">
                            <h5>Chưa đọc</h5>
                            <p>2 thông báo</p>
                        </div>
                    </div>
                    <div className="alnscr2-item">
                        <FaListUl className="alnscr2-item-icon" />
                        <div className="amount">
                            <h5>Đã đọc</h5>
                            <p>1 thông báo</p>
                        </div>
                    </div>
                </div>
                <div className="alnscr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Nội dung</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">Thời gian</th>
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

export default AdminListNotificationPage;
