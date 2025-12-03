import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";
const registerCards = [
    {
        points: [
            "Học cùng 1.000+ gia sư chất lượng",
            "Trải nghiệm hơn 100+ khóa học đa dạng",
        ],
        buttonText: "Học viên đăng ký",
        buttonClass: "pr-btn",
        route: routes.register.student,
    },
    {
        points: [
            "Chọn gia sư uy tín, được kiểm chứng",
            "An tâm với khóa học chất lượng cao",
        ],
        buttonText: "Phụ huynh đăng ký",
        buttonClass: "sc-btn",
        route: routes.register.parent,
    },
    {
        points: ["Đăng khóa học miễn phí", "Không giới hạn số lượng khóa học"],
        buttonText: "Gia sư đăng ký",
        buttonClass: "pr-btn",
        route: routes.register.tutor,
    },
];
const RegisterPage = () => {
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký";
    }, []);
    return (_jsx("section", { id: "register-section", children: _jsx("div", { className: "rs-container", children: registerCards.map((card, index) => (_jsxs("div", { className: `rscr${index < 2 ? 1 : 2}`, children: [_jsx("ul", { children: card.points.map((point, i) => (_jsx("li", { children: point }, i))) }), _jsx("button", { className: card.buttonClass, onClick: () => navigateHook(card.route), children: card.buttonText })] }, index))) }) }));
};
export default RegisterPage;
