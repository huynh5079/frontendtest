import type { FC } from "react";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle } from "../../../../utils/helper";

const AdminListTutorTransactionPage: FC = () => {
    useDocumentTitle("Lịch sử giao dịch với gia sư");
    
    return (
        <section id="admin-list-tutor-transaction-section">
            <div className="altts-container">
                <div className="alttscr1">
                    <h4>Gia sư</h4>
                    <p>
                        Trang tổng quát <span>Giao dịch</span>
                    </p>
                </div>
                <div className="alttscr2">
                    <div className="alttscr2-item active">
                        <FaListUl className="alttscr2-item-icon" />
                        <div className="amount">
                            <h5>Tất cả</h5>
                            <p>3 giao dịch</p>
                        </div>
                    </div>
                    <div className="alttscr2-item">
                        <FaListUl className="alttscr2-item-icon" />
                        <div className="amount">
                            <h5>Tiền chuyển</h5>
                            <p>2 giao dịch</p>
                        </div>
                    </div>
                    <div className="alttscr2-item">
                        <FaListUl className="alttscr2-item-icon" />
                        <div className="amount">
                            <h5>Tiền nhận</h5>
                            <p>1 giao dịch</p>
                        </div>
                    </div>
                </div>
                <div className="alttscr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Họ và tên</th>
                                <th className="table-head-cell">Số tiền</th>
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

export default AdminListTutorTransactionPage;