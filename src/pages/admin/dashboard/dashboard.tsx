import { type FC } from "react";
import { useDocumentTitle } from "../../../utils/helper";

const AdminDashboardPage: FC = () => {
    useDocumentTitle("Trang tổng quát");

    return (
        <section id="admin-dashboard-section">
        <div className="ads-container">
            <div className="adscr1">
                <div className="adscr1c1"></div>
                <div className="adscr1c2"></div>
            </div>
        </div>
    </section>
    );
};

export default AdminDashboardPage;
