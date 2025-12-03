import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { navigateHook } from "../../../../routes/routeApp";
import { routes } from "../../../../routes/routeName";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectParentForAdmin, } from "../../../../app/selector";
import { formatDate, useDocumentTitle } from "../../../../utils/helper";
import { getDetailParentForAdminApiThunk } from "../../../../services/admin/parent/adminParentThunk";
const AdminDetailParentPage = () => {
    const { id } = useParams();
    const parent = useAppSelector(selectParentForAdmin);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getDetailParentForAdminApiThunk(String(id)))
            .unwrap()
            .then(() => { })
            .catch(() => { })
            .finally(() => { });
    }, [dispatch, id]);
    useDocumentTitle(`Phụ huynh ${parent?.username}`);
    return (_jsx("section", { id: "admin-detail-parent-section", children: _jsxs("div", { className: "adps-container", children: [_jsxs("div", { className: "adpscr1", children: [_jsx("h4", { children: "Ph\u1EE5 huynh" }), _jsxs("p", { children: ["Trang t\u1ED5ng qu\u00E1t ", _jsx("span", { children: "Chi ti\u1EBFt" })] })] }), _jsx("div", { className: "adpscr2", children: _jsx("div", { className: "pr-btn", onClick: () => {
                            navigateHook(routes.admin.parent.list);
                        }, children: "Quay l\u1EA1i" }) }), _jsx("div", { className: "adpscr3", children: _jsxs("div", { className: "adpscr3r1", children: [_jsxs("div", { className: "adpscr3r1c1", children: [_jsx("h5", { children: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" }), _jsx("img", { className: "avatar", src: parent?.avatarUrl, alt: "" })] }), _jsxs("div", { className: "adpscr3r1c2", children: [_jsx("h5", { children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), _jsx("h6", { children: "H\u1ECD v\u00E0 t\u00EAn:" }), _jsx("p", { children: parent?.username }), _jsx("h6", { children: "Gi\u1EDBi t\u00EDnh:" }), _jsx("p", { children: parent?.gender || "Chưa cập nhật" }), _jsx("h6", { children: "Email:" }), _jsx("p", { children: parent?.email }), _jsx("h6", { children: "\u0110\u1ECBa ch\u1EC9:" }), _jsx("p", { children: parent?.address || "Chưa cập nhật" }), _jsx("h6", { children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:" }), _jsx("p", { children: parent?.phone || "Chưa cập nhật" }), _jsx("h6", { children: "Ng\u00E0y sinh:" }), _jsx("p", { children: parent?.dateOfBirth || "Chưa cập nhật" }), _jsx("h6", { children: "Ng\u00E0y tham gia:" }), _jsx("p", { children: formatDate(String(parent?.createDate)) })] })] }) })] }) }));
};
export default AdminDetailParentPage;
