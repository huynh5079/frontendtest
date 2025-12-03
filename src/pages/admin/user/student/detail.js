import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectStudentForAdmin } from "../../../../app/selector";
import { getDetailStudentForAdminApiThunk } from "../../../../services/admin/student/adminStudentThunk";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
const AdminDetailStudentPage = () => {
    const { id } = useParams();
    const student = useAppSelector(selectStudentForAdmin);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getDetailStudentForAdminApiThunk(String(id)))
            .unwrap()
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [dispatch, id]);
    useDocumentTitle(`Học viên ${student?.username}`);
    return (_jsx("section", { id: "admin-detail-student-section", children: _jsxs("div", { className: "adss-container", children: [_jsxs("div", { className: "adsscr1", children: [_jsx("h4", { children: "H\u1ECDc sinh" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "Chi ti\u1EBFt" })] })] }), _jsx("div", { className: "adsscr2", children: _jsx("div", { className: "pr-btn", onClick: () => {
                            navigateHook(routes.admin.student.list);
                        }, children: "Quay l\u1EA1i" }) }), _jsx("div", { className: "adsscr3", children: _jsxs("div", { className: "adsscr3r1", children: [_jsxs("div", { className: "adsscr3r1c1", children: [_jsx("h5", { children: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" }), _jsx("img", { className: "avatar", src: student?.avatarUrl, alt: "" })] }), _jsxs("div", { className: "adsscr3r1c2", children: [_jsx("h5", { children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), _jsx("h6", { children: "H\u1ECD v\u00E0 t\u00EAn:" }), _jsx("p", { children: student?.username }), _jsx("h6", { children: "Gi\u1EDBi t\u00EDnh:" }), _jsx("p", { children: student?.gender || "Chưa cập nhật" }), _jsx("h6", { children: "Email:" }), _jsx("p", { children: student?.email }), _jsx("h6", { children: "\u0110\u1ECBa ch\u1EC9:" }), _jsx("p", { children: student?.address || "Chưa cập nhật" }), _jsx("h6", { children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:" }), _jsx("p", { children: student?.phone || "Chưa cập nhật" }), _jsx("h6", { children: "Ng\u00E0y sinh:" }), _jsx("p", { children: student?.dateOfBirth || "Chưa cập nhật" }), _jsx("h6", { children: "Ng\u00E0y tham gia:" }), _jsx("p", { children: formatDate(String(student?.createDate)) })] })] }) })] }) }));
};
export default AdminDetailStudentPage;
