import type { FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle } from "../../../../utils/helper";

const AdminListReportPage: FC = () => {
    useDocumentTitle("Danh sách báo cáo");

    return (
        <section id="admin-list-report-section">
            <div className="alrs-container">
                <div className="alrscr1">
                    <h4>Báo cáo và Khiếu nại</h4>
                    <p>
                        Trang tổng quát <span>Báo cáo và Khiếu nại</span>
                    </p>
                </div>
                <div className="alrscr2">
                    <div className="alrscr2-item active">
                        <FaListUl className="alrscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 Báo cáo và Khiếu nại</p>
                        </div>
                    </div>
                </div>
                <div className="alrscr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Người gửi</th>
                                <th className="table-head-cell">Nội dung</th>
                                <th className="table-head-cell">Thời gian gửi</th>
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

export default AdminListReportPage;
