import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { LandingBanner, LandingTopTutors } from "../../../components/landing";
import { FaSearch, FaBook, FaUserGraduate, FaLaptop, FaClock, FaLock, } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
import { useAppSelector } from "../../../app/store";
import { selectIsAuthenticated, selectUserLogin } from "../../../app/selector";
import { USER_PARENT, USER_STUDENT } from "../../../utils/helper";
const LandingPage = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUserLogin);
    const handle = () => {
        if (!isAuthenticated)
            return navigateHook(routes.register.student);
        if (user?.role === USER_PARENT)
            return navigateHook(routes.parent.tutor.list);
        if (user?.role === USER_STUDENT)
            return navigateHook(routes.student.tutor.list);
    };
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Trang chủ";
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("section", { id: "landing-s1", children: _jsx("div", { className: "ls1-container", children: _jsx(LandingBanner, {}) }) }), _jsx("section", { id: "landing-s2", children: _jsxs("div", { className: "ls2-container", children: [_jsx("div", { className: "ls2cr1", children: _jsx("h3", { children: "Ch\u1EC9 3 B\u01B0\u1EDBc \u0110\u01A1n Gi\u1EA3n \u0110\u1EC3 B\u1EAFt \u0110\u1EA7u" }) }), _jsxs("div", { className: "ls2cr2", children: [_jsxs("div", { className: "ls2cr2c1", children: [_jsx("h4", { children: "1. T\u00ECm ki\u1EBFm" }), _jsx(FaSearch, { className: "icon" }), _jsx("p", { children: "Ch\u1ECDn m\u00F4n h\u1ECDc, \u0111\u1ECBa \u0111i\u1EC3m, h\u00ECnh th\u1EE9c h\u1ECDc." })] }), _jsxs("div", { className: "ls2cr2c2", children: [_jsx("h4", { children: "2. K\u1EBFt n\u1ED1i" }), _jsx(IoChatbubbleEllipsesOutline, { className: "icon" }), _jsx("p", { children: "G\u1EEDi y\u00EAu c\u1EA7u v\u00E0 trao \u0111\u1ED5i v\u1EDBi gia s\u01B0." })] }), _jsxs("div", { className: "ls2cr2c3", children: [_jsx("h4", { children: "3. B\u1EAFt \u0111\u1EA7u h\u1ECDc" }), _jsx(FaBook, { className: "icon" }), _jsx("p", { children: "Thanh to\u00E1n v\u00E0 b\u1EAFt \u0111\u1EA7u bu\u1ED5i h\u1ECDc ngay." })] })] })] }) }), _jsx("section", { id: "landing-s3", children: _jsxs("div", { className: "ls3-container", children: [_jsx("div", { className: "ls3cr1", children: _jsx("h3", { children: "Gia S\u01B0 Ch\u1EA5t L\u01B0\u1EE3ng Cao, \u0110\u01B0\u1EE3c H\u1ECDc Vi\u00EAn \u0110\u00E1nh Gi\u00E1 5\u2B50" }) }), _jsx("div", { className: "ls3cr2", children: _jsx(LandingTopTutors, {}) })] }) }), _jsx("section", { id: "landing-s4", children: _jsxs("div", { className: "ls4-container", children: [_jsx("div", { className: "ls4cr1", children: _jsx("h3", { children: "T\u1EA1i Sao Ch\u1ECDn TPEDU?" }) }), _jsxs("div", { className: "ls4cr2", children: [_jsxs("div", { className: "ls4cr2-item", children: [_jsxs("div", { className: "ls4cr2-text", children: [_jsx("h4", { children: "H\u01A1n 1.000 gia s\u01B0 ch\u1EA5t l\u01B0\u1EE3ng" }), _jsx("p", { children: "Gia s\u01B0 \u0111\u01B0\u1EE3c tuy\u1EC3n ch\u1ECDn k\u1EF9 t\u1EEB c\u00E1c tr\u01B0\u1EDDng v\u00E0 t\u1ED5 ch\u1EE9c uy t\u00EDn, chuy\u00EAn m\u00F4n v\u1EEFng v\u00E0 t\u1EADn t\u00E2m gi\u1EA3ng d\u1EA1y." })] }), _jsx(FaUserGraduate, { className: "ls4cr2-icon" })] }), _jsxs("div", { className: "ls4cr2-item", children: [_jsxs("div", { className: "ls4cr2-text", children: [_jsx("h4", { children: "H\u1ECDc tr\u1EF1c ti\u1EBFp ho\u1EB7c tr\u1EF1c tuy\u1EBFn" }), _jsx("p", { children: "T\u00F9y ch\u1ECDn h\u1ECDc t\u1EA1i nh\u00E0, qu\u00E1n c\u00E0 ph\u00EA ho\u1EB7c online \u2013 ti\u1EC7n l\u1EE3i \u1EDF m\u1ECDi n\u01A1i." })] }), _jsx(FaLaptop, { className: "ls4cr2-icon" })] }), _jsxs("div", { className: "ls4cr2-item", children: [_jsxs("div", { className: "ls4cr2-text", children: [_jsx("h4", { children: "L\u1ECBch h\u1ECDc linh ho\u1EA1t" }), _jsx("p", { children: "D\u1EC5 d\u00E0ng s\u1EAFp x\u1EBFp, thay \u0111\u1ED5i th\u1EDDi gian h\u1ECDc ph\u00F9 h\u1EE3p v\u1EDBi l\u1ECBch tr\u00ECnh c\u1EE7a b\u1EA1n." })] }), _jsx(FaClock, { className: "ls4cr2-icon" })] }), _jsxs("div", { className: "ls4cr2-item", children: [_jsxs("div", { className: "ls4cr2-text", children: [_jsx("h4", { children: "An to\u00E0n & b\u1EA3o m\u1EADt" }), _jsx("p", { children: "Thanh to\u00E1n b\u1EA3o m\u1EADt, th\u00F4ng tin c\u00E1 nh\u00E2n \u0111\u01B0\u1EE3c b\u1EA3o v\u1EC7 tuy\u1EC7t \u0111\u1ED1i." })] }), _jsx(FaLock, { className: "ls4cr2-icon" })] })] })] }) }), _jsx("section", { id: "landing-s5", children: _jsxs("div", { className: "ls5-container", children: [_jsx("div", { className: "ls5cr1", children: _jsx("h3", { children: "S\u1EB5n S\u00E0ng B\u1EAFt \u0110\u1EA7u H\u00E0nh Tr\u00ECnh H\u1ECDc T\u1EADp C\u1EE7a B\u1EA1n?" }) }), _jsxs("div", { className: "ls5cr2", children: [_jsx("button", { className: "pr-btn ls5cr2-button", onClick: handle, children: "T\u00ECm gia s\u01B0 ngay" }), !isAuthenticated && (_jsx("button", { className: "sc-btn ls5cr2-button", onClick: () => navigateHook(routes.register.tutor), children: "Tr\u1EDF th\u00E0nh gia s\u01B0" }))] })] }) })] }));
};
export default LandingPage;
