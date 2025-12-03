import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaListUl } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListStudentsForAdmin } from "../../../../app/selector";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { routes } from "../../../../routes/routeName";
import { navigateHook } from "../../../../routes/routeApp";
import { getAllStudentForAdminApiThunk } from "../../../../services/admin/student/adminStudentThunk";
const AdminListStudentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const students = useAppSelector(selectListStudentsForAdmin);
    const handleToDetail = (studentId) => {
        const url = routes.admin.student.detail.replace(":id", studentId);
        return navigateHook(url);
    };
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
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [pageParam, pageNumber, navigate]);
    useDocumentTitle("Danh sách học viên");
    return (_jsx("section", { id: "admin-list-student-section", children: _jsxs("div", { className: "alss-container", children: [_jsxs("div", { className: "alsscr1", children: [_jsx("h4", { children: "H\u1ECDc vi\u00EAn" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "H\u1ECDc vi\u00EAn" })] })] }), _jsxs("div", { className: "alsscr2", children: [_jsxs("div", { className: "alsscr2-item active", children: [_jsx(FaListUl, { className: "alsscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 h\u1ECDc vi\u00EAn" })] })] }), _jsxs("div", { className: "alsscr2-item", children: [_jsx(FaListUl, { className: "alsscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u01B0\u1EE3c li\u00EAn k\u1EBFt" }), _jsx("p", { children: "2 h\u1ECDc vi\u00EAn" })] })] })] }), _jsx("div", { className: "alsscr3", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "H\u1ECD v\u00E0 t\u00EAn" }), _jsx("th", { className: "table-head-cell", children: "Email" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian tham gia" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: students?.map((student, index) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: student.username }), _jsx("td", { className: "table-body-cell", children: student.email }), _jsx("td", { className: "table-body-cell", children: student.isBanned === false ? (_jsx("span", { children: "Ho\u1EA1t \u0111\u1ED9ng" })) : student.isBanned === true ? (_jsx("span", { children: "\u0110\u00E3 b\u1ECB kh\u00F3a" })) : null }), _jsx("td", { className: "table-body-cell", children: formatDate(student.createDate) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => handleToDetail(student.studentId), children: "Xem chi ti\u1EBFt" }) })] }, index))) })] }) }), _jsxs("div", { className: "alsscr4", children: [_jsx("div", { className: "alsscr4-item", children: _jsx(FaArrowLeft, { className: "alsscr4-item-icon" }) }), _jsx("p", { className: "alsscr4-page", children: pageNumber }), _jsx("div", { className: "alsscr4-item", children: _jsx(FaArrowRight, { className: "alsscr4-item-icon" }) })] })] }) }));
};
export default AdminListStudentPage;
