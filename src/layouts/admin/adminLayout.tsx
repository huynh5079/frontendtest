import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { SidebarAdmin } from "../../components/admin/sidebar";
import { HeaderAdmin } from "../../components/admin/header";

const AdminLayout: FC = () => {
    return (
        <div id="admin">
            <SidebarAdmin />
            <HeaderAdmin />
            <main id="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
