import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaListUl } from "react-icons/fa";
import { useDocumentTitle } from "../../../../utils/helper";
const AdminListReportPage = () => {
    useDocumentTitle("Danh sách báo cáo");
    return (_jsx("section", { id: "admin-list-report-section", children: _jsxs("div", { className: "alrs-container", children: [_jsxs("div", { className: "alrscr1", children: [_jsx("h4", { children: "B\u00E1o c\u00E1o v\u00E0 Khi\u1EBFu n\u1EA1i" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "B\u00E1o c\u00E1o v\u00E0 Khi\u1EBFu n\u1EA1i" })] })] }), _jsx("div", { className: "alrscr2", children: _jsxs("div", { className: "alrscr2-item active", children: [_jsx(FaListUl, { className: "alrscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 B\u00E1o c\u00E1o v\u00E0 Khi\u1EBFu n\u1EA1i" })] })] }) }), _jsx("div", { className: "alrscr3", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "Ng\u01B0\u1EDDi g\u1EEDi" }), _jsx("th", { className: "table-head-cell", children: "N\u1ED9i dung" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian g\u1EEDi" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body" })] }) })] }) }));
};
export default AdminListReportPage;
