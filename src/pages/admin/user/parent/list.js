import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";
import { selectListParentsForAdmin } from "../../../../app/selector";
import { getAllParentForAdminApiThunk } from "../../../../services/admin/parent/adminParentThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
const AdminListParentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const parents = useAppSelector(selectListParentsForAdmin);
    const handleToDetail = (parrentId) => {
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
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [pageParam, pageNumber, navigate]);
    useDocumentTitle("Danh sách phụ huynh");
    return (_jsx("section", { id: "admin-list-parent-section", children: _jsxs("div", { className: "alps-container", children: [_jsxs("div", { className: "alpscr1", children: [_jsx("h4", { children: "Ph\u1EE5 huynh" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "Ph\u1EE5 huynh" })] })] }), _jsx("div", { className: "alpscr2", children: _jsxs("div", { className: "alpscr2-item active", children: [_jsx(FaListUl, { className: "alpscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 ph\u1EE5 huynh" })] })] }) }), _jsx("div", { className: "alpscr3", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsx("th", { className: "table-head-cell", children: "Email" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian tham gia" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: parents?.map((parent, index) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: parent.username }), _jsx("td", { className: "table-body-cell", children: parent.email }), _jsx("td", { className: "table-body-cell", children: parent.isBanned === false ? (_jsx("span", { children: "Ho\u1EA1t \u0111\u1ED9ng" })) : parent.isBanned === true ? (_jsx("span", { children: "\u0110\u00E3 b\u1ECB kh\u00F3a" })) : null }), _jsx("td", { className: "table-body-cell", children: formatDate(parent.createDate) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => handleToDetail(parent.parentId), children: "Xem chi ti\u1EBFt" }) })] }, index))) })] }) })] }) }));
};
export default AdminListParentPage;
