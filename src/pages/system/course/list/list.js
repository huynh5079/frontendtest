import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { CourseCard } from "../../../../components/card";
import { FilterCourse } from "../../../../components/course/list";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectListPublicClasses } from "../../../../app/selector";
import { publicGetAllClassesApiThunk } from "../../../../services/public/class/classthunk";
import { useDocumentTitle } from "../../../../utils/helper";
const ListCoursePage = () => {
    const classes = useAppSelector(selectListPublicClasses);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(publicGetAllClassesApiThunk());
    }, [dispatch]);
    useDocumentTitle("Danh sách lớp học");
    return (_jsx("section", { id: "list-course-section", children: _jsxs("div", { className: "lcs-container", children: [_jsx("div", { className: "lcscr1", children: _jsx("h2", { children: "Danh s\u00E1ch l\u1EDBp h\u1ECDc" }) }), _jsxs("div", { className: "lcscr2", children: [_jsx("div", { className: "lcscr2c1", children: _jsx(FilterCourse, {}) }), _jsx("div", { className: "lcscr2c2", children: classes?.map((item) => (_jsx(CourseCard, { course: item }, item.id))) })] })] }) }));
};
export default ListCoursePage;
