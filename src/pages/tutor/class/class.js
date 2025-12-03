import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { FaListUl, FaUserMinus, FaUsers } from "react-icons/fa";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListTutorClass } from "../../../app/selector";
import { getAllClassApiThunk } from "../../../services/tutor/class/classThunk";
import { formatDate, useDocumentTitle } from "../../../utils/helper";
const TutorClassPage = () => {
    const classes = useAppSelector(selectListTutorClass);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllClassApiThunk());
    }, [dispatch]);
    const handleViewDetail = (id) => {
        const url = routes.tutor.class.detail.replace(":id", id);
        navigateHook(url);
    };
    useDocumentTitle("Danh sách lớp học");
    return (_jsx("section", { id: "tutor-class-section", children: _jsxs("div", { className: "tcs-container", children: [_jsxs("div", { className: "tcscr1", children: [_jsx("h4", { children: "L\u1EDBp h\u1ECDc" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "L\u1EDBp h\u1ECDc" })] })] }), _jsxs("div", { className: "tcscr2", children: [_jsxs("div", { className: "tcscr2-item active", children: [_jsx(FaListUl, { className: "tcscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "T\u1EA5t c\u1EA3" }), _jsx("p", { children: "3 l\u1EDBp" })] })] }), _jsxs("div", { className: "tcscr2-item", children: [_jsx(FaUsers, { className: "tcscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "L\u1EDBp \u0111\u1EE7 th\u00E0nh vi\u00EAn" }), _jsx("p", { children: "2 l\u1EDBp" })] })] }), _jsxs("div", { className: "tcscr2-item", children: [_jsx(FaUserMinus, { className: "tcscr2-item-icon" }), _jsxs("div", { className: "amount", children: [_jsx("h5", { children: "L\u1EDBp thi\u1EBFu th\u00E0nh vi\u00EAn" }), _jsx("p", { children: "1 l\u1EDBp" })] })] })] }), _jsx("div", { className: "tcscr3", children: _jsx("button", { className: "pr-btn", onClick: () => navigateHook(routes.tutor.class.create), children: "T\u1EA1o l\u1EDBp h\u1ECDc" }) }), _jsx("div", { className: "tcscr4", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "M\u00F4n d\u1EA1y" }), _jsx("th", { className: "table-head-cell", children: "C\u1EA5p b\u1EADc l\u1EDBp h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian b\u1EAFt \u0111\u1EA7u h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: classes?.map((item) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: item.subject }), _jsx("td", { className: "table-body-cell", children: item.educationLevel }), _jsx("td", { className: "table-body-cell", children: item.status }), _jsx("td", { className: "table-body-cell", children: formatDate(item.classStartDate) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => {
                                                    handleViewDetail(item.id);
                                                }, children: "Chi ti\u1EBFt" }) })] }, item.id))) })] }) })] }) }));
};
export default TutorClassPage;
