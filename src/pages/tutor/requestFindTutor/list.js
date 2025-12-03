import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListRequestFindTutorForTutor } from "../../../app/selector";
import { getAllRequestFindTutorForTutorApiThunk } from "../../../services/tutor/requestFindTutor/requestFindTutorThunk";
import { routes } from "../../../routes/routeName";
import { navigateHook } from "../../../routes/routeApp";
import { FaArrowCircleDown, FaArrowCircleUp, FaListUl } from "react-icons/fa";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
const ListReuqestFindtutorForTutorPage = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector(selectListRequestFindTutorForTutor);
    useEffect(() => {
        dispatch(getAllRequestFindTutorForTutorApiThunk());
    }, [dispatch]);
    const handleViewDetail = (id) => {
        const url = routes.tutor.request.detail.replace(":id", id);
        navigateHook(url);
    };
    useDocumentTitle("Danh sách đơn tìm gia sư");
    return (_jsx("section", { id: "list-request-find-tutor-for-tutor-section", children: _jsxs("div", { className: "lrftfts-container", children: [_jsxs("div", { className: "lrftftscr1", children: [_jsx("h4", { children: "Danh s\u00E1nh" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "\u0110\u01A1n t\u00ECm gia s\u01B0" })] })] }), _jsxs("div", { className: "lrftftscr2", children: [_jsxs("div", { className: "lrftftscr2-item active", children: [_jsx(FaListUl, { className: "lrftftscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 \u0111\u01A1n" })] })] }), _jsxs("div", { className: "lrftftscr2-item", children: [_jsx(FaArrowCircleUp, { className: "lrftftscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u1EE3i x\u1EEF l\u00ED" }), _jsx("p", { children: "2 \u0111\u01A1n" })] })] }), _jsxs("div", { className: "lrftftscr2-item", children: [_jsx(FaArrowCircleUp, { className: "lrftftscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u00E3 \u1EE9ng tuy\u1EC3n" }), _jsx("p", { children: "2 \u0111\u01A1n" })] })] }), _jsxs("div", { className: "lrftftscr2-item", children: [_jsx(FaArrowCircleDown, { className: "lrftftscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "\u0110\u00E3 t\u1EEB ch\u1ED1i" }), _jsx("p", { children: "1 giao d\u1ECBch" })] })] })] }), _jsx("div", { className: "lrftftscr4", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "T\u00EAn ng\u01B0\u1EDDi \u0111\u1EB7t" }), _jsx("th", { className: "table-head-cell", children: "M\u00F4n h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "C\u1EA5p b\u1EADc h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian g\u1EEDi" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: requests?.map((request) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: request.studentName }), _jsx("td", { className: "table-body-cell", children: request.subject }), _jsx("td", { className: "table-body-cell", children: request.educationLevel }), _jsx("td", { className: "table-body-cell", children: formatDate(request.createdAt) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => handleViewDetail(request.id), children: "Xem chi ti\u1EBFt" }) })] }, request.id))) })] }) })] }) }));
};
export default ListReuqestFindtutorForTutorPage;
