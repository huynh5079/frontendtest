import { useEffect, type FC } from "react";
import { navigateHook } from "../../../routes/routeApp";
import { routes } from "../../../routes/routeName";

interface RegisterCard {
    title?: string;
    points: string[];
    buttonText: string;
    buttonClass: string;
    route: string;
}

const registerCards: RegisterCard[] = [
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

const RegisterPage: FC = () => {
    // === EFFECTS ===
    useEffect(() => {
        document.title = "Đăng ký";
    }, []);
    
    return (
        <section id="register-section">
            <div className="rs-container">
                {registerCards.map((card, index) => (
                    <div key={index} className={`rscr${index < 2 ? 1 : 2}`}>
                        <ul>
                            {card.points.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                        <button
                            className={card.buttonClass}
                            onClick={() => navigateHook(card.route)}
                        >
                            {card.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RegisterPage;
