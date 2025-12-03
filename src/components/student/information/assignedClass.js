import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { selectListAssignedClassForStudent } from "../../../app/selector";
import { getAllAssignedClassForStudentApiThunk } from "../../../services/student/class/classThunk";
import { formatDate, getStatusText } from "../../../utils/helper";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const StudentAssignedClass = () => {
    const dispatch = useAppDispatch();
    const assignedClasses = useAppSelector(selectListAssignedClassForStudent);
    useEffect(() => {
        dispatch(getAllAssignedClassForStudentApiThunk());
    }, []);
    const handleViewDetail = (classId) => {
        const url = routes.student.course.detail.replace(":id", classId);
        navigateHook(url);
    };
    return (_jsxs("div", { className: "student-assigned-class", children: [_jsxs("div", { className: "sacr1", children: [_jsx("h3", { children: "L\u1EDBp h\u1ECDc \u0111\u0103ng k\u00FD" }), _jsx("button", { className: "pr-btn", onClick: () => navigateHook(routes.student.course.list), children: "\u0110i t\u00ECm l\u1EDBp h\u1ECDc" })] }), _jsx("div", { className: "sacr2", children: _jsxs("table", { className: "table", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { className: "table-head-row", children: [_jsx("th", { className: "table-head-cell", children: "T\u00EAn l\u1EDBp h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Gia s\u01B0" }), _jsx("th", { className: "table-head-cell", children: "Th\u1EDDi gian b\u1EAFt \u0111\u1EA7u h\u1ECDc" }), _jsx("th", { className: "table-head-cell", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "table-head-cell", children: "Thao t\u00E1c" })] }) }), _jsx("tbody", { className: "table-body", children: assignedClasses?.map((item) => (_jsxs("tr", { className: "table-body-row", children: [_jsx("td", { className: "table-body-cell", children: item.classTitle }), _jsx("td", { className: "table-body-cell", children: item.tutorName }), _jsx("td", { className: "table-body-cell", children: formatDate(item.classStartDate) }), _jsx("td", { className: "table-body-cell", children: getStatusText(item.classStatus) }), _jsx("td", { className: "table-body-cell", children: _jsx("button", { className: "pr-btn", onClick: () => handleViewDetail(item.classId), children: "Chi ti\u1EBFt" }) })] }, item.classId))) })] }) })] }));
};
export default StudentAssignedClass;
