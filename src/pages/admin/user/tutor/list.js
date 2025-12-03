import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListTutorsForAdmin } from "../../../../app/selector";
import { getAllTutorForAdminApiThunk } from "../../../../services/admin/tutor/adminTutorThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";
const AdminListTutorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const tutors = useAppSelector(selectListTutorsForAdmin);
    const handleToDetail = (tutorId) => {
        const url = routes.admin.tutor.detail.replace(":id", tutorId);
        return navigateHook(url);
    };
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
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [pageParam, pageNumber, navigate]);
    useDocumentTitle("Danh sách gia sư");
    return (_jsx("section", { id: "admin-list-tutor-section", children: _jsxs("div", { className: "alts-container", children: [_jsxs("div", { className: "altscr1", children: [_jsx("h4", { children: "Gia s\u01B0" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "Gia s\u01B0" })] })] }), _jsxs("div", { className: "altscr2", children: [_jsxs("div", { className: "altscr2-item active", children: [_jsx(FaListUl, { className: "altscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 gia s\u01B0" })] })] }), _jsxs("div", { className: "altscr2-item", children: [_jsx(FaListUl, { className: "altscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u00E3 ph\u00EA duy\u1EC7t" }), _jsx("p", { children: "2 gia s\u01B0" })] })] }), _jsxs("div", { className: "altscr2-item", children: [_jsx(FaListUl, { className: "altscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "Ch\u1EDD ph\u00EA duy\u1EC7t" }), _jsx("p", { children: "1 gia s\u01B0" })] })] })] }), _jsx("div", { className: "altscr3", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsx("th", { className: "table-head-cell", children: "Email" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian tham gia" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: tutors?.map((tutor, index) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: tutor.username }), _jsx("td", { className: "table-body-cell", children: tutor.email }), _jsx("td", { className: "table-body-cell", children: tutor.status === "PendingApproval" ? (_jsx("span", { children: "\u0110ang ch\u1EDD ph\u00EA duy\u1EC7t" })) : tutor.status === "Active" ? (_jsx("span", { children: "\u0110\u00E3 \u0111\u01B0\u1EE3c ph\u00EA duy\u1EC7t" })) : tutor.status === "Rejected" ? (_jsx("span", { children: "\u0110\u00E3 b\u1ECB t\u1EEB ch\u1ED1i" })) : tutor.status === "Canceled" ? (_jsx("span", { children: "\u0110\u00E3 hu\u1EF7" })) : null }), _jsx("td", { className: "table-body-cell", children: formatDate(tutor.createDate) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => handleToDetail(tutor.tutorId), children: "Xem chi ti\u1EBFt" }) })] }, index))) })] }) }), _jsxs("div", { className: "altscr4", children: [_jsx("div", { className: "altscr4-item", children: _jsx(FaArrowLeft, { className: "altscr4-item-icon" }) }), _jsx("p", { className: "altscr4-page", children: pageNumber }), _jsx("div", { className: "altscr4-item", children: _jsx(FaArrowRight, { className: "altscr4-item-icon" }) })] })] }) }));
};
export default AdminListTutorPage;
