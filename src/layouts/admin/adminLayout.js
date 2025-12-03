import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { SidebarAdmin } from "../../components/admin/sidebar";
import { HeaderAdmin } from "../../components/admin/header";
const AdminLayout = () => {
    return (_jsxs("div", { id: "admin", children: [_jsx(SidebarAdmin, {}), _jsx(HeaderAdmin, {}), _jsx("main", { id: "admin-main", children: _jsx(Outlet, {}) })] }));
};
export default AdminLayout;
