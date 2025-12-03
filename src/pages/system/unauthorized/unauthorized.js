import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const UnauthorizedPage = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { children: [_jsx("h1", { children: "403 - Not Authenticated" }), _jsx("p", { children: "You don\u2019t have permission to access this page. Please return to the previous page or log in with the correct account." }), _jsx("div", { className: "flex gap-4", children: _jsx("button", { onClick: () => navigate(-1), children: "Go Back" }) })] }));
};
export default UnauthorizedPage;
